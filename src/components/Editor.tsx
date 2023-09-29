import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect, useState, Fragment, useReducer } from "react";
import { Toolbar } from "./Toolbar";
import { Button } from "../components/Button";
import { FaAngleUp, FaCog, FaMarkdown, FaSave, FaTrash } from "react-icons/fa";
import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import { type Page } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { DeleteModal } from "./DeleteModal";
import { apiBaseUrl, pageListQuery } from "@/helpers/api";
import { PageState, pageStateReducer } from "@/helpers/pageStateReducer";
import { getEditorProps, getExtensions } from "@/helpers/tiptap.config";
import {
    useNavigate,
    useRouter,
    useRouterContext,
} from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function EditorComponent({
    id,
    title,
    createdAt,
    updatedAt,
    content,
}: Partial<Page>) {
    const { data } = useQuery(pageListQuery());
    const navigate = useNavigate();
    const router = useRouter();
    // Check if the page is new (id not set)
    const isNewPage = !id;
    const { queryClient } = useRouterContext({
        from: isNewPage ? "/new" : "/page/$pageId",
    });

    // State for controlling display-related values
    const [displayState, setDisplayState] = useState({
        modalOpen: false,
        showTopBtn: false,
    });

    // Reducer for managing page state
    const [page, dispatch] = useReducer(pageStateReducer, {
        lastSaved: updatedAt,
        unsavedChanges: false,
        currentText: content,
        lastText: content,
        currentTitle: title,
        lastTitle: title,
    });

    // Update state when content/title changes such as a query refetch
    useEffect(() => {
        dispatch({
            type: "opened",
            page: {
                lastSaved: updatedAt,
                unsavedChanges: false,
                currentText: content,
                lastText: content,
                currentTitle: title,
                lastTitle: title,
            },
        });
    }, [content, title, updatedAt]);

    // Extend dayjs with relativeTime plugin
    // relativeTime lets use calculate "Saved two days ago..." from two dates
    dayjs.extend(relativeTime);

    // Scroll to top detection functionality
    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                setDisplayState({ ...displayState, showTopBtn: true });
            } else {
                setDisplayState({ ...displayState, showTopBtn: false });
            }
        });
    }, [displayState]);
    // Function to scroll to the top of the page
    const goToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Delete a page with the given ID
    const deletePage = useMutation({
        mutationKey: ["pages", id],
        mutationFn: (id: number) => {
            return fetch(`${apiBaseUrl}/page/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        },
        onSuccess: async () => {
            // Let SWR know that the page tree structure has changed and sidebar needs updating
            queryClient.invalidateQueries({
                queryKey: ["pages"],
            });
            // Redirect to Home
            await navigate({ to: "/" });
        },
    });

    // Create a page with current editor contents and title and redirect to that new page
    const createPage = useMutation({
        mutationKey: ["pages", id],
        mutationFn: (page: PageState) =>
            fetch(`${apiBaseUrl}/page`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: page.currentTitle,
                    content: page.currentText,
                }),
            }),
        onSuccess: async (data) => {
            // Let SWR know that the page tree structure has changed and sidebar needs updating
            queryClient.invalidateQueries({
                queryKey: ["pages"],
            });
            // Dispatch a 'saved' action to update the state. Stops the blocker from blocking.
            dispatch({
                type: "saved",
            });
            // Redirect to the new page
            await navigate({
                to: "/page/$pageId",
                params: { pageId: (await data.json()).id },
            });
        },
    });

    // Save page content from given page state for given id
    const savePage = useMutation({
        mutationKey: ["pages", id],
        mutationFn: async ({ id, page }: { id: number; page: PageState }) => {
            // Note that we don't include modifiedAt as this is calculated automatically by the DB
            await fetch(`${apiBaseUrl}/page/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: page.currentTitle,
                    content: page.currentText,
                }),
            });
        },
        onSuccess: async () => {
            // Let the cache know that this page has changed
            queryClient.invalidateQueries({
                queryKey: ["pages", id],
            });
            // Check if title has changed, if so, invalidate the page list cache triggering a refresh of the sidebar tree
            if (page.currentTitle !== page.lastTitle) {
                queryClient.invalidateQueries({
                    queryKey: ["pages"],
                });
            }
            // Dispatch a 'saved' action to update the state
            dispatch({
                type: "saved",
            });
        },
    });

    // Autosave editor content
    const AUTOSAVE_INTERVAL: number = 3000;
    useEffect(() => {
        if (isNewPage) return;
        // Set up a timer to automatically save the page after a certain interval
        const timer = setTimeout(() => {
            // Check if there are unsaved changes in the editor
            if (
                page.lastText !== page.currentText ||
                page.lastTitle !== page.currentTitle
            ) {
                console.log(`Autosaving...`);
                savePage.mutate({ id, page });
            }
        }, AUTOSAVE_INTERVAL);
        // Clean up the timer when the component unmounts or the dependencies change
        return () => {
            clearTimeout(timer);
        };
    }, [page, id, isNewPage, savePage]);

    // Save on exit
    useEffect(() => {
        if (
            page.lastText === page.currentText &&
            page.lastTitle === page.currentTitle
        )
            return;

        const unblock = router.history.block((retry) => {
            if (window.confirm("Save unsaved changes?")) {
                console.log("Saving unsaved changes...");
                if (!isNewPage) savePage.mutate({ id, page });
                else createPage.mutate(page);
                unblock();
                retry();
            }
        });
        return unblock;
    });

    // Create editor
    const editor = useEditor(
        {
            extensions: getExtensions(data),
            editorProps: getEditorProps(),
            content,
            onUpdate: ({ editor }) =>
                dispatch({
                    type: "changed",
                    newText: editor.getHTML(),
                }),
        },
        [id, content, title],
    );

    const buttonClasses =
        "bg-primary-100 hover:bg-primary-400 dark:bg-transparent dark:hover:bg-primary-900 dark:ring-primary-800 dark:ring-1 dark:hover:ring-primary-900 dark:text-white";

    return (
        <div className="pb-4 border-gray-200 dark:border-gray-700 border-b-2">
            {/* Page title */}
            <input
                type="text"
                value={page.currentTitle}
                onChange={(e) => {
                    dispatch({
                        type: "changed",
                        newText: undefined,
                        newTitle: e.target.value,
                    });
                }}
                style={{ fontFamily: "Libre Baskerville" }}
                className={`font-bold break-normal text-gray-900 dark:text-white px-0 py-2 my-1 text-3xl md:text-4xl rounded-md border-0 shadow-none outline-none focus:ring-0 bg-inherit`}
            ></input>
            <div className="flex gap-2 flex-row">
                {/* Page info */}
                <div className="text-gray-600 dark:text-gray-400">
                    <p>
                        Created{" "}
                        {createdAt
                            ? new Date(createdAt).toLocaleString()
                            : "just now"}
                    </p>
                    <p>
                        {!isNewPage
                            ? `Last saved ${dayjs().from(
                                  dayjs(page.lastSaved),
                                  true,
                              )} ago`
                            : `Unsaved draft...`}
                    </p>
                    <p>{editor?.storage.characterCount.words()} words</p>
                </div>
                {/* Save button and settings */}
                <div className="flex gap-2 h-10 grow flex-row place-content-end">
                    {/* Save indicator */}
                    <span
                        title={
                            isNewPage
                                ? "Autosave disabled on new pages. Manually save your work"
                                : page.unsavedChanges
                                ? "Unsaved changes..."
                                : "Saved"
                        }
                        className="mr-4"
                    >
                        <svg
                            className={`py-3 px-2 ${
                                isNewPage
                                    ? "fill-red-500"
                                    : !page.unsavedChanges
                                    ? "fill-primary-700"
                                    : "fill-amber-500 animate-pulse"
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                        >
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
                        </svg>
                    </span>
                    <Button
                        color={buttonClasses}
                        onClick={() => {
                            !isNewPage
                                ? savePage.mutate({ id, page })
                                : createPage.mutate(page);
                        }}
                    >
                        <FaSave className="mr-2" /> Save
                    </Button>
                    {/* Settings dropdown menu */}
                    {!isNewPage && (
                        <Menu
                            as="div"
                            className="relative inline-block text-left"
                        >
                            <Menu.Button
                                className={`inline-flex w-full justify-center rounded-full p-3 ${buttonClasses}`}
                            >
                                <FaCog />
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
                                    <div className="py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <a
                                                    href="#"
                                                    onClick={() => {
                                                        setDisplayState({
                                                            ...displayState,
                                                            modalOpen: true,
                                                        });
                                                    }}
                                                    className={classNames(
                                                        active
                                                            ? "bg-gray-100 text-gray-900"
                                                            : "text-gray-700",
                                                        "px-4 py-2 text-sm flex",
                                                    )}
                                                >
                                                    <FaTrash className="my-1 mr-4" />
                                                    Delete Page
                                                </a>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <a
                                                    href={`${apiBaseUrl}/page/${id}/export`}
                                                    download
                                                    className={classNames(
                                                        active
                                                            ? "bg-gray-100 text-gray-900"
                                                            : "text-gray-700",
                                                        "px-4 py-2 text-sm flex",
                                                    )}
                                                >
                                                    <FaMarkdown className="my-1 mr-4" />
                                                    Export as Markdown
                                                </a>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    )}
                </div>
            </div>

            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
            {!isNewPage && (
                <DeleteModal
                    show={displayState.modalOpen}
                    onCancel={() => {
                        setDisplayState({ ...displayState, modalOpen: false });
                    }}
                    onConfirm={() => deletePage.mutate(id)}
                />
            )}
            <button
                type="button"
                onClick={goToTop}
                className={`${
                    displayState.showTopBtn ? "" : "translate-y-32"
                } p-2 fixed bottom-10 right-10 inline-block rounded-full transition ease-in duration-100 bg-primary-100 hover:bg-primary-400 dark:bg-transparent dark:hover:bg-primary-900 dark:ring-primary-800 dark:ring-1 dark:hover:ring-primary-900 dark:text-white`}
            >
                <FaAngleUp className="w-8 h-8" />
            </button>
        </div>
    );
}
