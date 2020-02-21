import { DefaultTreeElement, Attribute } from 'parse5';
import { AccessibleNodes, AccessibleNode, TreeIndexPath, GuideDogFilter, FilterTypeMap, FilterTypeMapReturn } from './types';
export declare const isHeading: (nodeTagName: string) => boolean;
export declare const isLink: (nodeTagName: string) => boolean;
export declare const getFirstChild: (node: DefaultTreeElement) => import("parse5").DefaultTreeNode;
export declare const filterTypeMap: (filter: GuideDogFilter, filterTypeMap: FilterTypeMap) => FilterTypeMapReturn;
export declare const htmlAttributesToObject: (attrs: Attribute[]) => {
    [key: string]: any;
};
export declare const getHeadingLevel: (nodeTagName: string) => number;
export declare const getHeaderInsertPath: (accessibleNodes: AccessibleNodes, insertHeaderLevel: number) => TreeIndexPath;
export declare const getNextTopLevelInsertPath: (accessibleNodes: AccessibleNodes) => TreeIndexPath;
export declare const upsertNode: (accessibleNodes: AccessibleNodes, node: AccessibleNode, indexPath: TreeIndexPath) => AccessibleNodes;
