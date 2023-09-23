export interface PageState {
    lastSaved: Date | undefined;
    unsavedChanges: boolean;
    currentText: string | undefined;
    lastText: string | undefined;
    currentTitle: string;
    lastTitle: string;
}

export interface PageAction {
    type: string;
    newTitle?: string;
    newText?: string;
    page?: any;
}

export const pageStateReducer = (page: PageState, action: PageAction) => {
    switch (action.type) {
        case "opened": {
            return action.page;
        }
        case "changed": {
            return {
                ...page,
                unsavedChanges: true,
                currentTitle: action.newTitle ?? page.currentTitle,
                currentText: action.newText ?? page.currentText,
            };
        }
        case "saved": {
            return {
                ...page,
                unsavedChanges: false,
                lastText: page.currentText,
                lastTitle: page.currentTitle,
                lastSaved: new Date(),
            };
        }
        default: {
            throw Error("Unknown action: " + action.type);
        }
    }
};
