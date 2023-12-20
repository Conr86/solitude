import { ComponentPropsWithoutRef, type ReactNode } from "react";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
    color?: string;
    children: ReactNode;
    onClick?: () => void;
}

export function Button({
    color = "bg-primary-100 hover:bg-primary-400 dark:bg-transparent dark:hover:bg-primary-900 dark:ring-primary-800 dark:ring-1 dark:hover:ring-primary-900 dark:text-white",
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`${color} flex items-center px-3 py-1.5 font-medium tracking-wide capitalize transition-colors duration-300 transform rounded-xl focus:outline-none focus:ring focus:ring-opacity-80 `}
            {...props}
        >
            {children}
        </button>
    );
}
