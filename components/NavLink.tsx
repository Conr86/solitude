import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export const NavLink = ({ href, Icon, label }: any) => {
  const { asPath } = useRouter();
  return (
    <Link href={`/${href}`} className={`${asPath === `/${href}` 
        ? "text-gray-900 bg-green-100 dark:text-white dark:bg-green-800" 
        : "text-gray-900            hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"} 
        flex items-center p-2 transition duration-75 rounded-lg group `}>
      <Icon className={`${asPath === `/${href}` 
        ? "dark:text-green-100" 
        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white"} 
        w-6 transition duration-75 `} />
      <span className="ml-3">{label}</span>
    </Link>
  );
};