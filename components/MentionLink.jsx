import { NodeViewWrapper } from '@tiptap/react'
import Link from 'next/link'
import React from 'react'

export default props => {
  const increase = () => {
    props.updateAttributes({
      count: props.node.attrs.count + 1,
    })
  }

  console.log(props.node.attrs);

  return (
    <NodeViewWrapper className="react-component inline">
        <Link href={`/${props.node.attrs.url}`} className="text-green-400 no-underline">
          {props.node.attrs.name} 
        </Link>
    </NodeViewWrapper>
  )
}