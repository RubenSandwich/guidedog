interface IGuideDogOptions {
    filterType?: GuideDogFilter;
    sourceCodeLoc?: boolean;
}
export declare enum GuideDogFilter {
    Headers = 0
}
interface SourceLocation {
    startOffset: number;
    endOffset: number;
}
export interface AccessibleNode {
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
}
export declare type AccessibleNodeWithSource = AccessibleNode & {
    sourceCodeLoc: SourceLocation;
};
export declare type AccessibleNodes = AccessibleNode[] | AccessibleNodeWithSource[];
export declare const guideDog: (html: string, options?: IGuideDogOptions) => AccessibleNodes;
export declare const getHeaderInsertIndex: (accessibleNodes: AccessibleNodes, insertHeaderLevel: number) => number[];
export declare const upsertNode: (accessibleNodes: AccessibleNodes, node: AccessibleNode, indexPath: number[]) => AccessibleNodes;
export {};
