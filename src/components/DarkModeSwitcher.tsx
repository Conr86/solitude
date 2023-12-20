import { Menu } from "@headlessui/react";
import classNames from "classnames";
import { FaDesktop, FaRegMoon, FaSun } from "react-icons/fa";
import { useTheme } from "@/lib/useTheme.ts";

export default function DarkModeSwitcher() {
    const { activeTheme, setActiveTheme } = useTheme();
    return (
        <div className={`flex w-full`} role="group">
            {[
                ["system", FaDesktop],
                ["dark", FaRegMoon],
                ["light", FaSun],
            ].map(([mode, Icon]) => (
                <Menu.Item key={mode}>
                    {({ active }) => (
                        <button
                            type="button"
                            onClick={() => setActiveTheme(mode)}
                            className={classNames(
                                `flex justify-center grow p-3 first:rounded-tl-md last:rounded-tr-md text-secondary-800`,
                                {
                                    "bg-secondary-100": active,
                                    "bg-primary-200 text-primary-800":
                                        activeTheme === mode,
                                },
                            )}
                        >
                            <Icon />
                        </button>
                    )}
                </Menu.Item>
            ))}
        </div>
    );
}
