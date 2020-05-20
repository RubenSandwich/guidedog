export enum GuideDogFilter {
  Headers = 'Headers',
  Links = 'Links',
  None = 'None',
}

export interface IGuideDogOptions {
  filterType?: GuideDogFilter;
  sourceCodeLoc?: boolean;
}

export type TreeIndexPath = number[];

export type PossibleNewNode = {
  newNode?: AccessibleNode;
  insertPath?: TreeIndexPath;
};

export type FilterTypeMap = {
  [f in keyof typeof GuideDogFilter]: () => PossibleNewNode;
};

interface SourceLocation {
  startOffset: number;
  endOffset: number;
}

export interface AccessibleNode {
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

export type AccessibleNodeWithSource = AccessibleNode & {
  sourceCodeLoc: SourceLocation;
};

export type AccessibleNodes = AccessibleNode[] | AccessibleNodeWithSource[];
