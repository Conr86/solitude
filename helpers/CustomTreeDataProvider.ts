import {
  Disposable,
  ExplicitDataSource,
  TreeDataProvider,
  TreeItem,
  TreeItemIndex,
} from 'react-complex-tree/src/types';
export interface EventEmitterOptions<EventPayload = any> {
  logger?: (log: string, payload?: EventPayload) => void;
}

export type EventHandler<EventPayload> =
  | ((payload: EventPayload) => Promise<void> | void)
  | null
  | undefined;

export class EventEmitter<EventPayload> {
  private handlerCount = 0;

  private handlers: Array<EventHandler<EventPayload>> = [];

  private options?: EventEmitterOptions<EventPayload>;

  constructor(options?: EventEmitterOptions<EventPayload>) {
    this.options = options;
  }

  public get numberOfHandlers() {
    return this.handlers.filter(h => !!h).length;
  }

  public async emit(payload: EventPayload): Promise<void> {
    const promises: Array<Promise<void>> = [];

    this.options?.logger?.('emit', payload);

    for (const handler of this.handlers) {
      if (handler) {
        const res = handler(payload) as Promise<void>;
        if (typeof res?.then === 'function') {
          promises.push(res);
        }
      }
    }

    await Promise.all(promises);
  }

  public on(handler: EventHandler<EventPayload>): number {
    this.options?.logger?.('on');
    this.handlers.push(handler);
    // eslint-disable-next-line no-plusplus
    return this.handlerCount++;
  }

  public off(handlerId: number) {
    this.delete(handlerId);
  }

  public delete(handlerId: number) {
    this.options?.logger?.('off');
    this.handlers[handlerId] = null;
  }
}


export class CustomTreeDataProvider<T = any> implements TreeDataProvider {
  private data: ExplicitDataSource;

  private onDidChangeTreeDataEmitter = new EventEmitter<TreeItemIndex[]>();

  private setItemName?: (item: TreeItem<T>, newName: string) => TreeItem<T>;

  constructor(
    items: Record<TreeItemIndex, TreeItem<T>>,
    setItemName?: (item: TreeItem<T>, newName: string) => TreeItem<T>
    // private implicitItemOrdering?: (itemA: TreeItem<T>, itemB: TreeItem<T>) => number,
  ) {
    this.data = { items };
    this.setItemName = setItemName;
  }

  public async getTreeItem(itemId: TreeItemIndex): Promise<TreeItem> {
    return this.data.items[itemId];
  }

  public async onChangeItemChildren(
    itemId: TreeItemIndex,
    newChildren: TreeItemIndex[]
  ): Promise<void> {
    this.data.items[itemId].children = newChildren;
    this.onDidChangeTreeDataEmitter.emit([itemId]);
  }

  public onDidChangeTreeData(
    listener: (changedItemIds: TreeItemIndex[]) => void
  ): Disposable {
    const handlerId = this.onDidChangeTreeDataEmitter.on(payload =>
      listener(payload)
    );
    return { dispose: () => this.onDidChangeTreeDataEmitter.off(handlerId) };
  }

  public update(itemId: TreeItemIndex) {
    this.onDidChangeTreeDataEmitter.emit(['root', itemId]);
  }

  public async onRenameItem(item: TreeItem<any>, name: string): Promise<void> {
    if (this.setItemName) {
      this.data.items[item.index] = this.setItemName(item, name);
      // this.onDidChangeTreeDataEmitter.emit(item.index);
    }
  }
}