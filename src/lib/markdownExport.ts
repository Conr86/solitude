import { NodeHtmlMarkdown, TranslatorConfigObject } from "node-html-markdown";
import { Page } from "@/lib/db/schema.ts";

export const ExportPageAsMarkdown = (page: Page) => {
    const header =
        `---\n` +
        `id: ${page.id}\n` +
        `title: ${page.title}\n` +
        `created: ${page.created_at}\n` +
        `updated: ${page.updated_at}\n` +
        `---\n\n`;

    const customTranslator: TranslatorConfigObject = {
        mention: ({ node }) => {
            const name = node.getAttribute("data-name");
            const url = node.getAttribute("data-url");
            if (!name || !url) return {};

            return {
                content: name,
                prefix: "[",
                postfix: "]" + `(/${url})`,
                recurse: false,
                preserveIfEmpty: true,
            };
        },
    };

    return (
        header +
        NodeHtmlMarkdown.translate(page.content ?? "", {}, customTranslator)
    );
};

export const downloadMarkdownExport = (page: Page | undefined) => {
    if (!page) return;
    const blob = ExportPageAsMarkdown(page);
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${page?.title + ".md" ?? "Export.md"}`);

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode?.removeChild(link);
};
