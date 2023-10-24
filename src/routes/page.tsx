import { useQuery } from "@tanstack/react-query";
import Editor from "@/components/Editor.tsx";
import { pageRoute } from "@/main.tsx";
import { Helmet } from "react-helmet";
import ErrorPage from "@/components/Error.tsx";
import { Page } from "prisma/prisma-client";

const Page: (typeof pageRoute)["options"]["component"] = ({
    useRouteContext,
}) => {
    const { queryOptions } = useRouteContext();
    const { data, isError, error } = useQuery<Page, Error>(queryOptions);

    if (isError || !data) return <ErrorPage error={error?.message} />;

    return (
        <>
            <Helmet>
                <title>{data?.title ?? "Page not found"} - Solitude</title>
            </Helmet>
            <Editor {...data} />
        </>
    );
};

export default Page;
