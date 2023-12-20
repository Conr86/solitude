import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "@/routes/home.tsx";
import New from "@/routes/new.tsx";
import {
    Route,
    Router,
    RouterContext,
    RouterProvider,
} from "@tanstack/react-router";
import "@fontsource/libre-baskerville";
import "@fontsource/libre-baskerville/700.css";
import Layout from "@/routes/layout.tsx";
import { ThemeProvider } from "@/helpers/useTheme.ts";
import RxProvider from "@/components/RxProvider.tsx";
import Page from "@/routes/page.tsx";

export const rootRoute = new RouterContext().createRootRoute({
    component: Layout,
});
export const homeRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/",
    component: Home,
});
export const newRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "new",
    component: New,
});
export const pageRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "page/$pageId",
    component: Page,
});

const routeTree = rootRoute.addChildren([homeRoute, newRoute, pageRoute]);

declare module "@tanstack/react-router" {
    interface Register {
        // This infers the type of our router and registers it across your entire project
        router: typeof router;
    }
}

const router = new Router({ routeTree });

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider>
            <RxProvider>
                <RouterProvider router={router} />
            </RxProvider>
        </ThemeProvider>
    </React.StrictMode>,
);
