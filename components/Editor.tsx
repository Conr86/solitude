import { useEditor, EditorContent } from '@tiptap/react'
import React, { useEffect, useState, Fragment, useReducer } from 'react'
import { Toolbar } from './Toolbar'
import router from 'next/router'
import { Button } from '../components/Button'
import useSWR, { mutate } from 'swr'
import { FaAngleUp, FaCog, FaSave, FaTrash } from 'react-icons/fa'
import { Menu, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { type Page } from '@prisma/client'
import type Error from 'next/error'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { DeleteModal } from './DeleteModal'
import { apiBaseUrl } from '@/helpers/apiSettings'
import { PageState, pageStateReducer }  from '@/helpers/pageStateReducer';
import { createItems, getEditorProps, getExtensions, proseFont } from '@/helpers/tiptap.config'

async function deletePage(id: number): Promise<void> {
  await fetch(`${apiBaseUrl}/page/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  await mutate(`${apiBaseUrl}/page`)
  await router.push('/')
}

async function createPage (page : PageState): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/page`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: page.currentTitle, content: page.currentText })
  })
  console.log(res)
  await mutate(`${apiBaseUrl}/page`)
  await router.push(`/${(await res.json()).id}`)
}

export default function EditorComponent({ id, title, createdAt, updatedAt, content }: Page): JSX.Element {
  const { data, error } = useSWR<Page[], Error>(`${apiBaseUrl}/page`)

  const [displayState, setDisplayState] = useState({
    modalOpen: false,
    showTopBtn: false
  })

  const autosaveEnabled = Boolean(id);

  useEffect(() => {
    dispatch({type:'opened', page: {
      lastSaved: updatedAt,
      unsavedChanges: false,
      currentText: content,
      lastText: content,
      currentTitle: title,
      lastTitle: title
    }})
  },[content, id, title, updatedAt])

  const [page, dispatch] = useReducer(pageStateReducer, {
    lastSaved: updatedAt,
    unsavedChanges: false,
    currentText: content,
    lastText: content,
    currentTitle: title,
    lastTitle: title
  })

  // Autosave
  dayjs.extend(relativeTime)

  // Scroll to top functionality
  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        setDisplayState({...displayState, showTopBtn: true});
      } else {
        setDisplayState({...displayState, showTopBtn: false});
      }
    });
  }, [displayState]);
  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  async function savePage(id : number, page : PageState): Promise<void> {
    await fetch(`${apiBaseUrl}/page/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: page.currentTitle, content: page.currentText })
    })
    await mutate(`${apiBaseUrl}/page/${id}`)
    if (page.currentTitle !== page.lastTitle) {
      await mutate(`${apiBaseUrl}/page`)
    }
    dispatch({
      type: 'saved'
    });
  }

  // Autosave editor content
  const AUTOSAVE_INTERVAL: number = 3000
  React.useEffect(() => {
    if (!Boolean(id)) return
    const timer = setTimeout(() => {
      if (page.lastText !== page.currentText || page.lastTitle !== page.currentTitle) {
        console.log(`Autosaving... id ${id}`)
        savePage(id, page)
      }
    }, AUTOSAVE_INTERVAL)
    return () => { clearTimeout(timer) }
  }, [page, id])

  // Create editor
  const editor = useEditor({
    extensions: getExtensions((!error && data) ? createItems(data) : undefined),
    editorProps: getEditorProps(),
    content,
    onUpdate: ({ editor }) => dispatch({
      type: 'changed',
      newText: editor.getHTML(),
      newTitle: undefined
    })
  }, [id])

  const buttonClasses = 'bg-primary-100 hover:bg-primary-400 dark:bg-transparent dark:hover:bg-primary-900 dark:ring-primary-800 dark:ring-1 dark:hover:ring-primary-900 dark:text-white'

  return (
    <div className="px-4 md:px-6">
      <input type="text" value={page.currentTitle} onChange={e => { dispatch({type: 'changed', newText: undefined, newTitle: e.target.value}) }}
        className={`${proseFont.className} font-bold break-normal text-gray-900 dark:text-white px-0 py-2 my-1 text-3xl md:text-4xl rounded-md border-0 shadow-none outline-none focus:ring-0 bg-inherit`} ></input>
      <div className="flex gap-2 flex-row">
        <div className="text-sm md:text-base font-normal text-gray-600 dark:text-gray-400">
          <p>Created {createdAt ? new Date(createdAt).toLocaleString() : 'just now'}</p>
          {/* <p className="text-sm md:text-base font-normal text-gray-600 dark:text-gray-400">Modified {updatedAt ? new Date(updatedAt).toLocaleString() : "just now"}</p> */}
          <p>
            {page.lastSaved ? `Last saved ${dayjs().from(dayjs(page.lastSaved), true)} ago` : `Unsaved draft...`}
          </p>
          <p>
            {editor?.storage.characterCount.words()} words
          </p>
        </div>
        <div className="flex gap-2 h-10 grow flex-row place-content-end">
          <span title={!autosaveEnabled ? "Autosave disabled on new pages. Manually save your work" : page.unsavedChanges ? "Unsaved changes..." : "Saved"} className="mr-4">
            <svg className={`py-3 px-2 ${!autosaveEnabled ? 'fill-red-500' : !page.unsavedChanges ? 'fill-primary-600' : 'fill-amber-500 animate-pulse'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" /></svg>
          </span>
          <Button color={buttonClasses} onClick={() => {if (autosaveEnabled) { savePage(id, page) } else createPage(page)}}><FaSave className="mr-2" /> Save</Button>
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
                      <a href="#" onClick={() => { setDisplayState({...displayState, modalOpen: true})}}
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
      <DeleteModal show={displayState.modalOpen} onCancel={() => { setDisplayState({...displayState, modalOpen:false}) }} onConfirm={async () => { await deletePage(id) }} />
      <button type="button" onClick={goToTop} className={`${displayState.showTopBtn ? '' : 'translate-y-32'} p-2 fixed bottom-10 right-10 inline-block rounded-full transition ease-in duration-100 bg-primary-100 hover:bg-primary-400 dark:bg-transparent dark:hover:bg-primary-900 dark:ring-primary-800 dark:ring-1 dark:hover:ring-primary-900 dark:text-white`}>
        <FaAngleUp className="w-8 h-8" />
      </button>
    </div>
  )
}
