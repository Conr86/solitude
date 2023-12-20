import { mergeAttributes, Node } from "@tiptap/core";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { PluginKey } from "@tiptap/pm/state";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";
import { ReactNodeViewRenderer } from "@tiptap/react";

import MentionLink from "../../../components/MentionLink";

export type MentionOptions = {
    HTMLAttributes: Record<string, string>;
    renderLabel: (props: {
        options: MentionOptions;
        node: ProseMirrorNode;
    }) => string;
    suggestion: Omit<SuggestionOptions, "editor">;
};

export const MentionPluginKey = new PluginKey("mention");

export const Mention = Node.create<MentionOptions>({
    name: "mention",

    addOptions() {
        return {
            HTMLAttributes: {},
            renderLabel({ options, node }) {
                return `${options.suggestion.char}${
                    node.attrs.label ?? node.attrs.id
                }`;
            },
            suggestion: {
                char: "@",
                pluginKey: MentionPluginKey,
                command: ({ editor, range, props }) => {
                    // increase range.to by one when the next node is of type "text"
                    // and starts with a space character
                    const nodeAfter = editor.view.state.selection.$to.nodeAfter;
                    const overrideSpace = nodeAfter?.text?.startsWith(" ");

                    if (overrideSpace) {
                        range.to += 1;
                    }

                    editor
                        .chain()
                        .focus()
                        .insertContentAt(range, [
                            {
                                type: this.name,
                                attrs: props,
                            },
                            {
                                type: "text",
                                text: " ",
                            },
                        ])
                        .run();

                    window.getSelection()?.collapseToEnd();
                },
                allow: ({ state, range }) => {
                    const $from = state.doc.resolve(range.from);
                    const type = state.schema.nodes[this.name];
                    const allow =
                        !!$from.parent.type.contentMatch.matchType(type);

                    return allow;
                },
            },
        };
    },

    group: "inline",

    inline: true,

    selectable: false,

    atom: true,

    addAttributes() {
        return {
            name: {
                default: null,
                parseHTML: (element) => element.getAttribute("data-name"),
                renderHTML: (attributes) => {
                    if (!attributes.name) {
                        return {};
                    }

                    return {
                        "data-name": attributes.name,
                    };
                },
            },

            url: {
                default: null,
                parseHTML: (element) => element.getAttribute("data-url"),
                renderHTML: (attributes) => {
                    if (!attributes.url) {
                        return {};
                    }

                    return {
                        "data-url": attributes.url,
                    };
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "mention",
                // tag: `a[data-type="${this.name}"]`,
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["mention", mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(MentionLink);
    },

    //   renderText({ node }) {
    //     return this.options.renderLabel({
    //       options: this.options,
    //       node,
    //     })
    //   },

    addKeyboardShortcuts() {
        return {
            Backspace: () =>
                this.editor.commands.command(({ tr, state }) => {
                    let isMention = false;
                    const { selection } = state;
                    const { empty, anchor } = selection;

                    if (!empty) {
                        return false;
                    }

                    state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
                        if (node.type.name === this.name) {
                            isMention = true;
                            tr.insertText(
                                this.options.suggestion.char || "",
                                pos,
                                pos + node.nodeSize,
                            );

                            return false;
                        }
                    });

                    return isMention;
                }),
        };
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});
