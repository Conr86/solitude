import { useState, useEffect, ReactNode, createContext } from "react";
import { Provider } from "rxdb-hooks";
import initialize from "@/lib/db/database.ts";
import { Database } from "@/lib/db/schema.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { SupabaseReplication } from "rxdb-supabase";

export const ReplicatorContext = createContext<SupabaseReplication | undefined>(
    undefined,
);

const RxProvider = ({ children }: { children: ReactNode }) => {
    const [db, setDb] = useState<Database>();
    const [replicator, setReplicator] = useState<SupabaseReplication>();

    useEffect(() => {
        // RxDB instantiation can be asynchronous
        initialize().then(({ db, replicator }) => {
            setDb(db);
            setReplicator(replicator);
        });
    }, []);

    // Until db becomes available, consumer hooks that
    // depend on it will still work, absorbing the delay
    // by setting their state to isFetching:true
    return (
        <Provider db={db}>
            <ReplicatorContext.Provider value={replicator}>
                {children}
            </ReplicatorContext.Provider>
        </Provider>
    );
};

export default RxProvider;
