import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";

import MentionList from "../../../components/MentionSuggestionList";
import { NameUrlPair } from "@/lib/tiptap.config";
import { SuggestionOptions } from "@tiptap/suggestion";

export const MentionSuggestionRender: SuggestionOptions<NameUrlPair>["render"] =
    () => {
        let component: ReactRenderer;
        let popup: any;

        return {
            onStart: (props) => {
                component = new ReactRenderer(MentionList, {
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

                // @ts-ignore
                return component.ref?.onKeyDown(props);
            },

            onExit() {
                popup[0].destroy();
                component.destroy();
            },
        };
    };
