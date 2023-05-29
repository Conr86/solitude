import React from 'react'
import { IconType } from 'react-icons';

export interface Item {
  Icon?: IconType;
  title?: string;
  action?: () => boolean | void;
  isActive?: () => boolean;
  divider?: boolean;
}

const ToolbarItem = ({ Icon, title, action, isActive } : Item) => (
  <button
    className={`flex items-center justify-content-center p-2 rounded-md hover:bg-primary-400 dark:hover:bg-primary-900 ${isActive && isActive() ? ' is-active bg-primary-300 dark:bg-primary-700' : ''}`}
    onClick={action}
    title={title}
  >
    {Icon && 
    <Icon></Icon>}
  </button>)

export default ToolbarItem