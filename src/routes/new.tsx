import Editor from "@/components/Editor.tsx";
import { Helmet } from "react-helmet";
import { useMemo } from "react";
import cuid from "cuid";

export default function NewPage() {
    const newId = useMemo(() => cuid(), []);
    return (
        <>
            <Helmet>
                <title>New Page - Solitude</title>
            </Helmet>
            <Editor pageId={newId} isNewPage={true} />
        </>
    );
}
