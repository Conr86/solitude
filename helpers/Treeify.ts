import { TreeItem, TreeItemIndex } from "react-complex-tree";
import {type Page} from 'prisma/prisma-client'

type PageE = (Page & {
    children: {
        id: number;
    }[];
})

export function treeify(pages: PageE[]): Record<TreeItemIndex, TreeItem<Page>> {
    let items: Record<TreeItemIndex, TreeItem<Page>> = {}
    
    Array.from(pages).forEach((p: PageE) => {
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