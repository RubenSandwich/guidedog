import { DefaultTreeElement, Attribute } from 'parse5';

import {
  AccessibleNodes,
  AccessibleNode,
  TreeIndexPath,
  GuideDogFilter,
  FilterTypeMap,
  FilterTypeMapReturn,
} from './types';

export const isHeading = (nodeTagName: string): boolean => {
  return /^h[1-6]/.test(nodeTagName);
};

export const isLink = (nodeTagName: string): boolean => {
  return nodeTagName === 'a';
};

export const getFirstChild = (node: DefaultTreeElement) => {
  return node.childNodes[0];
};

export const filterTypeMap = (
  filter: GuideDogFilter,
  filterTypeMap: FilterTypeMap,
): FilterTypeMapReturn => {
  switch (filter) {
    case GuideDogFilter.Headers:
      return filterTypeMap[GuideDogFilter.Headers]() ?? {};
    case GuideDogFilter.Links:
      return filterTypeMap[GuideDogFilter.Links]() ?? {};
    default:
      const _exhaustiveCheck: never = filter;
  }
};

export const htmlAttributesToObject = (attrs: Attribute[]) => {
  return attrs.reduce((obj, attr) => {
    obj[attr.name] = attr.value;

    return obj;
  }, {} as { [key: string]: any });
};

export const getHeadingLevel = (nodeTagName: string): number => {
  return parseInt(nodeTagName.match(/[1-6]/)[0], 10);
};

export const getHeaderInsertPath = (
  accessibleNodes: AccessibleNodes,
  insertHeaderLevel: number,
): TreeIndexPath => {
  if (accessibleNodes.length === 0) {
    return [0];
  }

  const lastNodeIndex = accessibleNodes.length - 1;
  const lastNode = accessibleNodes[accessibleNodes.length - 1];

  if (lastNode.level >= insertHeaderLevel) {
    return [lastNodeIndex + 1];
  } else if (lastNode.children == null) {
    return [lastNodeIndex, 0];
  }

  return [
    lastNodeIndex,
    ...getHeaderInsertPath(lastNode.children, insertHeaderLevel),
  ];
};

export const getNextTopLevelInsertPath = (
  accessibleNodes: AccessibleNodes,
): TreeIndexPath => {
  return [accessibleNodes.length];
};

export const upsertNode = (
  accessibleNodes: AccessibleNodes,
  node: AccessibleNode,
  indexPath: TreeIndexPath,
): AccessibleNodes => {
  if (accessibleNodes.length == 0) {
    return [node];
  }

  const insertIndex = indexPath[0];

  if (indexPath.length === 1) {
    return [
      ...accessibleNodes.slice(0, insertIndex),
      node,
      ...accessibleNodes.slice(insertIndex),
    ];
  }

  const currentNode = accessibleNodes[insertIndex];

  return [
    ...accessibleNodes.slice(0, insertIndex),
    {
      ...currentNode,
      children: upsertNode(
        currentNode.children || [],
        node,
        indexPath.slice(1),
      ),
    },
    ...accessibleNodes.slice(insertIndex + 1),
  ];
};
