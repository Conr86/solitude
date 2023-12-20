import { createRxDatabase, addRxPlugin } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { pageSchema, Database, Settings } from "./schema.ts";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { RxDBLocalDocumentsPlugin } from "rxdb/plugins/local-documents";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { SupabaseReplication } from "rxdb-supabase";
import { createClient } from "@supabase/supabase-js";
addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBLeaderElectionPlugin);
addRxPlugin(RxDBLocalDocumentsPlugin);

const loggingEnabled = false;
const log = (message: string) =>
    loggingEnabled ? console.log(`DatabaseService: ${message}`) : undefined;

const initialize = async () => {
    log("creating database..");
    const db: Database = await createRxDatabase({
        name: "solitude",
        storage: getRxStorageDexie(),
        ignoreDuplicate: true,
        localDocuments: true,
    });
    log("created database");

    db.waitForLeadership().then(() => {
        log("isLeader now");
    });

    log("create collections");
    await db.addCollections({
        pages: {
            schema: pageSchema,
        },
    });

    log("add hooks");
    db.collections.pages.preInsert(async (page) => {
        const { id } = page;
        const pageExists = await db.collections.pages
            .findOne({
                selector: { id },
            })
            .exec();
        if (!pageExists) page.created_at = new Date().toISOString();
        page.updated_at = new Date().toISOString();
        return db;
    }, false);

    let replicator = undefined;
    try {
        const settings = (await db.getLocal<Settings>("settings"))?.toJSON()
            .data;

        if (!settings) {
            await db.upsertLocal("settings", {
                SUPABASE_KEY: undefined,
                SUPABASE_URL: undefined,
            });
        }

        if (settings?.SUPABASE_URL && settings?.SUPABASE_KEY) {
            const supabase = createClient(
                settings?.SUPABASE_URL,
                settings?.SUPABASE_KEY,
            );
            replicator = new SupabaseReplication({
                supabaseClient: supabase,
                collection: db.collections.pages,
                replicationIdentifier: settings?.SUPABASE_URL, // TODO: Add Supabase user ID?
                pull: {},
                push: {}, // If absent, no changes are pushed to Supabase
            });
        }
    } catch (e) {
        log(`couldn't create Supabase replication service. ${e}`);
        throw e;
    }
    log("done");
    return { db, replicator };
};

export default initialize;
