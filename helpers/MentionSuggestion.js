import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'

import MentionList from '../components/MentionList.jsx'

export function createItems(pages) {
    let v = [];
    pages.forEach(e => {
        v.push({name: e.title, url: e.id});
    });
    let items = ({ query }) => {
        return v
          .filter(item => item.name.toLowerCase().startsWith(query.toLowerCase()))
          .slice(0, 5)
      }
    return items;
}

export default {
  render: () => {
    let component
    let popup

    return {
      onStart: props => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}