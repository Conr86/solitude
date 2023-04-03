import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import React, { useEffect, useState } from 'react'
import { Toolbar } from './Toolbar'
import router from 'next/router'
import { Modal } from '@alfiejones/flowbite-react'
import { Button } from '../components/Button'
import { mutate } from 'swr'
import { FaCog, FaSave, FaTrash } from 'react-icons/fa'
import { Libre_Baskerville } from 'next/font/google'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Mention } from './Mention'
import suggestion, { createItems, createSuggestion } from './MentionSuggestion'
import useSWR from 'swr'
import { Page } from '@prisma/client'
import Error from 'next/error'
 

const proseFont = Libre_Baskerville({
    weight: '400',
    subsets: ['latin'],
})

async function savePage(editor: Editor | null, id: number, title: string) {
    console.log(`Saving... id ${id}`);
    const body = { title: title, content: editor?.getHTML() };
    const res = await fetch(`/api/page/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    mutate(`/api/page/${id}`);
    // If this is a new page - navigate to it
    if (!id) {
        mutate(`/api/page`);
        await router.push(`/${(await res.json()).id}`);
    }
}

async function deletePage(id: number) {
    await fetch(`/api/page/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    mutate("/api/page");
    await router.push("/");
}

export function DeleteModal({ show, onConfirm, onCancel }: any) {
    return (<Modal show={show} size="md" popup={true} onClose={onCancel}>
        <Modal.Header />
        <Modal.Body>
            <div className="text-center">

                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this page?
                </h3>
                <div className="flex justify-center gap-4">
                    <Button color="bg-red-700 hover:bg-red-500" onClick={onConfirm}>
                        <FaTrash className='mr-2' /> Delete
                    </Button>
                    <Button color="bg-blue-700 hover:bg-green-500" onClick={onCancel} >
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal.Body>
    </Modal>
    )
}

export default function EditorComponent({ id, title, createdAt, content }: any) {
    const { data, error } = useSWR<Page[], Error>('/api/page');
    let items = data ? createItems(data) : undefined;

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                linkOnPaste: false,
                openOnClick: false,
            }),
            Mention.configure({
                HTMLAttributes: {
                  class: '',
                },
                suggestion: {
                    render: suggestion.render,
                    items: items
                },
              }),
        ],
        editorProps: {
            attributes: {
                class: `${proseFont.className} prose dark:prose-invert prose-sm sm:prose-base lg:prose-md xl:prose-lg focus:outline-none max-w-none`,
            },
        },
        content: content
    }, [id]);

    const [currentTitle, setCurrentTitle] = useState(title);
    useEffect(() => { setCurrentTitle(title) }, [id]);

    const [modalOpen, setModalOpen] = useState(false);

    const classes = "bg-green-100 hover:bg-green-400 dark:bg-transparent dark:hover:bg-green-900 dark:ring-green-800 dark:ring-1 dark:hover:ring-green-900 dark:text-white";

    return (
        <div className="px-4 md:px-6 leading-normal">
            <input type="text" value={currentTitle} onChange={e => setCurrentTitle(e.target.value)}
                className="font-bold font-sans break-normal text-gray-900 dark:text-white px-0 py-2 my-4 text-3xl md:text-4xl rounded-md border-0 shadow-none outline-none focus:ring-0 bg-inherit"  ></input>
            <div className="flex gap-2 flex-row">
                <p className="text-sm md:text-base font-normal text-gray-600 dark:text-gray-400">Created {createdAt ? new Date(createdAt).toLocaleString() : "just now"}</p>
                <div className="flex gap-2 h-10 -mt-4 grow flex-row place-content-end">
                    <Button color={classes} onClick={() => savePage(editor, id, currentTitle)}><FaSave className="mr-2" /> Save</Button>
                    {/* <Button color="bg-red-500 hover:bg-red-700" onClick={() => setModalOpen(true)}><FaTrash className="mr-2" /> Delete</Button> */}
                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button className={`inline-flex w-full justify-center rounded-full p-3 ${classes}`} >
                                <FaCog />
                            </Menu.Button>
                        </div>

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
                                            <a href="#"
                                                onClick={() => setModalOpen(true)}
                                                className={classNames(
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                    'block px-4 py-2 text-sm flex'
                                                )}
                                            >
                                                <FaTrash className="mr-4" />
                                                Delete Page
                                            </a>
                                        )}
                                    </Menu.Item>
                                    {/* <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="#"
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            )}
                                        >
                                            License
                                        </a>
                                    )}
                                </Menu.Item> */}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>

            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
            <DeleteModal show={modalOpen} onCancel={() => setModalOpen(false)} onConfirm={() => deletePage(id)} />
        </div>
    )
}

