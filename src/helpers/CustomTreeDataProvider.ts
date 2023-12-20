import {
    Disposable,
    TreeDataProvider,
    TreeItem,
    TreeItemIndex,
} from "react-complex-tree";
import { Page } from "@/helpers/schema.ts";
import { RxCollection } from "rxdb";

/*
    Hacky modification of StaticTreeDataProvider that redraws the tree when the contents change.

    onDidChangeTreeData is called automatically when data changes - and we redraw the entire tree by telling the listener that every item has changed

    Might need to be optimised (to only redraw the actual items that have changed) but that would require knowing what items are changed
    Which is not something stored currently.
*/

export class CustomTreeDataProvider implements TreeDataProvider {
    private readonly data: Record<TreeItemIndex, TreeItem<Page | undefined>>;
    private collection: RxCollection<Page> | null;
    constructor(
        items: Page[] | undefined,
        collection: RxCollection<Page> | null,
    ) {
        this.collection = collection;
        this.data = {};
        this.data["root"] = {
            index: "root",
            canMove: false,
            isFolder: false,
            children: [],
            data: undefined,
            canRename: false,
        };

        if (items == undefined) return;

        this.data["root"].children = [
            ...Array.from(items)
                .filter((p) => !p.parentId)
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((p) => p.id),
        ];
        this.data["root"].data = items[0];

        Array.from(items).forEach((p: Page) => {
            this.data[p.id] = {
                index: p.id,
                canMove: true,
                isFolder: true,
                children: items
                    .filter((i) => i.parentId === p.id)
                    ?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((p) => p.id),
                data: p,
                canRename: false,
            };
        });
    }

    public getParentId(itemId: TreeItemIndex): TreeItemIndex | null {
        if (!this.data[itemId]) return null;
        return this.data[itemId].data?.parentId || null;
    }

    public getLinearPathToRoot(itemId: TreeItemIndex): TreeItemIndex[] {
        const expandedItems: TreeItemIndex[] = [];
        for (let id: TreeItemIndex | null = itemId; id != null && id != 0; ) {
            expandedItems.push(id);
            id = this.getParentId(id);
            if (id != null && expandedItems.includes(id)) break;
        }
        return expandedItems;
    }

    public async onChangeItemChildren(
        itemId: TreeItemIndex,
        newChildren: TreeItemIndex[],
    ): Promise<void> {
        this.data[itemId].children = newChildren;
        console.log(
            `Item ${itemId} children changed, with new children: ` +
                newChildren.toString(),
        );
        const documents = await this.collection
            ?.findByIds(newChildren as string[])
            .exec();
        documents?.forEach((d) => {
            d.incrementalPatch({
                order: newChildren.findIndex((c) => c === d.id),
            });
        });
    }
    public async getTreeItem(itemId: TreeItemIndex): Promise<TreeItem> {
        return this.data[itemId];
    }
    public onDidChangeTreeData(
        listener: (changedItemIds: TreeItemIndex[]) => void,
    ): Disposable {
        // console.log("Tree did change - redrawing tree...");
        listener(Object.keys(this.data));
        return { dispose: () => {} };
    }

    // public async onRenameItem(item: TreeItem<any>, name: string): Promise<void> {    }

    public async updateParent(id: string, parentId: string | undefined) {
        const doc = await this.collection
            ?.findOne({
                selector: {
                    id,
                },
            })
            .exec();
        await doc?.incrementalPatch({
            parentId,
        });
    }
}
