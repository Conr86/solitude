import { Reducer } from "react";

export interface PageState {
    lastSaved: Date | undefined;
    unsavedChanges: boolean;
    currentText: string | undefined;
    lastText: string | undefined;
    currentTitle: string;
    lastTitle: string;
}

export interface PageAction {
    type: "opened" | "changed" | "saved";
    newTitle?: string | undefined;
    newText?: string | undefined;
    newLastSaved?: Date | undefined;
}

export const pageStateReducer: Reducer<PageState, PageAction> = (
    prevState: PageState,
    action: PageAction,
): PageState => {
    switch (action.type) {
        case "opened": {
            return {
                ...prevState,
                unsavedChanges: false,
                lastSaved: action.newLastSaved,
                currentTitle: action.newTitle ?? prevState.currentTitle,
                currentText: action.newText,
                lastTitle: action.newTitle ?? prevState.currentTitle,
                lastText: action.newText,
            };
        }
        case "changed": {
            return {
                ...prevState,
                unsavedChanges: true,
                currentTitle: action.newTitle ?? prevState.currentTitle,
                currentText: action.newText ?? prevState.currentText,
            };
        }
        case "saved": {
            return {
                ...prevState,
                unsavedChanges: false,
                lastText: prevState.currentText,
                lastTitle: prevState.currentTitle,
                lastSaved: new Date(),
            };
        }
        default: {
            throw Error("Unknown action: " + action.type);
        }
    }
};
