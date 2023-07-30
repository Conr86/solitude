import { Node as ProsemirrorNode } from '@tiptap/pm/model'

export interface Result {
  from: number
  to: number
  className: string
}

export default class DecoratorPlugin {
  protected doc

  private results: Array<Result> = []

  constructor(doc: ProsemirrorNode) {
    this.doc = doc
  }

  record(from: number, to: number, className: string) {
    this.results.push({
      from,
      to,
      className,
    })
  }

  scan() {
    return this
  }

  getResults() {
    return this.results
  }
}