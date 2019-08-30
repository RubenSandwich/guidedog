
// @ts-ignore 1192 - No default export
import puppeteer, { AXNode, Browser, Page } from 'puppeteer';
import * as ReactDOMServer from 'react-dom/server';
import { ReactElement } from 'react';

interface IGuideDogOptions {
  filterType: GuideDogFilter;
}

export enum GuideDogFilter {
  None,
  OnlyInteresting,
  OnlyLandmarks,
  OnlyTabableElements,
}

const guideDogFilterToPuppeteerFilter = (gdFilter: GuideDogFilter): string => {
  switch (gdFilter) {
    case GuideDogFilter.None: {
      return 'none';
    }
    case GuideDogFilter.OnlyInteresting: {
      return 'interestingOnly';
    }
    case GuideDogFilter.OnlyLandmarks: {
      return 'landmarkOnly';
    }
    case GuideDogFilter.OnlyTabableElements: {
      return 'focusableOnly';
    }
  }
};

export const guideDog = async (
  reactComp: ReactElement,
  options: IGuideDogOptions = {
    filterType: GuideDogFilter.OnlyInteresting,
  },
): Promise<AXNode[]> => {
  const comp = ReactDOMServer.renderToString(reactComp);

  // This is terribly slow and should be reused between tests...
  const browser: Browser = await puppeteer.launch();
  const page: Page = await browser.newPage();

  await page.setContent(comp);

  const snapshotOptions = {
    filterType: guideDogFilterToPuppeteerFilter(options.filterType),
  };

  // @ts-ignore: Using a forked version of puppeteer with custom options
  const tree: AXNode = await page.accessibility.snapshot(snapshotOptions);

  await browser.close();

  return tree.children;
};
