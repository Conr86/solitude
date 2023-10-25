import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Home from "@/routes/home.tsx";
import New from "@/routes/new.tsx";
import {
    lazyRouteComponent,
    Route,
    Router,
    RouterContext,
    RouterProvider,
} from "@tanstack/react-router";
import "@fontsource/libre-baskerville";
import "@fontsource/libre-baskerville/700.css";
import Layout from "@/routes/layout.tsx";
import { pageByIdQuery } from "@/helpers/api.ts";

const queryClient = new QueryClient();
const routerContext = new RouterContext<{
    queryClient: typeof queryClient;
}>();

export const rootRoute = routerContext.createRootRoute({
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
    beforeLoad: ({ params: { pageId } }) => {
        return { queryOptions: pageByIdQuery(pageId) };
    },
}).update({
    component: lazyRouteComponent(() => import("./routes/page")),
});

const routeTree = rootRoute.addChildren([homeRoute, newRoute, pageRoute]);

declare module "@tanstack/react-router" {
    interface Register {
        // This infers the type of our router and registers it across your entire project
        router: typeof router;
    }
}

const router = new Router({
    routeTree,
    context: {
        queryClient,
    },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools position="bottom-right" />
        </QueryClientProvider>
    </React.StrictMode>,
);
