import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ReactNode, useEffect } from "react";

export type ThemeType = "system" | "light" | "dark";
const themeAtom = atomWithStorage<ThemeType>("activeTheme", "system");

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [activeTheme] = useAtom(themeAtom);

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

    return children;
}

export function useTheme(): {
    activeTheme: ThemeType;
    setActiveTheme: (theme: ThemeType) => void;
    resolvedTheme: () => "light" | "dark";
} {
    const [activeTheme, setActiveTheme] = useAtom(themeAtom);
    const resolvedTheme = () =>
        document.querySelector("html")?.classList?.contains("dark")
            ? "dark"
            : "light";
    return { activeTheme, setActiveTheme, resolvedTheme };
}
