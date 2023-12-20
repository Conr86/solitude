import { NavLink, TreeLink } from "@/components/NavLink.tsx";
import {
    FaPlus,
    FaFile,
    FaHome,
    FaTimes,
    FaChevronRight,
    FaChevronDown,
    FaInfoCircle,
    FaCog,
} from "react-icons/fa";
import React, { Fragment, useMemo, useState } from "react";
import {
    InteractionMode,
    Tree,
    UncontrolledTreeEnvironment,
} from "react-complex-tree";
import { CustomTreeDataProvider } from "@/lib/CustomTreeDataProvider";
import { Link, Outlet, useParams } from "@tanstack/react-router";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import DarkModeSwitcher from "@/components/DarkModeSwitcher.tsx";
import { Page } from "@/lib/db/schema.ts";
import { usePages } from "@/lib/db/databaseHooks.ts";
import { useRxCollection } from "rxdb-hooks";
import SidebarError from "@/components/SidebarError.tsx";
import SyncPanel from "@/components/SyncPanel.tsx";

export default function Layout() {
    const { pages, isFetching } = usePages();
    const collection = useRxCollection<Page>("pages");

    const { pageId } = useParams({ strict: false });
    const [filterText, setFilterText] = useState("");
    const [sidebarVisible, setSidebarVisible] = useState(true);

    // Cache CustomTreeDataProvider until the data changes, prevents recreating whenever use selects page
    const dataProvider = useMemo(
        () => new CustomTreeDataProvider(pages, collection),
        [pages, collection],
    );

    // Generate initial state of tree by creating linear path from active item to root
    const initialState = useMemo(
        () =>
            pageId === ""
                ? {}
                : {
                      ["tree-nav"]: {
                          activeItems: pageId,
                          expandedItems:
                              dataProvider.getLinearPathToRoot(pageId),
                      },
                  },
        [dataProvider, pageId],
    );

    if (!pages || isFetching) return <SidebarError />;

    return (
        <div>
            <div>
                <aside
                    id="sidebar-multi-level-sidebar"
                    className={`${
                        sidebarVisible ? "translate-x-0" : "-translate-x-full"
                    } fixed top-0 left-0 z-40 w-80 flex flex-col h-screen transition-transform duration-300 ease-in-out bg-secondary-100 dark:bg-secondary-800 pt-4`}
                    aria-label="Sidebar"
                >
                    <button
                        onClick={() => setSidebarVisible(!sidebarVisible)}
                        className={`absolute bottom-2 -right-14 hover:bg-gray-200 text-gray-500 dark:hover:text-gray-400 dark:hover:bg-gray-700 flex items-center p-4 rounded-lg group`}
                    >
                        <FaChevronRight
                            className={`${
                                sidebarVisible ? "rotate-180" : ""
                            } transition ease-in-out duration-300`}
                        />
                    </button>
                    {/* Header Logo */}
                    <div className="mb-4 flex items-center py-2 px-3">
                        <img
                            className="h-8 w-8 mx-2 mr-4"
                            src="/logo.svg"
                            alt="Solitude Logo"
                            width={64}
                            height={64}
                        />
                        <h1
                            style={{ fontFamily: "Libre Baskerville" }}
                            className={`font-bold break-normal text-gray-900 dark:text-white  text-2xl md:text-3xl rounded-md border-0 shadow-none outline-none focus:ring-0 bg-inherit`}
                        >
                            Solitude
                        </h1>
                        <Menu as="div" className="ml-auto">
                            <Menu.Button
                                className={`p-2 rounded-full dark:text-white hover:ring-1`}
                            >
                                <BsThreeDotsVertical />
                            </Menu.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <DarkModeSwitcher />
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="https://www.github.com/Conr86/solitude"
                                                className={classNames(
                                                    active
                                                        ? "bg-gray-100 text-gray-900"
                                                        : "text-gray-700",
                                                    "px-4 py-2 text-sm flex rounded-md",
                                                )}
                                            >
                                                <FaInfoCircle className="my-1 mr-4" />
                                                About
                                            </a>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/settings"
                                                className={classNames(
                                                    active
                                                        ? "bg-gray-100 text-gray-900"
                                                        : "text-gray-700",
                                                    "px-4 py-2 text-sm flex rounded-md",
                                                )}
                                            >
                                                <FaCog className="my-1 mr-4" />
                                                Settings
                                            </Link>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                    {/* Home & New Page */}
                    <ul className="space-y-2 font-medium px-3">
                        <li>
                            <NavLink to="/" Icon={FaHome} label="Home" />
                        </li>
                        <li>
                            <NavLink to="/new" Icon={FaPlus} label="New Page" />
                        </li>
                    </ul>
                    {/* Search */}
                    <div className="flex items-center my-4 px-3">
                        <label htmlFor="simple-search" className="sr-only">
                            Search
                        </label>
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg
                                    aria-hidden="true"
                                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="simple-search"
                                value={filterText}
                                onChange={(e) => {
                                    setFilterText(e.target.value);
                                }}
                                className="bg-gray-50 outline-none focus:border-primary-700 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Search"
                            />
                            <button
                                onClick={() => {
                                    setFilterText("");
                                }}
                                className={`${
                                    filterText === "" ? "hidden" : ""
                                } absolute inset-y-0 right-0 text-gray-400 hover:text-gray-500 flex items-center pr-3`}
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>
                    <div className="h-full overflow-y-auto space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                        <div className="px-3">
                            {filterText != "" && (
                                <ul className="pt-2 space-y-2">
                                    {pages
                                        ?.filter((item: Page) =>
                                            item.title
                                                .toLowerCase()
                                                .includes(
                                                    filterText.toLowerCase(),
                                                ),
                                        )
                                        .map((page: Page) => (
                                            <li key={page.id}>
                                                <NavLink
                                                    to={"/page/$pageId"}
                                                    params={{
                                                        pageId: page.id.toString(),
                                                    }}
                                                    Icon={FaFile}
                                                    label={page.title}
                                                />
                                            </li>
                                        ))}
                                </ul>
                            )}
                            {filterText == "" && (
                                <UncontrolledTreeEnvironment
                                    dataProvider={dataProvider}
                                    getItemTitle={(item) => item.data.title}
                                    // getItemTitle={item => `${item.data.id}: ${item.data.title.slice(0, 10)} (${item.data.index})`}
                                    viewState={initialState}
                                    canDragAndDrop={true}
                                    canDropOnFolder={true}
                                    canDropOnNonFolder={true}
                                    canRename={false}
                                    canReorderItems={true}
                                    canSearch={false}
                                    onDrop={async (items, target) => {
                                        if (target.targetType !== "root") {
                                            const targetId =
                                                target.targetType ===
                                                "between-items"
                                                    ? target.parentItem
                                                    : target.targetItem;
                                            console.log(
                                                `Attempting to child page ${items[0].data.id} to ${targetId}`,
                                            );
                                            await dataProvider.updateParent(
                                                items[0].data.id,
                                                target.targetType ===
                                                    "between-items" &&
                                                    target.parentItem === "root"
                                                    ? undefined
                                                    : targetId.toString(),
                                            );
                                        }
                                    }}
                                    defaultInteractionMode={
                                        InteractionMode.ClickArrowToExpand
                                    }
                                    renderItemsContainer={({
                                        children,
                                        containerProps,
                                    }) => (
                                        <ul {...containerProps}>{children}</ul>
                                    )}
                                    renderItemArrow={({ item, context }) => (
                                        <span
                                            {...context.arrowProps}
                                            onClick={(
                                                event: React.MouseEvent<HTMLSpanElement>,
                                            ) => {
                                                event.preventDefault();
                                                context.arrowProps.onClick?.(
                                                    event,
                                                );
                                            }}
                                            className="inline-flex"
                                        >
                                            {item.children?.length != 0 ? (
                                                context.isExpanded ? (
                                                    <FaChevronDown />
                                                ) : (
                                                    <FaChevronRight />
                                                )
                                            ) : null}
                                        </span>
                                    )}
                                    renderItem={(props) => (
                                        <TreeLink {...props} />
                                    )}
                                >
                                    <Tree
                                        treeId="tree-nav"
                                        rootItem="root"
                                        treeLabel="Tree Sidebar"
                                    />
                                </UncontrolledTreeEnvironment>
                            )}
                        </div>
                    </div>
                    <div className="z-20 mt-auto flex flex-col space-y-0.5 px-4 py-4">
                        <SyncPanel />
                    </div>
                </aside>
            </div>
            <div className="container w-full md:max-w-3xl mx-auto px-10 py-20">
                <Outlet />
            </div>
        </div>
    );
}
