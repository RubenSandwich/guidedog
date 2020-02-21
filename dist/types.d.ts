export declare enum GuideDogFilter {
    Headers = "Headers",
    Links = "Links"
}
export interface IGuideDogOptions {
    filterType?: GuideDogFilter;
    sourceCodeLoc?: boolean;
}
export declare type TreeIndexPath = number[];
export declare type FilterTypeMapReturn = {
    newNode?: AccessibleNode;
    insertPath?: TreeIndexPath;
};
export declare type FilterTypeMap = {
    [f in keyof typeof GuideDogFilter]: () => FilterTypeMapReturn;
};
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
export {};
