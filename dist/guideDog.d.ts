import { AXNode } from 'puppeteer';
import { ReactElement } from 'react';
export declare const guideDog: (reactComp: ReactElement<any, string | ((props: any) => ReactElement<any, string | any | (new (props: any) => import("react").Component<any, any, any>)>) | (new (props: any) => import("react").Component<any, any, any>)>) => Promise<AXNode[]>;
