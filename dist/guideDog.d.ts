import { AXNode } from 'puppeteer';
import { ReactElement } from 'react';
interface IGuideDogOptions {
    filterType: GuideDogFilter;
}
export declare enum GuideDogFilter {
    None = 0,
    OnlyInteresting = 1,
    OnlyLandmarks = 2,
    OnlyTabableElements = 3
}
export declare const guideDog: (reactComp: ReactElement<any, string | ((props: any) => ReactElement<any, string | any | (new (props: any) => import("react").Component<any, any, any>)>) | (new (props: any) => import("react").Component<any, any, any>)>, options?: IGuideDogOptions) => Promise<AXNode[]>;
export {};
