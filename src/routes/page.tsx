import { useQuery } from "@tanstack/react-query";
import Editor from "@/components/Editor.tsx";
import { pageRoute } from "@/main.tsx";
import { Helmet } from "react-helmet";
import ErrorPage from "@/components/Error.tsx";
import { Page } from "prisma/prisma-client";
import { LoadingBox } from "@/components/LoadingBox.tsx";

const Page: (typeof pageRoute)["options"]["component"] = ({
    useRouteContext,
}) => {
    const { queryOptions } = useRouteContext();
    const { data, isError, error } = useQuery<Page, Error>(queryOptions);

    if (isError) return <ErrorPage message={error?.message} />;

    if (!data) return <LoadingBox />;

    return (
        <>
            <Helmet>
                <title>{data.title} - Solitude</title>
            </Helmet>
            <Editor {...data} />
        </>
    );
};

export default Page;
