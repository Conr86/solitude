import React, { Fragment } from 'react'
import classNames from 'classnames'
import { Editor } from '@tiptap/react'
import useInView from "react-cool-inview"
import MenuItem, { Item } from './ToolbarItem'
import {
    RiBold,
    RiItalic,
    RiStrikethrough,
    RiCodeSSlashLine,
    RiEmotionLine,
    RiH1,
    RiH2,
    RiH3,
    RiH4,
    RiH5,
    RiH6,
    RiParagraph,
    RiListOrdered,
    RiListUnordered,
    RiCodeBoxLine,
    RiLink,
    RiLinkUnlink,
    RiDoubleQuotesL,
    RiSeparator,
    RiTextWrap,
    RiFormatClear,
    RiArrowGoBackLine,
    RiArrowGoForwardLine,
} from 'react-icons/ri'

import { setLink } from '../helpers/set-link'

type ToolbarProps = {
    editor: Editor | null
}

function Toolbar({ editor }: ToolbarProps) {
    const { observe, inView } = useInView({
        rootMargin: '-1px 0px 0px 0px',
        threshold: [1],
    })

    if (!editor) {
        return null
    }

    const isCursorOverLink = editor.getAttributes('link').href

    const items: Item[] = [
        {
            Icon: RiBold,
            title: 'Bold',
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: () => editor.isActive('bold'),
        },
        {
            Icon: RiItalic,
            title: 'Italic',
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: () => editor.isActive('italic'),
        },
        {
            Icon: RiStrikethrough,
            title: 'Strike',
            action: () => editor.chain().focus().toggleStrike().run(),
            isActive: () => editor.isActive('strike'),
        },
        {
            type: 'divider',
        },
        {
            Icon: RiH1,
            title: 'Heading 1',
            action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: () => editor.isActive('heading', { level: 1 }),
        },
        {
            Icon: RiH2,
            title: 'Heading 2',
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => editor.isActive('heading', { level: 2 }),
        },
        {
            Icon: RiH3,
            title: 'Heading 3',
            action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: () => editor.isActive('heading', { level: 3 }),
        },
        {
            Icon: RiParagraph,
            title: 'Paragraph',
            action: () => editor.chain().focus().setParagraph().run(),
            isActive: () => editor.isActive('paragraph'),
        },
        {
            Icon: RiListUnordered,
            title: 'Bullet List',
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: () => editor.isActive('bulletList'),
        },
        {
            Icon: RiListOrdered,
            title: 'Ordered List',
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: () => editor.isActive('orderedList'),
        },
        {
            type: 'divider',
        },
        {
            Icon: RiDoubleQuotesL,
            title: 'Blockquote',
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: () => editor.isActive('blockquote'),
        },
        {
            Icon: RiSeparator,
            title: 'Horizontal Rule',
            action: () => editor.chain().focus().setHorizontalRule().run(),
        },
        {
            type: 'divider',
        },
        {
            Icon: RiFormatClear,
            title: 'Clear Format',
            action: () => editor.chain().focus().clearNodes().unsetAllMarks()
                .run(),
        },
        {
            Icon: RiLink,
            title: 'Link',
            action: () => setLink(editor),
        },
        {
            type: 'divider',
        },
        {
            Icon: RiArrowGoBackLine,
            title: 'Undo',
            action: () => editor.chain().focus().undo().run(),
        },
        {
            Icon: RiArrowGoForwardLine,
            title: 'Redo',
            action: () => editor.chain().focus().redo().run(),
        },
    ]

    return (
        <div className={"flex justify-center items-center p-2 -mx-10 my-6 top-0 z-10 bg-primary-100 dark:bg-primary-800 dark:text-white rounded-full " + classNames({ sticky: !inView })} ref={observe}>
            <div className="flex space-x-1">
                {items.map((item, index) => (
                    <Fragment key={index}>
                        {item.type === 'divider' ? <div className="border-r border-primary-200 dark:border-primary-700" /> : <MenuItem {...item} />}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export { Toolbar }
