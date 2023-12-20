import Editor from "@/components/Editor.tsx";
import { pageRoute } from "@/main.tsx";
import { Helmet } from "react-helmet";
import ErrorPage from "@/components/Error.tsx";
import { LoadingBox } from "@/components/LoadingBox.tsx";
import { usePage } from "@/lib/db/databaseHooks.ts";

const Page = () => {
    const { pageId } = pageRoute.useParams();
    const { page, isFetching } = usePage(pageId);

    if (isFetching) return <LoadingBox />;

    if (!page) return <ErrorPage message={"Not found"} />;

    return (
        <>
            <Helmet>
                <title>{page.title} - Solitude</title>
            </Helmet>
            <Editor pageId={pageId} />
        </>
    );
};

export default Page;
