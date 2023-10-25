import Editor from "@/components/Editor.tsx";
import { Helmet } from "react-helmet";

export default function NewPage() {
    return (
        <>
            <Helmet>
                <title>New Page - Solitude</title>
            </Helmet>
            <Editor title={"New Page"} content={""} />
        </>
    );
}
