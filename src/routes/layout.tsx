import { useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink, TreeLink } from "@/components/NavLink.tsx";
import {
    FaPlus,
    FaFile,
    FaHome,
    FaTimes,
    FaChevronRight,
    FaChevronDown,
    FaExclamationTriangle,
    FaInfoCircle,
} from "react-icons/fa";
import { type Page } from "@prisma/client";
import React, { Fragment, useMemo, useState } from "react";
import {
    InteractionMode,
    Tree,
    UncontrolledTreeEnvironment,
} from "react-complex-tree";
import { CustomTreeDataProvider } from "@/helpers/CustomTreeDataProvider";
import { Outlet, useMatches } from "@tanstack/react-router";
import { BsThreeDotsVertical } from "react-icons/bs";
import { pageListQuery } from "@/helpers/api.ts";
import SidebarError from "@/components/SidebarError.tsx";
import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import DarkModeSwitcher from "@/components/DarkModeSwitcher.tsx";

export default function Layout() {
    const { data, isError } = useQuery(pageListQuery);
    const location = useMatches();
    const pageId =
        location[1]?.routeId === "/page/$pageId"
            ? location[1].params["pageId"]
            : 0;
    const queryClient = useQueryClient();
    const [filterText, setFilterText] = useState("");
    const [sidebarVisible, setSidebarVisible] = useState(true);

    // Cache CustomTreeDataProvider until the data changes, prevents recreating whenever use selects page
    // Data will automatically change if /page is invalidated
    const dataProvider = useMemo(
        () => new CustomTreeDataProvider(data, queryClient),
        [data, queryClient],
    );

    // Generate initial state of tree by creating linear path from active item to root
    const initialState = useMemo(
        () =>
            isNaN(pageId)
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

    if (isError || !data) return <SidebarError />;

    return (
        <div>
            <div>
                <aside
                    id="sidebar-multi-level-sidebar"
                    className={`${
                        sidebarVisible ? "translate-x-0" : "-translate-x-full"
                    } fixed top-0 left-0 z-40 w-80 h-screen transition-transform duration-300 ease-in-out`}
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
                    <div className="h-full px-3 py-4 overflow-y-auto bg-secondary-100 dark:bg-secondary-800">
                        {/* Header Logo */}
                        <div className="mb-4 flex items-center py-2">
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
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                        {/* Home & New Page */}
                        <ul className="space-y-2 font-medium">
                            <li>
                                <NavLink to="/" Icon={FaHome} label="Home" />
                            </li>
                            <li>
                                <NavLink
                                    to="/new"
                                    Icon={FaPlus}
                                    label="New Page"
                                />
                            </li>
                        </ul>
                        {/* New Page warning */}
                        {location[1]?.pathname === "/new" && (
                            <div
                                id="dropdown-cta"
                                className="p-4 mt-6 rounded-lg bg-secondary-200 dark:bg-secondary-700"
                                role="alert"
                            >
                                <div className="flex items-center mb-3">
                                    <span className="flex text-sm font-semibold mr-2 px-4 py-1 rounded bg-red-500 dark:bg-orange-200 dark:text-orange-900">
                                        <FaExclamationTriangle className="mr-2 my-0.5" />
                                        Warning
                                    </span>
                                </div>
                                <p className="mb-3 text-sm text-gray-700 dark:text-white">
                                    You&apos;re currently working on an unsaved
                                    draft. Make sure to press the save button if
                                    you want to keep your work.
                                </p>
                            </div>
                        )}
                        {/* Search */}
                        <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center mb-2">
                                <label
                                    htmlFor="simple-search"
                                    className="sr-only"
                                >
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
                        </ul>
                        {filterText != "" && (
                            <ul className="pt-2 space-y-2">
                                {data
                                    .filter((item: Page) =>
                                        item.title
                                            .toLowerCase()
                                            .includes(filterText.toLowerCase()),
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
                                // getItemTitle={item => `${item.data.id}: ${item.data.title.slice(0, 10)} (${item.data.order})`}
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
                                                ? { disconnect: true }
                                                : {
                                                      connect: {
                                                          id: Number(targetId),
                                                      },
                                                  },
                                        );
                                    }
                                }}
                                defaultInteractionMode={
                                    InteractionMode.ClickArrowToExpand
                                }
                                renderItemsContainer={({
                                    children,
                                    containerProps,
                                }) => <ul {...containerProps}>{children}</ul>}
                                renderItemArrow={({ item, context }) => (
                                    <span
                                        {...context.arrowProps}
                                        onClick={(
                                            event: React.MouseEvent<HTMLSpanElement>,
                                        ) => {
                                            event.preventDefault();
                                            context.arrowProps.onClick?.(event);
                                        }}
                                        className="-my-2 p-2 inline-flex"
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
                                renderItem={(props) => <TreeLink {...props} />}
                            >
                                <Tree
                                    treeId="tree-nav"
                                    rootItem="root"
                                    treeLabel="Tree Sidebar"
                                />
                            </UncontrolledTreeEnvironment>
                        )}
                    </div>
                </aside>
            </div>
            <div className="container w-full md:max-w-3xl mx-auto px-10 py-20">
                <Outlet />
            </div>
        </div>
    );
}
