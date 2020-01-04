interface IGuideDogOptions {
    filterType?: GuideDogFilter;
    sourceCodeLoc?: boolean;
}
export declare enum GuideDogFilter {
    Headers = 0
}
declare type AccessibleNodeWithSource = AccessibleNode & {
    sourceCodeLoc: Location;
};
declare type AccessibleNodes = AccessibleNode[] | AccessibleNodeWithSource[];
export declare const guideDog: (html: string, options?: IGuideDogOptions) => AccessibleNodes;
export declare const getHeaderInsertIndex: (accessibleNodes: AccessibleNodes, insertHeaderLevel: number) => number[];
export declare const upsertNode: (accessibleNodes: AccessibleNodes, node: AccessibleNode, indexPath: number[]) => AccessibleNodes;
interface SourceLocation {
    startOffset: number;
    endOffset: number;
}
interface AccessibleNode {
    role: string;
    name: string;
    focusable: boolean;
    level?: number;
    parent?: AccessibleNode;
    children?: AccessibleNode[];
    firstChild?: AccessibleNode;
    lastChild?: AccessibleNode;
    previousSibling?: AccessibleNode;
    nextSibling?: AccessibleNode;
    sourceCodeLoc?: SourceLocation;
}
export {};
