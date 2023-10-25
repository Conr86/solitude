import { Menu } from "@headlessui/react";
import classNames from "classnames";
import { FaDesktop, FaRegMoon, FaSun } from "react-icons/fa";
import { useTheme } from "@/helpers/useTheme.ts";

export default function DarkModeSwitcher() {
    const { activeTheme, setActiveTheme } = useTheme();
    return (
        <div className={`flex w-full`} role="group">
            {[
                ["system", FaDesktop],
                ["dark", FaRegMoon],
                ["light", FaSun],
            ].map(([mode, Icon]) => (
                <Menu.Item>
                    {({ active }) => (
                        <button
                            type="button"
                            onClick={() => setActiveTheme(mode)}
                            className={classNames(
                                `flex justify-center grow px-2 py-3 first:rounded-l-md last:rounded-r-md`,
                                {
                                    "bg-secondary-100": active,
                                    "bg-primary-100": activeTheme === mode,
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
