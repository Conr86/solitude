import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export const NavLink = ({ href, Icon, label, depth = 0, arrow = null }: any) => {
  const { asPath } = useRouter()
  return (
    <Link href={`/${href}`} className={`${asPath === `/${href}`
    ? 'bg-primary-100 dark:text-white dark:bg-primary-800'
    : 'hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700'} 
        flex items-center w-full py-2 pl-${depth > 0 ? 2 + 4 * depth : '2'} pr-2 transition duration-75 rounded-lg group `}>
      <Icon className={`${asPath === `/${href}`
        ? 'dark:text-primary-100'
        : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white'} 
        flex-shrink-0 w-6 transition duration-75 `} />
      <span className="flex-1 text-left w-max ml-3 line-clamp-1">{label}</span>
      {arrow && <span className="pr-1">{arrow}</span>}
    </Link>
  )
}
