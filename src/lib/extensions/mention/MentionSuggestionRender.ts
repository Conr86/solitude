import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";

import {
    MentionSuggestionList,
    MentionSuggestionListHandle,
} from "@/components/MentionSuggestionList.tsx";
import { NameUrlPair } from "@/lib/tiptap.config";
import { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";

export const MentionSuggestionRender: SuggestionOptions<NameUrlPair>["render"] =
    () => {
        let component: ReactRenderer<
            MentionSuggestionListHandle,
            SuggestionProps<NameUrlPair>
        >;
        let popup: any;

        return {
            onStart: (props) => {
                component = new ReactRenderer(MentionSuggestionList, {
                    props,
                    editor: props.editor,
                });

                if (!props.clientRect) {
                    return;
                }

                // @ts-ignore
                popup = tippy("body", {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: "manual",
                    placement: "bottom-start",
                });
            },

            onUpdate(props) {
                component.updateProps(props);

                if (!props.clientRect) {
                    return;
                }

                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                });
            },

            onKeyDown(props) {
                if (props.event.key === "Escape") {
                    popup[0].hide();

                    return true;
                }

                return component.ref?.onKeyDown?.(props) || false;
            },

            onExit() {
                popup[0].destroy();
                component.destroy();
            },
        };
    };
