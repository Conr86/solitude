import { Helmet } from "react-helmet";
import { useCallback, useEffect, useState } from "react";
import { Database, Settings } from "@/lib/db/schema.ts";
import { useRxDB } from "rxdb-hooks";
import { FaSave, FaSignOutAlt, FaTrash } from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { removeRxDatabase } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { useNavigate } from "@tanstack/react-router";
import { Auth } from "@supabase/auth-ui-react";
import { Button, buttonVariants } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { Input } from "@/components/ui/input.tsx";
import useSession from "@/lib/useSession.ts";

dayjs.extend(relativeTime);

export default function Settings() {
    const db: Database = useRxDB();
    const [dirty, setDirty] = useState(false);
    const [settings, setSettings] = useState<Settings>({
        SUPABASE_KEY: "",
        SUPABASE_URL: "",
    });
    const navigate = useNavigate({ from: "/settings" });

    const { session, supabase } = useSession();

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

    const clearData = useCallback(() => {
        console.log("Clearing db...");
        removeRxDatabase("solitude", getRxStorageDexie()).then(() =>
            navigate({ to: "/" }),
        );
    }, [navigate]);

    return (
        <div className="flex flex-col space-y-4">
            <Helmet>
                <title>Settings - Solitude</title>
            </Helmet>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl">Settings</h1>
                <Button type="button" variant="destructive" onClick={clearData}>
                    <FaTrash className="mr-3" /> Clear Data
                </Button>
            </div>
            <form
                className="flex flex-col space-y-4"
                onSubmit={() => updateSettings(settings)}
            >
                <label htmlFor="SUPABASE_URL">Supabase URL</label>
                <div className="relative w-full">
                    <Input
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
                        placeholder="https://<xyz>.supabase.co"
                    />
                </div>
                <label htmlFor="SUPABASE_KEY">Supabase Anon Key</label>
                <div className="relative w-full">
                    <Input
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
                        placeholder="<your supabase anon key>"
                    />
                </div>
                <div className="flex flex-row justify-end">
                    {session && (
                        <Button className="mr-auto flex gap-2">
                            <FaSignOutAlt /> Logout
                        </Button>
                    )}
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
            <div>
                {!session && supabase && (
                    <>
                        <h2 className="text-2xl mb-4">Account</h2>
                        <Auth
                            supabaseClient={supabase}
                            appearance={{
                                extend: false,
                                className: {
                                    anchor: buttonVariants({ variant: "link" }),
                                    button: cn(
                                        buttonVariants({
                                            variant: "default",
                                        }),
                                        "gap-2",
                                    ),
                                    container: "flex flex-col gap-4",
                                    divider:
                                        "my-4 shrink-0 bg-secondary-200 h-[1px] w-full",
                                    input: "mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                                    label: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                                },
                            }}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
