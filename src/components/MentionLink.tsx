import { NodeViewWrapper } from "@tiptap/react";
import { MentionOptions } from "@tiptap/extension-mention";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { pageListQuery } from "@/helpers/api.ts";

const MentionLink = (props: {
    options: MentionOptions;
    node: ProseMirrorNode;
}) => {
    const { data } = useQuery(pageListQuery());

    return (
        <NodeViewWrapper className="mention inline">
            <Link
                to={"/page/$pageId"}
                params={{ pageId: props.node.attrs.url }}
                className="text-primary-400 no-underline hover:text-primary-500"
            >
                {/* Try to get the current name of the page but fall back on the one stored in DB while loading */}
                {data
                    ? data.find((p) => p.id == props.node.attrs.url)?.title ??
                      props.node.attrs.name
                    : props.node.attrs.name}
            </Link>
        </NodeViewWrapper>
    );
};
export default MentionLink;
