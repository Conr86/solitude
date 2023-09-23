import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import CharacterCount from "@tiptap/extension-character-count";
import Focus from "@tiptap/extension-focus";
import Typography from "@tiptap/extension-typography";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import { Mention } from "./extensions/mention/Mention";
import { MentionSuggestionRender } from "./extensions/mention/MentionSuggestionRender";
import { Page } from "prisma/prisma-client";
import { Decorator } from "./extensions/decorator/Decorator";
import { Quotes } from "./extensions/decorator/Quotes";

export interface NameUrlPair {
    name: string;
    url: number;
}

const itemsSearchFilter =
    (pages: Page[]): (({ query }: { query: string }) => NameUrlPair[]) =>
    ({ query }: { query: string }) =>
        pages
            .map((e) => ({ name: e.title, url: e.id }))
            .filter((item: NameUrlPair) =>
                item.name.toLowerCase().startsWith(query.toLowerCase()),
            )
            .slice(0, 5);

export const getExtensions = (pages: Page[] | undefined) => [
    StarterKit.configure({
        codeBlock: false,
    }),
    Link.configure({
        linkOnPaste: true,
        openOnClick: true,
        HTMLAttributes: {
            class: "cursor-pointer hover:text-primary-400",
            title: "",
        },
    }),
    Table.configure({
        resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    Typography,
    CharacterCount,
    Mention.configure({
        suggestion: {
            render: MentionSuggestionRender,
            items: pages ? itemsSearchFilter(pages) : undefined,
        },
    }),
    Focus.configure({
        mode: "shallowest",
        className:
            "border-solid border-l -ml-[17px] pl-4 border-gray-950 dark:border-gray-300 text-gray-950 dark:text-gray-300",
    }),
    Decorator.configure({
        plugins: [Quotes],
    }),
];
export const getEditorProps = () => {
    return {
        attributes: {
            style: 'font-family: "Libre Baskerville"',
            class: `-ml-4 prose dark:prose-invert \
        prose-sm sm:prose-base lg:prose-md xl:prose-lg \
        prose-h1:text-4xl prose-h2:text-2xl prose-h3:text-xl \
        focus:outline-none max-w-none \
        text-gray-600 dark:text-gray-400`,
        },
    };
};
