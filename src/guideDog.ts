import { parseFragment, DefaultTreeElement, DefaultTreeTextNode } from 'parse5';

interface IGuideDogOptions {
  filterType: GuideDogFilter;
}

export enum GuideDogFilter {
  Headers,
}

export const guideDog = (
  html: string,
  options: IGuideDogOptions = {
    filterType: GuideDogFilter.Headers,
  },
): AccessibleNode[] => {
  const document = parseFragment(html, {
    // sourceCodeLocationInfo: true
  }) as DefaultTreeElement;

  return parseIntoAccessibleNodes(document, options.filterType);

  // return tree;
};

const getFirstChild = (node: DefaultTreeElement) => {
  return node.childNodes[0];
};

const parseIntoAccessibleNodes = (
  node: DefaultTreeElement,
  filterType: GuideDogFilter,
  accessibleNodes: AccessibleNode[] = [],
) => {
  if (!node.childNodes) {
    return accessibleNodes;
  }

  if (isHeading(node.tagName)) {
    const level = getHeadingLevel(node.tagName);
    const textNode = getFirstChild(node) as DefaultTreeTextNode;
    const insertIndex = getHeaderInsertIndex(accessibleNodes, level);

    const newNode = {
      role: 'heading',
      name: textNode.value,
      level,
      focusable: false,
    };

    return upsertNode(accessibleNodes, newNode, insertIndex);
  }

  let newAccessibleNodes = accessibleNodes;

  node.childNodes.forEach(childNode => {
    newAccessibleNodes = parseIntoAccessibleNodes(
      childNode as DefaultTreeElement,
      filterType,
      newAccessibleNodes,
    );
  });

  return newAccessibleNodes;
};

const isHeading = (nodeTagName: string): boolean => {
  return /^h[1-6]/.test(nodeTagName);
};

const getHeadingLevel = (nodeTagName: string): number => {
  return parseInt(nodeTagName.match(/[1-6]/)[0], 10);
};

export const getHeaderInsertIndex = (
  accessibleNodes: AccessibleNode[],
  insertHeaderLevel: number,
): number[] => {
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
    ...getHeaderInsertIndex(lastNode.children, insertHeaderLevel),
  ];
};

export const upsertNode = (
  accessibleNodes: AccessibleNode[],
  node: AccessibleNode,
  indexPath: number[],
): AccessibleNode[] => {
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

interface AccessibleNode {
  role: string;
  name: string;

  // Only affects accessible focus
  focusable: boolean;
  level?: number;

  // Tree walking
  parent?: AccessibleNode;
  children?: AccessibleNode[];

  // Maybe?
  firstChild?: AccessibleNode;
  lastChild?: AccessibleNode;
  previousSibling?: AccessibleNode;
  nextSibling?: AccessibleNode;
}
