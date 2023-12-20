import { NameUrlPair } from "@/lib/tiptap.config";
import { SuggestionProps } from "@tiptap/suggestion";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { FaFile } from "react-icons/fa";

export type MentionSuggestionListHandle = {
    onKeyDown: ({ event }: { event: KeyboardEvent }) => boolean;
};
export const MentionSuggestionList = forwardRef<
    MentionSuggestionListHandle,
    SuggestionProps<NameUrlPair>
>(function MentionSuggestionList(props, ref) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
        const item = props.items[index];

        if (item) {
            props.command(item);
        }
    };

    const upHandler = () => {
        setSelectedIndex(
            (selectedIndex + props.items.length - 1) % props.items.length,
        );
    };

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
        selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === "ArrowUp") {
                upHandler();
                return true;
            }

            if (event.key === "ArrowDown") {
                downHandler();
                return true;
            }

            if (event.key === "Enter" || event.key == "Tab") {
                enterHandler();
                return true;
            }

            return false;
        },
    }));

    return (
        <div
            className={`bg-secondary-100 dark:bg-secondary-800 rounded-md shadow-md overflow-hidden relative`}
        >
            {props.items.length ? (
                props.items.map((item: NameUrlPair, index: number) => (
                    <button
                        className={`flex items-center rounded-md text-left px-2 py-2 w-full text-gray-900 dark:text-gray-400  ${
                            index === selectedIndex &&
                            "bg-gray-200 dark:text-white dark:bg-gray-700"
                        }`}
                        key={index}
                        onClick={() => selectItem(index)}
                    >
                        <FaFile
                            className={`w-6 transition duration-75 text-gray-500 dark:text-gray-400`}
                        />
                        <span className="flex-1 text-left w-max ml-2 line-clamp-1">
                            {item.name}
                        </span>
                    </button>
                ))
            ) : (
                <div
                    className={`border rounded-md block text-left px-2 py-2 w-full border-transparent `}
                >
                    No result
                </div>
            )}
        </div>
    );
});
