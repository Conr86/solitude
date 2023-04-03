import { NodeViewWrapper } from '@tiptap/react'
import Link from 'next/link'
import React from 'react'

export default props => {
  return (
    <NodeViewWrapper className="mention-component inline">
        <Link href={`/${props.node.attrs.url}`} className="text-primary-400 no-underline hover:text-primary-500">
          {props.node.attrs.name} 
        </Link>
    </NodeViewWrapper>
  )
}