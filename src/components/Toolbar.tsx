import { Fragment, useMemo } from "react";
import classNames from "classnames";
import { Editor } from "@tiptap/react";
import { useInView } from "react-cool-inview";
import MenuItem, { Item } from "./ToolbarItem";
import {
    RiBold,
    RiItalic,
    RiStrikethrough,
    RiH1,
    RiH2,
    RiH3,
    RiParagraph,
    RiListOrdered,
    RiListUnordered,
    RiLink,
    RiDoubleQuotesL,
    RiSeparator,
    RiFormatClear,
    RiArrowGoBackLine,
    RiArrowGoForwardLine,
} from "react-icons/ri";

import { setLink } from "@/lib/extensions/setLink";

type ToolbarProps = {
    editor: Editor | null;
};

function Toolbar({ editor }: ToolbarProps) {
    const { observe, inView } = useInView({
        rootMargin: "-100px 0px 0px 0px",
        threshold: [1],
    });

    // const isCursorOverLink = editor.getAttributes("link").href;

    const items: Item[] = useMemo(
        () =>
            editor
                ? [
                      {
                          Icon: RiBold,
                          title: "Bold",
                          action: () =>
                              editor.chain().focus().toggleBold().run(),
                          isActive: () => editor.isActive("bold"),
                      },
                      {
                          Icon: RiItalic,
                          title: "Italic",
                          action: () =>
                              editor.chain().focus().toggleItalic().run(),
                          isActive: () => editor.isActive("italic"),
                      },
                      {
                          Icon: RiStrikethrough,
                          title: "Strike",
                          action: () =>
                              editor.chain().focus().toggleStrike().run(),
                          isActive: () => editor.isActive("strike"),
                      },
                      {
                          divider: true,
                      },
                      {
                          Icon: RiH1,
                          title: "Heading 1",
                          action: () =>
                              editor
                                  .chain()
                                  .focus()
                                  .toggleHeading({ level: 1 })
                                  .run(),
                          isActive: () =>
                              editor.isActive("heading", { level: 1 }),
                      },
                      {
                          Icon: RiH2,
                          title: "Heading 2",
                          action: () =>
                              editor
                                  .chain()
                                  .focus()
                                  .toggleHeading({ level: 2 })
                                  .run(),
                          isActive: () =>
                              editor.isActive("heading", { level: 2 }),
                      },
                      {
                          Icon: RiH3,
                          title: "Heading 3",
                          action: () =>
                              editor
                                  .chain()
                                  .focus()
                                  .toggleHeading({ level: 3 })
                                  .run(),
                          isActive: () =>
                              editor.isActive("heading", { level: 3 }),
                      },
                      {
                          Icon: RiParagraph,
                          title: "Paragraph",
                          action: () =>
                              editor.chain().focus().setParagraph().run(),
                          isActive: () => editor.isActive("paragraph"),
                      },
                      {
                          Icon: RiListUnordered,
                          title: "Bullet List",
                          action: () =>
                              editor.chain().focus().toggleBulletList().run(),
                          isActive: () => editor.isActive("bulletList"),
                      },
                      {
                          Icon: RiListOrdered,
                          title: "Ordered List",
                          action: () =>
                              editor.chain().focus().toggleOrderedList().run(),
                          isActive: () => editor.isActive("orderedList"),
                      },
                      {
                          divider: true,
                      },
                      {
                          Icon: RiDoubleQuotesL,
                          title: "Blockquote",
                          action: () =>
                              editor.chain().focus().toggleBlockquote().run(),
                          isActive: () => editor.isActive("blockquote"),
                      },
                      {
                          Icon: RiSeparator,
                          title: "Horizontal Rule",
                          action: () =>
                              editor.chain().focus().setHorizontalRule().run(),
                      },
                      {
                          divider: true,
                      },
                      {
                          Icon: RiFormatClear,
                          title: "Clear Format",
                          action: () =>
                              editor
                                  .chain()
                                  .focus()
                                  .clearNodes()
                                  .unsetAllMarks()
                                  .run(),
                      },
                      {
                          Icon: RiLink,
                          title: "Link",
                          action: () => setLink(editor),
                      },
                      {
                          divider: true,
                      },
                      {
                          Icon: RiArrowGoBackLine,
                          title: "Undo",
                          action: () => editor.chain().focus().undo().run(),
                      },
                      {
                          Icon: RiArrowGoForwardLine,
                          title: "Redo",
                          action: () => editor.chain().focus().redo().run(),
                      },
                  ]
                : [],
        [editor],
    );

    return (
        <div
            className={
                "flex justify-center items-center p-2 -mx-10 my-6 top-4 z-10 bg-primary-100 dark:bg-primary-800 dark:text-white rounded-full " +
                classNames({ sticky: !inView })
            }
            ref={observe}
        >
            <div className="flex space-x-1">
                {items.map((item, index) => (
                    <Fragment key={index}>
                        {item.divider ? (
                            <div className="border-r border-primary-200 dark:border-primary-700" />
                        ) : (
                            <MenuItem {...item} />
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    );
}

export { Toolbar };
