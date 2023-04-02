import useSWR from 'swr'
import { NavLink } from './NavLink';
import { FaPlus, FaFile, FaHome, FaExclamationTriangle } from 'react-icons/fa'
import { useRouter } from 'next/router';
import { Page } from '@prisma/client';

const fetcher = (url: RequestInfo | URL) => fetch(url).then((res) => res.json());

export default function () {
    const { data, error } = useSWR('/api/page', fetcher)
    const router = useRouter();

    if (error) return <div>An error occured.</div>

    if (!data) return <div>Loading ...</div>

    return (
        <div>
            <button data-drawer-target="sidebar-multi-level-sidebar" data-drawer-toggle="sidebar-multi-level-sidebar" aria-controls="sidebar-multi-level-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>

            <aside id="sidebar-multi-level-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <NavLink href="" Icon={FaHome} label="Home" />
                        </li>
                        <li>
                            <NavLink href="new" Icon={FaPlus} label="New Page" />
                        </li>
                    </ul>
                    <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                        {data.map((page: Page) =>
                            <li>
                                <NavLink href={page.id} Icon={FaFile} label={page.title} />
                            </li>
                        )}
                    </ul>
                    {router.asPath === "/new" &&
                        <div id="dropdown-cta" className="p-4 mt-6 rounded-lg bg-red-50 dark:bg-red-800" role="alert">
                            <div className="flex items-center mb-3">
                                <span className="flex bg-orange-100 text-orange-800 text-sm font-semibold mr-2 px-4 py-1 rounded dark:bg-orange-200 dark:text-orange-900">
                                    <FaExclamationTriangle className="text-orange-900 mr-2 my-0.5" />Warning</span>
                                <button type="button" className="ml-auto -mx-1.5 -my-1.5 text-white rounded-lg focus:ring-2 p-1 hover:bg-red-700 inline-flex h-6 w-6" data-dismiss-target="#dropdown-cta" aria-label="Close">
                                    <span className="sr-only">Close</span>
                                    <svg aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                </button>
                            </div>
                            <p className="mb-3 text-sm text-white dark:text-white-400">
                                You're currently working on an unsaved draft. Make sure to press the save button if you want to keep your work.
                            </p>
                        </div>
                    }
                </div>
            </aside>
        </div>
    )
}