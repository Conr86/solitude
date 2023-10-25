import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useEffect } from "react";

export type ThemeType = "system" | "light" | "dark";
const themeAtom = atomWithStorage<ThemeType>("activeTheme", "system");

export function useTheme(): {
    activeTheme: ThemeType;
    setActiveTheme: (theme: ThemeType) => void;
} {
    const [activeTheme, setActiveTheme] = useAtom(themeAtom);

    useEffect(() => {
        const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
        const listener = (e: MediaQueryListEvent) => {
            if (activeTheme === "system") {
                if (e.matches) {
                    document.querySelector("html")?.classList?.add?.("dark");
                } else {
                    document.querySelector("html")?.classList?.remove?.("dark");
                }
            }
        };
        matchMedia.addEventListener("change", listener);

        const isDark =
            activeTheme === "dark" ||
            (activeTheme === "system" && matchMedia.matches);
        if (isDark) {
            document.querySelector("html")?.classList?.add?.("dark");
        } else {
            document.querySelector("html")?.classList?.remove?.("dark");
        }
        return () => matchMedia.removeEventListener("change", listener);
    }, [activeTheme]);

    return { activeTheme, setActiveTheme };
}
