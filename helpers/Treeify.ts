import { TreeItem, TreeItemIndex } from "react-complex-tree";
import {Prisma, type Page} from 'prisma/prisma-client'

// Create PageWithChildren type
const pageWithChildren = Prisma.validator<Prisma.PageArgs>()({
    include: { children: { select: {id : true}} },
  })
export type PageWithChildren = Prisma.PageGetPayload<typeof pageWithChildren>

export function treeify(pages: PageWithChildren[]): Record<TreeItemIndex, TreeItem<Page>> {
    let items: Record<TreeItemIndex, TreeItem<Page>> = {}
    
    Array.from(pages).forEach((p: PageWithChildren) => {
        items[p.id] = {
            index: p.id,
            canMove: true,
            isFolder: true,
            children: p.children?.map((p) => p.id),
            data: p,
            canRename: false
        }
    })
    items['root'] = {
        index: 'root',
        canMove: false,
        isFolder: false,
        children: [...Array.from(pages).filter(p => !p.parentId).map((p) => p.id)],
        data: pages[0],
        canRename: false
    }
    return items;
}