import { Disposable, TreeDataProvider, TreeItem, TreeItemIndex } from "react-complex-tree";
import { Prisma } from 'prisma/prisma-client'

/*
    Hacky modification of StaticTreeDataProvider that redraws the tree when the contents change.

    onDidChangeTreeData is called automatically when data changes - and we redraw the entire tree by telling the listener that every item has changed

    Might need to be optimised (to only redraw the actual items that have changed) but that would require knowing what items are changed
    Which is not something stored currently.
*/

// Create PageWithChildren type
const pageWithChildren = Prisma.validator<Prisma.PageArgs>()({
    include: { children: { select: {id : true}} },
  })
export type PageWithChildren = Prisma.PageGetPayload<typeof pageWithChildren>

export class CustomTreeDataProvider implements TreeDataProvider {
    private data: Record<TreeItemIndex, TreeItem<PageWithChildren | undefined>>;

    constructor(items: PageWithChildren[]) {
        this.data = {}
        this.data['root'] = {
            index: 'root',
            canMove: false,
            isFolder: false,
            children: [],
            data: undefined,
            canRename: false
        }
        
        if (items == undefined) return
    
        this.data['root'].children = [...Array.from(items).filter(p => !p.parentId).map((p) => p.id)]
        this.data['root'].data = items[0]
        
        Array.from(items).forEach((p: PageWithChildren) => {
            this.data[p.id] = {
                index: p.id,
                canMove: true,
                isFolder: true,
                children: p.children?.map((p) => p.id),
                data: p,
                canRename: false
            }
        })
    }
    public async onChangeItemChildren(itemId: TreeItemIndex, newChildren: TreeItemIndex[]): Promise<void> {
        this.data[itemId].children = newChildren;
    }
    public async getTreeItem(itemId: TreeItemIndex): Promise<TreeItem> {
        return this.data[itemId];
    }
    public onDidChangeTreeData(listener: (changedItemIds: TreeItemIndex[]) => void): Disposable {
        console.log("Tree did change - redrawing tree...")
        listener(Object.keys(this.data))
        return { dispose: () => {} };
        }

    public async onRenameItem(item: TreeItem<any>, name: string): Promise<void> {    }

}