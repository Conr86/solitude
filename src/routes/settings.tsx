import { Helmet } from "react-helmet";
import { useCallback, useEffect, useState } from "react";
import { Database, Settings } from "@/lib/db/schema.ts";
import { useRxDB } from "rxdb-hooks";
import { Button } from "@/components/Button.tsx";
import { FaSave } from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function Settings() {
    const db: Database = useRxDB();
    const [dirty, setDirty] = useState(false);
    const [settings, setSettings] = useState<Settings>({
        SUPABASE_KEY: "",
        SUPABASE_URL: "",
    });

    useEffect(() => {
        db
            ?.getLocal<Settings>("settings")
            .then((s) => s && setSettings(s.toJSON().data));
    }, [db]);

    const updateSettings = useCallback(
        (data: Settings) => {
            db.upsertLocal("settings", data).then((s) => console.log(s));
        },
        [db],
    );

    return (
        <div className="flex flex-col space-y-4">
            <Helmet>
                <title>Settings - Solitude</title>
            </Helmet>
            <h1 className="text-3xl">Settings</h1>
            <form
                className="flex flex-col space-y-4"
                onSubmit={() => updateSettings(settings)}
            >
                <label htmlFor="SUPABASE_URL">Supabase URL</label>
                <div className="relative w-full">
                    <input
                        id="SUPABASE_URL"
                        type="text"
                        value={settings.SUPABASE_URL ?? ""}
                        onChange={(e) => {
                            setDirty(true);
                            setSettings({
                                ...settings,
                                SUPABASE_URL: e.target.value,
                            });
                        }}
                        className="bg-gray-50 outline-none focus:border-primary-700 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="https://<xyz>.supabase.co"
                    />
                </div>
                <label htmlFor="SUPABASE_KEY">Supabase Anon Key</label>
                <div className="relative w-full">
                    <input
                        id="SUPABASE_KEY"
                        type="text"
                        value={settings.SUPABASE_KEY ?? ""}
                        onChange={(e) => {
                            setDirty(true);
                            setSettings({
                                ...settings,
                                SUPABASE_KEY: e.target.value,
                            });
                        }}
                        className="bg-gray-50 outline-none focus:border-primary-700 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="<your supabase anon key>"
                    />
                </div>
                <div className="flex flex-row justify-end">
                    <span
                        className={`block relative rounded-full top-3 mr-4 ${
                            dirty ? "bg-amber-500 animate-pulse" : "hidden"
                        }`}
                        style={{ height: 16, width: 16 }}
                    />
                    <Button type="submit">
                        <FaSave className="mr-3" /> Save
                    </Button>
                </div>
            </form>
        </div>
    );
}
