import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Layout from "./routes/layout.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Index from "@/routes";
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
import { pageByIdQuery, pageListQuery } from "@/helpers/api.ts";

const queryClient = new QueryClient();

const routerContext = new RouterContext<{
    queryClient: typeof queryClient;
}>();

const rootRoute = routerContext.createRootRoute({
    component: Layout,
    // beforeLoad: () => {
    //     return { queryOptions: pageListQuery() };
    // },
    // loader: async ({
    //     context: { queryClient },
    //     routeContext: { queryOptions },
    // }) => {
    //     await queryClient.ensureQueryData(queryOptions);
    // },
});
export const indexRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/",
    component: Index,
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
    loader: async ({
        context: { queryClient },
        routeContext: { queryOptions },
    }) => {
        await queryClient.ensureQueryData({
            queryKey: queryOptions.queryKey,
            queryFn: queryOptions.queryFn,
        });
    },
}).update({
    component: lazyRouteComponent(() => import("./routes/page")),
});

const routeTree = rootRoute.addChildren([indexRoute, newRoute, pageRoute]);

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
