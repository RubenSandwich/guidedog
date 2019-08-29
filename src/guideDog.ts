
// @ts-ignore 1192 - No default export
import puppeteer, { AXNode, Browser, Page } from 'puppeteer';
import * as ReactDOMServer from 'react-dom/server';
import { ReactElement } from 'react';

interface IGuideDogOptions {
  onlyTabableElements: boolean;
}

export const guideDog = async (
  reactComp: ReactElement,
  options: IGuideDogOptions = {
    onlyTabableElements: false,
  },
): Promise<AXNode[]> => {
  const comp = ReactDOMServer.renderToString(reactComp);

  // This is terribly slow and should be reused between tests...
  const browser: Browser = await puppeteer.launch();
  const page: Page = await browser.newPage();

  await page.setContent(comp);

  const snapshotOptions = {
    focusableOnly: false,
  };
  if (options.onlyTabableElements) {
    snapshotOptions.focusableOnly = true;
  }

  // @ts-ignore: Using a forked version of puppeteer with custom options
  const tree: AXNode = await page.accessibility.snapshot(snapshotOptions);

  await browser.close();

  return tree.children;
};
