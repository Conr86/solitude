import useSWR from 'swr'
import { NavLink } from './NavLink'
import { FaPlus, FaFile, FaHome, FaExclamationTriangle, FaTimes, FaChevronRight } from 'react-icons/fa'
import { useRouter } from 'next/router'
import { type Page } from '@prisma/client'
import { useState } from 'react'

export default function BasicSidebar(): JSX.Element {
    const [filterText, setFilterText] = useState('')
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const { data, error } = useSWR('/api/page')
    const router = useRouter()

    if (error) return <div>An error occured.</div>

    if (!data) return <div>Loading ...</div>

    return (
        <div>
            <aside id="sidebar-multi-level-sidebar" className={`${sidebarVisible ? "translate-x-0" : "-translate-x-full"} fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out`} aria-label="Sidebar">
                <button onClick={() => setSidebarVisible(!sidebarVisible)}
                    className={`absolute bottom-2 -right-14 hover:bg-gray-200 text-gray-500 dark:hover:text-gray-400 dark:hover:bg-gray-700 flex items-center p-4 rounded-lg group`}>
                    <FaChevronRight className={`${sidebarVisible ? "rotate-180" : ""} transition ease-in-out duration-300`} />
                </button>
                <div className="h-full px-3 py-4 overflow-y-auto bg-secondary-100 dark:bg-secondary-800">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <NavLink href="" Icon={FaHome} label="Home" />
                        </li>
                        <li>
                            <NavLink href="new" Icon={FaPlus} label="New Page" />
                        </li>
                    </ul>
                    <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center mb-4">
                            <label htmlFor="simple-search" className="sr-only">Search</label>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                                </div>
                                <input type="text" id="simple-search" value={filterText} onChange={e => { setFilterText(e.target.value) }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" />
                                <button onClick={() => { setFilterText('') }}
                                    className={`${filterText === '' ? 'hidden' : ''} absolute inset-y-0 right-0 text-gray-400 hover:text-gray-500 flex items-center pr-3`}><FaTimes /></button>
                            </div>
                        </div>
                        {data.filter((item: Page) => item.title.toLowerCase().includes(filterText.toLowerCase())).map((page: Page) =>
                            <li key={page.id}>
                                <NavLink href={page.id} Icon={FaFile} label={page.title} />
                            </li>
                        )}
                    </ul>
                    {router.asPath === '/new' &&
                        <div id="dropdown-cta" className="p-4 mt-6 rounded-lg bg-yellow-100 dark:bg-red-800" role="alert">
                            <div className="flex items-center mb-3 text-orange-900">
                                <span className="flex bg-orange-300  text-sm font-semibold mr-2 px-4 py-1 rounded dark:bg-orange-200 dark:text-orange-900">
                                    <FaExclamationTriangle className="mr-2 my-0.5" />Warning</span>
                                {/* <button type="button" className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1 dark:text-white hover:bg-orange-300 dark:hover:bg-red-700 inline-flex h-6 w-6" data-dismiss-target="#dropdown-cta" aria-label="Close">
                                    <span className="sr-only">Close</span>
                                    <svg aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                </button> */}
                            </div>
                            <p className="mb-3 text-sm text-gray-700 dark:text-white">
                                You&apos;re currently working on an unsaved draft. Make sure to press the save button if you want to keep your work.
                            </p>
                        </div>
                    }
                </div>
            </aside>
        </div>
    )
}
