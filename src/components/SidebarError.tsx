import { Link, Outlet } from "@tanstack/react-router";
import { FaCog } from "react-icons/fa";

export default function SidebarError() {
    return (
        <>
            <aside
                id="sidebar-multi-level-sidebar"
                className={`translate-x-0 fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out`}
                aria-label="Sidebar"
            >
                <div className="h-full overflow-y-auto bg-secondary-100 dark:bg-secondary-800">
                    <div className="flex flex-col gap-4 h-screen w-full justify-center items-center">
                        <img
                            className="animate-pulse mx-auto float-center w-1/2 "
                            src="/logo.svg"
                            alt="Solitude Logo"
                            width={100}
                            height={100}
                        />
                        <Link
                            to={"/settings"}
                            className="flex items-center text-secondary-400 dark:text-secondary-900 hover:underline"
                        >
                            <FaCog className="mr-2" /> Settings
                        </Link>
                    </div>
                </div>
            </aside>
            <div className="container w-full md:max-w-3xl mx-auto px-10 py-20">
                <Outlet />
            </div>
        </>
    );
}
