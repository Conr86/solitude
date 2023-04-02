import { StaticTreeDataProvider, Tree, UncontrolledTreeEnvironment } from "react-complex-tree";
import { TreeRenderProps } from 'react-complex-tree';
import { longTree } from "../helpers/TreeItems";

const renderers: TreeRenderProps = {
    renderTreeContainer: props => (
      <div className={""}>
        <ul
          className={"space-y-2 font-medium"}
          {...props.containerProps}
        >
          {props.children}
        </ul>
      </div>
    ),
  
    renderItemsContainer: props => (
      <ul className={"flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"} {...props.containerProps}>
        {props.children}
      </ul>
    ),
  
    renderItem: props => (
      <li
        className={""}
        {...(props.context.itemContainerWithChildrenProps as any)}
      >
        <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
               <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
               <span className="flex-1 ml-3 whitespace-nowrap">{props.title}</span>
            </a>
      </li>
    ),
  
    renderItemArrow: props => (
      <div
        icon="chevron-right"
        className={""}
        {...(props.context.arrowProps as any)}
      />
    ),
  
    renderItemTitle: ({ title, context, info }) => {
      if (!info.isSearching || !context.isSearchMatching) {
        return <span className={""}>{title}</span>;
      }
      const startIndex = title.toLowerCase().indexOf(info.search!.toLowerCase());
      return (
        <>
          {startIndex > 0 && <span>{title.slice(0, startIndex)}</span>}
          <span className="rct-tree-item-search-highlight">
            {title.slice(startIndex, startIndex + info.search!.length)}
          </span>
          {startIndex + info.search!.length < title.length && (
            <span>
              {title.slice(startIndex + info.search!.length, title.length)}
            </span>
          )}
        </>
      );
    },
  
    renderDragBetweenLine: ({ draggingPosition, lineProps }) => (
      <div
        {...lineProps}
        style={{
          position: 'absolute',
          right: '0',
          top:
            draggingPosition.targetType === 'between-items' &&
            draggingPosition.linePosition === 'top'
              ? '0px'
              : draggingPosition.targetType === 'between-items' &&
                draggingPosition.linePosition === 'bottom'
              ? '-4px'
              : '-2px',
          left: `${draggingPosition.depth * 23}px`,
          height: '4px',
        }}
      />
    ),
  
    
    renderDepthOffset: 1,
  };

export default function () {
    return (
        <UncontrolledTreeEnvironment
            dataProvider={new StaticTreeDataProvider(longTree.items, (item, data) => ({ ...item, data }))}
            getItemTitle={item => item.data}
            renderItem={renderers.renderItem}
            renderTreeContainer={renderers.renderTreeContainer}

            viewState={{}}
        >
            <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
        </UncontrolledTreeEnvironment>
    )
}