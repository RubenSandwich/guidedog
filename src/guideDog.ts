import { parseFragment, DefaultTreeElement, DefaultTreeTextNode } from 'parse5';

import {
  filterTypeMap,
  getFirstChild,
  upsertNode,
  isLink,
  isHeading,
  getHeaderInsertPath,
  getHeadingLevel,
  htmlAttributesToObject,
  getNextTopLevelInsertPath,
} from './utilities';

import {
  IGuideDogOptions,
  AccessibleNode,
  AccessibleNodes,
  GuideDogFilter,
  PossibleNewNode,
  AccessibleNodeWithSource,
} from './types';

export const guideDog = (
  html: string,
  options?: IGuideDogOptions,
): AccessibleNodes => {
  const defaults: IGuideDogOptions = {
    filterType: GuideDogFilter.None,
    sourceCodeLoc: false,
  };

  const optionsWithDefaults = { ...defaults, ...options };

  const document = parseFragment(html, {
    sourceCodeLocationInfo: optionsWithDefaults.sourceCodeLoc,
  }) as DefaultTreeElement;

  const tree = parseIntoAccessibleNodes(document, optionsWithDefaults);

  return tree;

  // TODO: How do I get the type limited here?
  // return optionsWithDefaults.sourceCodeLoc
  //   ? (tree as AccessibleNodeWithSource[])
  //   : (tree as AccessibleNode[]);
};

const parseIntoAccessibleNodes = (
  node: DefaultTreeElement,
  options: IGuideDogOptions,
  accessibleNodes: AccessibleNodes = [],
) => {
  const { filterType, sourceCodeLoc } = options;

  if (!node.childNodes) {
    return accessibleNodes;
  }

  const { newNode, insertPath } = filterTypeMap(filterType, {
    [GuideDogFilter.None]: () => {
      if (isLink(node.tagName)) {
        return parseLinkNode(node, accessibleNodes, sourceCodeLoc);
      } else if (isHeading(node.tagName)) {
        return parseHeaderNode(node, accessibleNodes, sourceCodeLoc);
      }

      return {};
    },
    [GuideDogFilter.Headers]: () => {
      if (!isHeading(node.tagName)) {
        return {};
      }

      return parseHeaderNode(node, accessibleNodes, sourceCodeLoc);
    },
    [GuideDogFilter.Links]: () => {
      if (!isLink(node.tagName)) {
        return {};
      }

      return parseLinkNode(node, accessibleNodes, sourceCodeLoc);
    },
  });

  if (newNode) {
    return upsertNode(accessibleNodes, newNode, insertPath);
  }

  let newAccessibleNodes = accessibleNodes;

  node.childNodes.forEach((childNode) => {
    newAccessibleNodes = parseIntoAccessibleNodes(
      childNode as DefaultTreeElement,
      options,
      newAccessibleNodes,
    );
  });

  return newAccessibleNodes;
};

const parseLinkNode = (
  node: DefaultTreeElement,
  accessibleNodes: AccessibleNodes = [],
  sourceCodeLoc: boolean,
): PossibleNewNode => {
  // Filter out empty links
  if (htmlAttributesToObject(node.attrs)?.href == null) {
    return {};
  }

  const textNode = getFirstChild(node) as DefaultTreeTextNode;
  const insertPath = getNextTopLevelInsertPath(accessibleNodes);

  const newNode: AccessibleNode = {
    role: 'link',
    name: textNode.value,
    focusable: true,
  };

  if (sourceCodeLoc) {
    (newNode as AccessibleNodeWithSource).sourceCodeLoc = {
      startOffset: node.sourceCodeLocation.startOffset,
      endOffset: node.sourceCodeLocation.endOffset,
    };
  }

  return { newNode, insertPath };
};

const parseHeaderNode = (
  node: DefaultTreeElement,
  accessibleNodes: AccessibleNodes = [],
  sourceCodeLoc: boolean,
): PossibleNewNode => {
  const level = getHeadingLevel(node.tagName);
  const textNode = getFirstChild(node) as DefaultTreeTextNode;
  const insertPath = getHeaderInsertPath(accessibleNodes, level);

  const newNode: AccessibleNode = {
    role: 'heading',
    name: textNode.value,
    level,
    focusable: false,
  };

  if (sourceCodeLoc) {
    (newNode as AccessibleNodeWithSource).sourceCodeLoc = {
      startOffset: node.sourceCodeLocation.startOffset,
      endOffset: node.sourceCodeLocation.endOffset,
    };
  }

  return { newNode, insertPath };
};
