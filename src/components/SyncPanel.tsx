import { useNetworkState } from "@uidotdev/usehooks";
import { FaPlug, FaSync } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { ReplicatorContext } from "@/components/RxProvider.tsx";
import { Link } from "@tanstack/react-router";
import { RxError } from "rxdb";
import { cn } from "@/lib/utils.ts";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button.tsx";

export default function SyncPanel() {
    const { online } = useNetworkState();
    const [errors, setErrors] = useState<RxError[]>([]);
    const [syncing, setSyncing] = useState(false);
    const [synced, setSynced] = useState<Date | undefined>(undefined);
    const replication = useContext(ReplicatorContext);

    // const { session } = useSession();

    // Subscribe to finished sync event
    useEffect(() => {
        if (online) replication.awaitInSync().then(() => setSynced(new Date()));
    }, [online]);

    // Sync when network reconnects
    useEffect(() => {
        if (!online) {
            replication?.cancel();
        } else if (replication?.isStopped()) {
            // TODO: get this working without refreshing page
            replication?.start();
        } else {
            replication?.reSync();
        }
    }, [online, replication]);

    // Listen to events
    useEffect(() => {
        replication?.error$.subscribe((error: RxError) => {
            setErrors([...errors, error]);
            console.log(error.message);
        });
        replication?.active$.subscribe((s: boolean) => setSyncing(s));
    }, [errors, replication, replication?.active$, replication?.error$]);

    const syncButtonHandler = () => {
        if (online) replication?.reSync();
    };

    return (
        <>
            <div
                className={`flex flex-row space-x-2 items-center justify-between p-3 rounded-full bg-secondary-200 dark:bg-secondary-900`}
            >
                <Link
                    to={"/settings"}
                    title={online ? "Online" : "Offline"}
                    className={cn(
                        "border border-secondary-400 dark:border-secondary-800 rounded-full flex items-center p-3 hover:bg-secondary-300 dark:hover:bg-secondary-800",
                        online ? "text-green-600" : "text-amber-600",
                    )}
                >
                    <FaPlug />
                </Link>
                <div className="flex flex-col text-center">
                    <span className="text-sm">
                        {synced ? "Synced" : "Waiting..."}
                    </span>
                    {!!synced && (
                        <span className="text-xs dark:text-secondary-400 text-secondary-500">
                            {dayjs().from(dayjs(synced), true)} ago
                        </span>
                    )}
                    <Link
                        to={"/settings"}
                        className="text-xs text-red-700 hover:underline"
                    >
                        {!!errors.length && `${errors.length} errors`}
                    </Link>
                </div>
                <Button
                    variant={"outline"}
                    className={cn(
                        "border border-secondary-800 p-3 rounded-full hover:bg-secondary-700",
                        {
                            "animate-spin text-green-600": syncing,
                        },
                    )}
                    onClick={syncButtonHandler}
                >
                    <FaSync />
                </Button>
            </div>
        </>
    );
}
