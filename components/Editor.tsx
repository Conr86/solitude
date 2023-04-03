import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import React, { useEffect, useState, Fragment } from 'react'
import { Toolbar } from './Toolbar'
import router from 'next/router'
import { Button } from '../components/Button'
import useSWR, { mutate } from 'swr'
import { FaCog, FaSave, FaTrash } from 'react-icons/fa'
import { Libre_Baskerville } from 'next/font/google'
import { Menu, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Mention } from './Mention'
import suggestion, { createItems } from './MentionSuggestion'
import { type Page } from '@prisma/client'
import type Error from 'next/error'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { DeleteModal } from './DeleteModal'

const proseFont = Libre_Baskerville({
  weight: '400',
  subsets: ['latin']
})

const headingFont = Libre_Baskerville({
  weight: '700',
  subsets: ['latin']
})

async function deletePage (id: number): Promise<void> {
  await fetch(`/api/page/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  await mutate('/api/page')
  await router.push('/')
}

export default function EditorComponent ({ id, title, createdAt, updatedAt, content }: Page): JSX.Element {
  const { data } = useSWR<Page[], Error>('/api/page')
  const items = (data != null) ? createItems(data) : undefined

  // Modal
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  // Editor content
  const [lastText, setLastText] = React.useState<string>('')
  const [text, setText] = React.useState<string>('')
  // Autosave
  dayjs.extend(relativeTime)
  const [lastSaved, setLastSaved] = React.useState<Date | null>(updatedAt)
  const [unsavedChanges, setUnsavedChanges] = React.useState<boolean>(false)
  const [autosaveEnabled, setAutosaveEnabled] = React.useState<boolean>(Boolean(id))
  // Page title
  const [currentTitle, setCurrentTitle] = useState<string>(title)
  useEffect(() => { setCurrentTitle(title); setLastSaved(updatedAt); setUnsavedChanges(false); setAutosaveEnabled(Boolean(id)) }, [id])

  async function savePage (manualSave: boolean = false): Promise<void> {
    const body = { title: currentTitle, content: text }
    const res = await fetch(`/api/page/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    await mutate(`/api/page/${id}`)
    setLastText(text)
    setLastSaved(new Date())
    setUnsavedChanges(false)
    if (!id && manualSave) {
      await mutate('/api/page')
      await router.push(`/${(await res.json()).id}`)
    }
  }

  // Autosave editor content
  const AUTOSAVE_INTERVAL: number = 3000
  React.useEffect(() => {
    if (!autosaveEnabled) return
    if (lastText !== text) setUnsavedChanges(true)
    const timer = setTimeout(() => {
      if (lastText !== text) {
        console.log(`Autosaving... id ${id}`)
        savePage().then(
          () => {},
          () => {}
        )
      }
    }, AUTOSAVE_INTERVAL)
    return () => { clearTimeout(timer) }
  }, [text])

  // Create editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        linkOnPaste: true,
        openOnClick: true,
        HTMLAttributes: {
          class: 'cursor-pointer hover:text-primary-400',
          title: ''
        }
      }),
      Mention.configure({
        suggestion: {
          render: suggestion.render,
          items
        }
      })
    ],
    editorProps: {
      attributes: {
        class: `${proseFont.className} prose dark:prose-invert prose-sm sm:prose-base lg:prose-md xl:prose-lg focus:outline-none max-w-none dark:text-gray-400`
      }
    },
    content,
    onUpdate: ({ editor }) => { setText(editor.getHTML()) }
  }, [id])

  const buttonClasses = 'bg-primary-100 hover:bg-primary-400 dark:bg-transparent dark:hover:bg-primary-900 dark:ring-primary-800 dark:ring-1 dark:hover:ring-primary-900 dark:text-white'

  return (
        <div className="px-4 md:px-6 leading-normal">
            <input type="text" value={currentTitle} onChange={e => { setCurrentTitle(e.target.value) }}
                className={`${headingFont.className} font-bold break-normal text-gray-900 dark:text-white px-0 py-2 my-4 text-3xl md:text-4xl rounded-md border-0 shadow-none outline-none focus:ring-0 bg-inherit`} ></input>
            <div className="flex gap-2 flex-row">
                <div>
                    <p className="text-sm md:text-base font-normal text-gray-600 dark:text-gray-400">Created {createdAt ? new Date(createdAt).toLocaleString() : 'just now'}</p>
                    {/* <p className="text-sm md:text-base font-normal text-gray-600 dark:text-gray-400">Modified {updatedAt ? new Date(updatedAt).toLocaleString() : "just now"}</p> */}
                    <p className="text-sm md:text-base font-normal text-gray-600 dark:text-gray-400">Last saved {dayjs().from(dayjs(lastSaved), true)} ago</p>
                </div>
                <div className="flex gap-2 h-10 -mt-4 grow flex-row place-content-end">
                    <svg className={`py-3 px-2 ${!autosaveEnabled ? 'fill-red-500' : !unsavedChanges ? 'fill-primary-600' : 'fill-amber-500 animate-pulse'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" /></svg>
                    <Button color={buttonClasses} onClick={async () => { await savePage(true) }}><FaSave className="mr-2" /> Save</Button>
                    {/* <Button color="bg-red-500 hover:bg-red-700" onClick={() => setModalOpen(true)}><FaTrash className="mr-2" /> Delete</Button> */}
                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button className={`inline-flex w-full justify-center rounded-full p-3 ${buttonClasses}`} >
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
                                            <a href="#" onClick={() => { setModalOpen(true) }}
                                                className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm flex')}>
                                                <FaTrash className="mr-4" />
                                                Delete Page
                                            </a>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>

            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
            <DeleteModal show={modalOpen} onCancel={() => { setModalOpen(false) }} onConfirm={async () => { await deletePage(id) }} />
        </div>
  )
}
