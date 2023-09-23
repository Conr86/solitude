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
} from "react-icons/fa";
import { type Page } from "@prisma/client";
import { useMemo, useState } from "react";
import {
    InteractionMode,
    Tree,
    UncontrolledTreeEnvironment,
} from "react-complex-tree";
import { CustomTreeDataProvider } from "@/helpers/CustomTreeDataProvider";
import { pageListQuery } from "@/helpers/api.ts";
import { Outlet, useMatches } from "@tanstack/react-router";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function Layout() {
    const { data } = useQuery(pageListQuery());
    const location = useMatches();

    const pageId =
        location[1].routeId === "/page/$pageId"
            ? Number(location[1].pathname.slice(6))
            : 0;
    const queryClient = useQueryClient();
    const [filterText, setFilterText] = useState("");
    const [sidebarVisible, setSidebarVisible] = useState(true);

    // Cache CustomTreeDataProvider until the data changes, prevents recreating whenever use selects page
    // Data will automatically change if swr's mutate() is called on the /page endpoint
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

    // if (error) return <Error statusCode={error.statusCode}/>

    if (!data)
        return (
            <aside
                id="sidebar-multi-level-sidebar"
                className={`${
                    sidebarVisible ? "translate-x-0" : "-translate-x-full"
                } fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out`}
                aria-label="Sidebar"
            >
                <div className="h-full overflow-y-auto bg-secondary-100 dark:bg-secondary-800">
                    <div className="flex h-screen w-full justify-center items-center">
                        <img
                            className="animate-pulse mx-auto float-center w-1/2 "
                            src="/logo.svg"
                            alt="Solitude Logo"
                            width={100}
                            height={100}
                        />
                    </div>
                </div>
            </aside>
        );

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
                            <button
                                className={`p-2 rounded-full dark:text-white hover:ring-1 ml-auto`}
                            >
                                <BsThreeDotsVertical />
                            </button>
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
                        {location[1].pathname === "/new" && (
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
                                    <span {...context.arrowProps}>
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
