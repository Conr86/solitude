// import './MenuItem.scss'

import React from 'react'

export default ({
  item
}) => (
  <button
    className={`flex items-center justify-content-center p-2 rounded-md hover:bg-green-400 dark:hover:bg-green-900 ${item.isActive && item.isActive() ? ' is-active bg-green-300 dark:bg-green-700' : ''}`}
    onClick={item.action}
    title={item.title}
  ><item.icon></item.icon>
  </button>
)