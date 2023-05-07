
export interface PageState {
  lastSaved: Date | null
  unsavedChanges: boolean
  currentText: string | null
  lastText: string | null
  currentTitle: string
  lastTitle: string
}

export interface PageAction {
  type: string;
  title: string;
  text: string
}

export const pageStateReducer = (page : PageState, action: any) => {
    switch (action.type) {
      case 'opened': {
        return action.page
      }
      case 'changed': {
        return {
            ...page,
            unsavedChanges: true,
            currentTitle: action.newTitle ?? page.currentTitle,
            currentText: action.newText ?? page.currentText
        }
      }
      case 'saved': {
        return {
            ...page,
            unsavedChanges: false,
            lastText: page.currentText,
            lastTitle: page.currentTitle,
            lastSaved: new Date()
        }
      }
      default: {
        throw Error('Unknown action: ' + action.type);
      }
    }
  }
  