import { useState, useEffect, ReactNode } from "react";
import { Provider } from "rxdb-hooks";
import initialize from "@/lib/db/database.ts";
import { Database } from "@/lib/db/schema.ts";

const RxProvider = ({ children }: { children: ReactNode }) => {
    const [db, setDb] = useState<Database>();

    useEffect(() => {
        // RxDB instantiation can be asynchronous
        initialize().then(setDb);
    }, []);

    // Until db becomes available, consumer hooks that
    // depend on it will still work, absorbing the delay
    // by setting their state to isFetching:true
    return <Provider db={db}>{children}</Provider>;
};

export default RxProvider;
