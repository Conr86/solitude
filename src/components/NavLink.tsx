import { ReactNode } from "react";
import { FaFile, FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import { TreeItem, TreeItemRenderContext } from "react-complex-tree";
import { Link, LinkPropsOptions } from "@tanstack/react-router";
import { IconType } from "react-icons";

type NavLinkProps = Partial<Pick<LinkPropsOptions, "to" | "params">> & {
    Icon: IconType;
    label: ReactNode;
    depth?: number;
    arrow?: ReactNode;
};

export const NavLink = ({
    to,
    params,
    Icon,
    label,
    depth = 0,
    arrow = null,
}: NavLinkProps) => {
    return (
        <Link
            to={to}
            params={params}
            activeOptions={{ exact: true }}
            activeProps={{
                className: "bg-primary-200 dark:text-white dark:bg-primary-800",
            }}
            inactiveProps={{
                className:
                    "hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700",
            }}
            className={`flex items-center w-full py-2 pl-${
                depth > 0 ? 2 + 4 * depth : "2"
            } pr-2 transition duration-75 rounded-lg group `}
        >
            {({ isActive }) => (
                <>
                    <Icon
                        className={`${
                            isActive
                                ? "dark:text-primary-100"
                                : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white"
                        } 
                    flex-shrink-0 w-6 transition duration-75 `}
                    />
                    <span className="flex-1 text-left w-max ml-3 line-clamp-1">
                        {label}
                    </span>
                    {arrow}
                </>
            )}
        </Link>
    );
};

interface TreeLinkProps {
    title: ReactNode;
    item: TreeItem;
    depth: number;
    children?: ReactNode;
    arrow: ReactNode;
    context: TreeItemRenderContext<"activeItems" | "expandedItems">;
}
export const TreeLink = ({
    title,
    item,
    depth,
    children,
    arrow,
    context,
}: TreeLinkProps) => {
    const Icon =
        item.children?.length != 0
            ? context.isExpanded
                ? FaRegFolderOpen
                : FaRegFolder
            : FaFile;
    return (
        <li>
            <div
                {...context.itemContainerWithChildrenProps}
                {...context.interactiveElementProps}
            >
                <div
                    {...context.itemContainerWithoutChildrenProps}
                    className="py-1"
                >
                    <NavLink
                        to={`/page/$pageId`}
                        params={{ pageId: item.data.id }}
                        Icon={Icon}
                        label={title}
                        depth={depth}
                        arrow={arrow}
                    />
                </div>
            </div>
            <ul>{children}</ul>
        </li>
    );
};
