import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FaFile, FaRegFolder, FaRegFolderOpen } from 'react-icons/fa'
import { NavLink } from './NavLink'

export const NavTreeLink = ({ title, arrow, depth, context, children, item }: any) => {
    const Icon = item.children?.length != 0 ? (context.isExpanded ? FaRegFolderOpen : FaRegFolder) : FaFile;
    return (
        <li>
            <div {...context.itemContainerWithChildrenProps} {...context.interactiveElementProps} >
                <div {...context.itemContainerWithoutChildrenProps} className="py-1">
                    <NavLink href={item.data.id} Icon={Icon} label={title} depth={depth} arrow={arrow} />
                </div>
            </div>
            <ul>
                {children}
            </ul>
        </li>
    )
}
