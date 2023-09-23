import { useQuery } from "@tanstack/react-query";
import Editor from "@/components/Editor.tsx";
import { pageRoute } from "@/main.tsx";

const Page: (typeof pageRoute)["options"]["component"] = ({
    useRouteContext,
}) => {
    const { queryOptions } = useRouteContext();
    const pageQuery = useQuery(queryOptions);

    return (
        <>
            <Editor {...pageQuery.data} />
        </>
    );
};

export default Page;
