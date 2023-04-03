import React, { Fragment } from 'react'
import classNames from 'classnames'
import { Editor } from '@tiptap/react'
import useInView from "react-cool-inview"
import MenuItem from './ToolbarItem'
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

    const items = [
        {
            icon: RiBold,
            title: 'Bold',
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: () => editor.isActive('bold'),
        },
        {
            icon: RiItalic,
            title: 'Italic',
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: () => editor.isActive('italic'),
        },
        {
            icon: RiStrikethrough,
            title: 'Strike',
            action: () => editor.chain().focus().toggleStrike().run(),
            isActive: () => editor.isActive('strike'),
        },
        {
            type: 'divider',
        },
        {
            icon: RiH1,
            title: 'Heading 1',
            action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: () => editor.isActive('heading', { level: 1 }),
        },
        {
            icon: RiH2,
            title: 'Heading 2',
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => editor.isActive('heading', { level: 2 }),
        },
        {
            icon: RiH3,
            title: 'Heading 3',
            action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: () => editor.isActive('heading', { level: 3 }),
        },
        {
            icon: RiParagraph,
            title: 'Paragraph',
            action: () => editor.chain().focus().setParagraph().run(),
            isActive: () => editor.isActive('paragraph'),
        },
        {
            icon: RiListUnordered,
            title: 'Bullet List',
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: () => editor.isActive('bulletList'),
        },
        {
            icon: RiListOrdered,
            title: 'Ordered List',
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: () => editor.isActive('orderedList'),
        },
        {
            type: 'divider',
        },
        {
            icon: RiDoubleQuotesL,
            title: 'Blockquote',
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: () => editor.isActive('blockquote'),
        },
        {
            icon: RiSeparator,
            title: 'Horizontal Rule',
            action: () => editor.chain().focus().setHorizontalRule().run(),
        },
        {
            type: 'divider',
        },
        {
            icon: RiFormatClear,
            title: 'Clear Format',
            action: () => editor.chain().focus().clearNodes().unsetAllMarks()
                .run(),
        },
        {
            icon: RiLink,
            title: 'Link',
            action: () => setLink(editor),
        },
        {
            type: 'divider',
        },
        {
            icon: RiArrowGoBackLine,
            title: 'Undo',
            action: () => editor.chain().focus().undo().run(),
        },
        {
            icon: RiArrowGoForwardLine,
            title: 'Redo',
            action: () => editor.chain().focus().redo().run(),
        },
    ]

    return (
        <div className={"flex justify-center items-center p-2 -mx-10 my-6 top-0 z-10 bg-primary-100 dark:bg-primary-800 dark:text-white rounded-full " + classNames({ sticky: !inView })} ref={observe}>
            <div className="flex space-x-1">
                {items.map((item, index) => (
                    <Fragment key={index}>
                        {item.type === 'divider' ? <div className="border-r border-primary-200 dark:border-primary-700" /> : <MenuItem item={item} />}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export { Toolbar }
