import React, { type ReactNode } from 'react'

interface ButtonProps {
  color?: string
  children: ReactNode
  onClick: () => void
}

export function Button ({ color = '', children, ...props }: ButtonProps): JSX.Element {
  return (
    <button
      className={
        `${color} flex items-center px-3 py-1.5 font-medium tracking-wide capitalize transition-colors duration-300 transform rounded-xl focus:outline-none focus:ring focus:ring-opacity-80 `
      }{...props}>
      {children}
    </button>
  )
}
