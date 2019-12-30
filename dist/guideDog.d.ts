interface IGuideDogOptions {
    filterType: GuideDogFilter;
}
export declare enum GuideDogFilter {
    Headers = 0
}
export declare const guideDog: (html: string, options?: IGuideDogOptions) => AccessibleNode[];
export declare const getHeaderInsertIndex: (accessibleNodes: AccessibleNode[], insertHeaderLevel: number) => number[];
export declare const upsertNode: (accessibleNodes: AccessibleNode[], node: AccessibleNode, indexPath: number[]) => AccessibleNode[];
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
}
export {};
