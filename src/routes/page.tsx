import { useQuery } from "@tanstack/react-query";
import Editor from "@/components/Editor.tsx";
import { pageRoute } from "@/main.tsx";
import { Helmet } from "react-helmet";

const Page: (typeof pageRoute)["options"]["component"] = ({
    useRouteContext,
}) => {
    const { queryOptions } = useRouteContext();
    const pageQuery = useQuery(queryOptions);

    return (
        <>
            <Helmet>
                <title>
                    {pageQuery.data?.title ?? "Page not found"} - Solitude
                </title>
            </Helmet>
            <Editor {...pageQuery.data} />
        </>
    );
};

export default Page;
