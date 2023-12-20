import { ReactRenderer } from "@tiptap/react";
import tippy, { Instance } from "tippy.js";
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
        let popup: Instance;

        return {
            onStart: (props) => {
                component = new ReactRenderer(MentionSuggestionList, {
                    props,
                    editor: props.editor,
                });

                if (!props.clientRect || !props.clientRect()) {
                    return;
                }

                const { element: editorElement } = props.editor.options;

                popup = tippy(editorElement, {
                    getReferenceClientRect: props.clientRect as () => DOMRect,
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

                popup.setProps({
                    getReferenceClientRect: props.clientRect as () => DOMRect,
                });
            },

            onKeyDown(props) {
                if (props.event.key === "Escape") {
                    popup.hide();

                    return true;
                }

                return component.ref?.onKeyDown?.(props) || false;
            },

            onExit() {
                popup.destroy();
                component.destroy();
            },
        };
    };
