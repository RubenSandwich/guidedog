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
  AccessibleNodeWithSource,
} from './types';

export const guideDog = (
  html: string,
  options?: IGuideDogOptions,
): AccessibleNodes => {
  const defaults: IGuideDogOptions = {
    filterType: GuideDogFilter.Headers,
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
    [GuideDogFilter.Headers]: () => {
      if (!isHeading(node.tagName)) {
        return;
      }

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
    },
    [GuideDogFilter.Links]: () => {
      if (!isLink(node.tagName)) {
        return;
      }

      if (htmlAttributesToObject(node.attrs)?.href == null) {
        return;
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
    },
  });

  if (newNode) {
    return upsertNode(accessibleNodes, newNode, insertPath);
  }

  let newAccessibleNodes = accessibleNodes;

  node.childNodes.forEach(childNode => {
    newAccessibleNodes = parseIntoAccessibleNodes(
      childNode as DefaultTreeElement,
      options,
      newAccessibleNodes,
    );
  });

  return newAccessibleNodes;
};
