import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect, useState, Fragment, useReducer, useCallback } from "react";
import { Toolbar } from "./Toolbar";
import { Button } from "../components/Button";
import { FaAngleUp, FaMarkdown, FaSave, FaTrash } from "react-icons/fa";
import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { DeleteModal } from "./DeleteModal";
import {
    PageAction,
    PageState,
    pageStateReducer,
} from "@/lib/pageStateReducer";
import { getEditorProps, getExtensions } from "@/lib/tiptap.config";
import { Page } from "@/lib/db/schema.ts";
import { useRxCollection } from "rxdb-hooks";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { usePage, usePages } from "@/lib/db/databaseHooks.ts";
import { downloadMarkdownExport } from "@/lib/markdownExport.ts";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function EditorComponent({
    pageId,
    isNewPage,
}: {
    pageId: string;
    isNewPage?: boolean;
}) {
    const navigate = useNavigate();
    const router = useRouter();

    const collection = useRxCollection<Page>("pages");
    const { pages } = usePages();
    const { page: activeDocument } = usePage(pageId);

    // Redirect to the new URL if we have created and saved a new page
    useEffect(() => {
        if (isNewPage && activeDocument) {
            navigate({
                from: "/new",
                to: "/page/$pageId",
                params: { pageId },
            });
        }
    }, [isNewPage, navigate, activeDocument, pageId]);

    // State for controlling display-related values
    const [displayState, setDisplayState] = useState({
        modalOpen: false,
        showTopBtn: false,
    });

    // Reducer for managing page state
    const [page, dispatch] = useReducer<
        (state: PageState, action: PageAction) => PageState
    >(pageStateReducer, {
        lastSaved: activeDocument?.updated_at
            ? new Date(activeDocument?.updated_at)
            : undefined,
        unsavedChanges: false,
        currentText: activeDocument?.content,
        lastText: activeDocument?.content,
        currentTitle: isNewPage ? "New Page" : activeDocument?.title ?? "",
        lastTitle: isNewPage ? "New Page" : activeDocument?.title ?? "",
    });

    // Update state when content/title changes such as a query refetch
    useEffect(() => {
        dispatch({
            type: "opened",
            newTitle: isNewPage ? "New Page" : activeDocument?.title ?? "",
            newText: activeDocument?.content,
            newLastSaved: activeDocument?.updated_at
                ? new Date(activeDocument?.updated_at)
                : undefined,
        });
    }, [activeDocument, isNewPage]);

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
    const deletePage = useCallback(async () => {
        activeDocument?.remove();
        await navigate({ to: "/" });
    }, [activeDocument, navigate]);

    // Create a page with current editor contents and title and redirect to that new page
    const createPage = useCallback(
        async (page: PageState) => {
            await collection?.incrementalUpsert({
                id: pageId,
                title: page.currentTitle,
                content: page.currentText,
            });
            // Dispatch a 'saved' action to update the state. Stops the blocker from blocking.
            dispatch({
                type: "saved",
            });
        },
        [collection, pageId],
    );

    // Save page content from given page state for given id
    const savePage = useCallback(
        (id: string, page: PageState) => {
            activeDocument?.patch({
                id,
                title: page.currentTitle,
                content: page.currentText,
            });
            dispatch({
                type: "saved",
            });
        },
        [activeDocument],
    );

    // Autosave editor content
    const AUTOSAVE_INTERVAL: number = 3000;
    useEffect(() => {
        if (isNewPage) return;
        // Set up a timer to automatically save the page after a certain interval
        const timer = setTimeout(() => {
            // Check if there are unsaved changes in the editor
            if (page.unsavedChanges) {
                console.log(`Autosaving...`);
                savePage(pageId, page);
            }
        }, AUTOSAVE_INTERVAL);
        // Clean up the timer when the component unmounts or the dependencies change
        return () => {
            clearTimeout(timer);
        };
    }, [page, pageId, isNewPage, savePage]);

    // Save on exit
    useEffect(() => {
        if (!page.unsavedChanges) return;
        const unblock = router.history.block(async (retry) => {
            if (!isNewPage) savePage(pageId, page);
            else await createPage(page);
            unblock();
            retry();
        });
        return unblock;
    });

    // Create editor
    const editor = useEditor(
        {
            extensions: getExtensions(pages),
            editorProps: getEditorProps(),
            content: activeDocument?.content,
            onUpdate: ({ editor }) =>
                dispatch({
                    type: "changed",
                    newText: editor.getHTML(),
                }),
        },
        [pageId, activeDocument],
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
                className={`w-full font-bold break-normal text-gray-900 dark:text-white px-0 py-2 my-1 text-3xl md:text-4xl rounded-md border-0 shadow-none outline-none focus:ring-0 bg-inherit`}
            ></input>
            <div className="flex gap-2 flex-row">
                {/* Page info */}
                <div className="text-gray-600 dark:text-gray-400">
                    <p>
                        {`Created ${
                            activeDocument?.created_at
                                ? new Date(
                                      activeDocument?.created_at,
                                  ).toLocaleString()
                                : "just now"
                        }`}
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
                <div className="flex gap-3 h-10 grow flex-row place-content-end">
                    {/* Save indicator */}
                    <span
                        className="mr-2"
                        title={
                            isNewPage
                                ? "Autosave disabled on new pages. Manually save your work"
                                : page.unsavedChanges
                                ? "Unsaved changes..."
                                : "Saved"
                        }
                    >
                        <span
                            className={`block relative rounded-full top-3 ${
                                isNewPage
                                    ? "bg-red-500"
                                    : !page.unsavedChanges
                                    ? "bg-primary-700"
                                    : "bg-amber-500 animate-pulse"
                            }`}
                            style={{ height: 16, width: 16 }}
                        />
                    </span>
                    <Button
                        color={buttonClasses}
                        onClick={() => {
                            !isNewPage
                                ? savePage(pageId, page)
                                : createPage(page);
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
                                                    href="#"
                                                    onClick={() =>
                                                        downloadMarkdownExport(
                                                            activeDocument,
                                                        )
                                                    }
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
                    onConfirm={() => deletePage()}
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
