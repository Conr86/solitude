import { useEffect, useMemo, useState } from "react";
import { createClient, Session } from "@supabase/supabase-js";
import { Database, Settings } from "@/lib/db/schema.ts";
import { useRxDB } from "rxdb-hooks";

export default function useSession() {
    const db: Database = useRxDB();

    const [settings, setSettings] = useState<Settings>({
        SUPABASE_KEY: "",
        SUPABASE_URL: "",
    });
    const supabase = useMemo(
        () =>
            settings.SUPABASE_URL && settings.SUPABASE_KEY
                ? createClient(settings.SUPABASE_URL, settings.SUPABASE_KEY)
                : undefined,
        [settings],
    );
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        db
            ?.getLocal<Settings>("settings")
            .then((s) => s && setSettings(s.toJSON().data));
    }, [db]);

    useEffect(() => {
        supabase?.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const call = supabase?.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        const subscription = call?.data.subscription;

        return () => subscription?.unsubscribe();
    }, [settings]);

    return { session, supabase };
}
