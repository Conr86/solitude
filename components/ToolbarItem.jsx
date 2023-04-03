import React from 'react'

const ToolbarItem = ({ item }) => (
  <button
    className={`flex items-center justify-content-center p-2 rounded-md hover:bg-primary-400 dark:hover:bg-primary-900 ${item.isActive && item.isActive() ? ' is-active bg-primary-300 dark:bg-primary-700' : ''}`}
    onClick={item.action}
    title={item.title}
  >
    <item.icon></item.icon>
  </button>)

export default ToolbarItem