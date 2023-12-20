import { Extension } from "@tiptap/core";
import { Node as ProsemirrorNode } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

import DecoratorPlugin from "./DecoratorPlugin";

function runAllDecoratorPlugins(
    doc: ProsemirrorNode,
    plugins: Array<typeof DecoratorPlugin>,
) {
    const decorations: [any?] = [];

    const results = plugins
        .map((RegisteredDecoratorPlugin) => {
            return new RegisteredDecoratorPlugin(doc).scan().getResults();
        })
        .flat();

    results.forEach((issue) => {
        decorations.push(
            Decoration.inline(issue.from, issue.to, {
                class: issue.className,
            }),
        );
    });

    return DecorationSet.create(doc, decorations);
}

export interface DecoratorOptions {
    plugins: Array<typeof DecoratorPlugin>;
}

export const Decorator = Extension.create<DecoratorOptions>({
    name: "decorator",

    addOptions() {
        return {
            plugins: [],
        };
    },

    addProseMirrorPlugins() {
        const { plugins } = this.options;

        return [
            new Plugin({
                key: new PluginKey("decorator"),
                state: {
                    init(_, { doc }) {
                        return runAllDecoratorPlugins(doc, plugins);
                    },
                    apply(transaction, oldState) {
                        return transaction.docChanged
                            ? runAllDecoratorPlugins(transaction.doc, plugins)
                            : oldState;
                    },
                },
                props: {
                    decorations(state) {
                        return this.getState(state);
                    },
                },
            }),
        ];
    },
});
