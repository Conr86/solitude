import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import CharacterCount from '@tiptap/extension-character-count'
import Focus from '@tiptap/extension-focus'
import Typography from '@tiptap/extension-typography'
import { Libre_Baskerville } from 'next/font/google'
import { Mention } from '../helpers/Mention'
import { renderMentionSuggestion } from './renderMentionSuggestion'
import { Page } from 'prisma/prisma-client'

export const proseFont = Libre_Baskerville({
    weight: ['400', '700'],
    subsets: ['latin']
})

interface NameUrlPair {
    name: string
    url: number
  }

export const createItems = (pages: Page[]) => {
    let v : NameUrlPair[] = [];
    pages.forEach(e => {
        v.push({name: e.title, url: e.id});
    });
    let items = ({ query } : any) => {
        return v
          .filter((item : NameUrlPair) => item.name.toLowerCase().startsWith(query.toLowerCase()))
          .slice(0, 5)
      }
    return items;
  }

export const getExtensions = (items: any) => [
    StarterKit.configure({
        paragraph: {
            HTMLAttributes: {
                class: 'py-1 px-4 -mx-4 rounded-md',
            },
        },
    }),
    Link.configure({
        linkOnPaste: true,
        openOnClick: true,
        HTMLAttributes: {
            class: 'cursor-pointer hover:text-primary-400',
            title: ''
        }
    }),
    Typography,
    CharacterCount,
    Mention.configure({
        suggestion: {
            render: renderMentionSuggestion,
            items
        }
    }),
    Focus.configure({
      className: 'text-gray-950 dark:text-gray-300',
      // bg-gray-100 dark:bg-primary-950
    }),
]
export const getEditorProps = () => { return {
    attributes: {
        class: `${proseFont.className} prose dark:prose-invert prose-sm sm:prose-base lg:prose-md xl:prose-lg focus:outline-none max-w-none text-gray-600 dark:text-gray-400`
    }
}}