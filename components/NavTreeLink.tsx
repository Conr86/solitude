import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FaFile, FaFolder, FaFolderOpen, FaRegFolder, FaRegFolderOpen } from 'react-icons/fa'
import { InteractionMode } from 'react-complex-tree'

export const NavTreeLink = ({ title, arrow, depth, context, children, item }: any) => {
    const { asPath } = useRouter()
    const Icon = item.children?.length != 0 ? (context.isExpanded ? FaRegFolderOpen : FaRegFolder) : FaFile;

    return (
        <li>
            <div {...context.itemContainerWithChildrenProps} {...context.interactiveElementProps} >
                <div {...context.itemContainerWithoutChildrenProps} className="py-1">
                    <Link href={`/${item.data.id}`} className={`${asPath === `/${item.data.id}`
                        ? 'bg-primary-100 dark:text-white dark:bg-primary-800'
                        : 'hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700'} 
                            flex items-center w-full py-2 pl-${depth > 0 ? 2 + 4 * depth : '2'} pr-2 transition duration-75 rounded-lg group `}>
                        <Icon className={`${asPath === `/${item.data.id}`
                            ? 'dark:text-primary-100'
                            : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white'} 
                            flex-shrink-0 w-6 transition duration-75 `} />
                        <span className="flex-1 text-left w-max ml-3 line-clamp-1">{title}</span>
                        {arrow && <span className="pr-1">{arrow}</span>}
                    </Link>
                </div>
            </div>
            <ul>
                {children}
            </ul>
        </li>
    )
}
