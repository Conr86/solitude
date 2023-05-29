import React, { ReactNode } from 'react'
import { FaFile, FaRegFolder, FaRegFolderOpen } from 'react-icons/fa'
import { NavLink } from './NavLink'
import { TreeItem, TreeItemRenderContext } from 'react-complex-tree'

interface NavTreeLinkProps {
    title: ReactNode;
    item: TreeItem<any>;
    depth: number;
    children: ReactNode;
    arrow: ReactNode;
    context: TreeItemRenderContext<"activeItems" | "expandedItems">;
}

export const NavTreeLink = ({ title, item, depth, children, arrow, context }: NavTreeLinkProps) => {
    const Icon = item.children?.length != 0 ? (context.isExpanded ? FaRegFolderOpen : FaRegFolder) : FaFile;
    return (
        <li>
            <div {...context.itemContainerWithChildrenProps} {...context.interactiveElementProps} >
                <div {...context.itemContainerWithoutChildrenProps} className="py-1">
                    <NavLink href={item.data.id} Icon={Icon} label={title} depth={depth} arrow={arrow}/>
                </div>
            </div>
            <ul>
                {children}
            </ul>
        </li>
    )
}
