import { createRxDatabase, addRxPlugin } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { pageSchema, Database } from "./schema.ts";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";

addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBLeaderElectionPlugin);

const initialize = async () => {
    console.log("DatabaseService: creating database..");
    const db: Database = await createRxDatabase({
        name: "solitude",
        storage: getRxStorageDexie(),
        ignoreDuplicate: true,
    });
    console.log("DatabaseService: created database");

    db.waitForLeadership().then(() => {
        console.log("DatabaseService: isLeader now");
    });

    console.log("DatabaseService: create collections");
    await db.addCollections({
        pages: {
            schema: pageSchema,
        },
    });

    console.log("DatabaseService: add hooks");
    db.collections.pages.preInsert(async (page) => {
        const { id } = page;
        const pageExists = await db.collections.pages
            .findOne({
                selector: { id },
            })
            .exec();
        if (!pageExists) page.createdAt = new Date().toISOString();
        page.updatedAt = new Date().toISOString();
        return db;
    }, false);

    // sync
    // console.log("DatabaseService: sync");
    // await Promise.all(
    //     Object.values(db.collections).map(async (col) => {
    //         try {
    //             // create the CouchDB database
    //             await fetch(syncURL + col.name + "/", {
    //                 method: "PUT",
    //             });
    //         } catch (err) {}
    //     }),
    // );
    // console.log("DatabaseService: sync - start live");
    // Object.values(db.collections)
    //     .map((col) => col.name)
    //     .map((colName) => {
    //         const url = syncURL + colName + "/";
    //         console.log("url: " + url);
    //         const replicationState = replicateCouchDB({
    //             collection: db[colName],
    //             url,
    //             live: true,
    //             pull: {},
    //             push: {},
    //             autoStart: true,
    //         });
    //         replicationState.error$.subscribe((err) => {
    //             console.log("Got replication error:");
    //             console.dir(err);
    //         });
    //     });
    console.log("DatabaseService: done");
    return db;
};

export default initialize;
