import { NodeViewWrapper } from '@tiptap/react'
import Link from 'next/link'
import useSWR from 'swr'
import { apiBaseUrl } from '@/helpers/apiSettings'
import { type Page } from '@prisma/client'
import { MentionOptions } from '@tiptap/extension-mention'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'

const MentionLink = (props: { options: MentionOptions; node: ProseMirrorNode }) => {
  const { data } = useSWR<Page[]>(`${apiBaseUrl}/page`);
  return (
    <NodeViewWrapper className="mention inline">
        <Link href={`/${props.node.attrs.url}`} className="text-primary-400 no-underline hover:text-primary-500">
          {/* Try get the current name of the page but fall back on the one stored in DB while loading */}
          {data ? data.find(p => p.id == props.node.attrs.url)?.title ?? props.node.attrs.name : props.node.attrs.name}
        </Link>
    </NodeViewWrapper>
  )
}
export default MentionLink