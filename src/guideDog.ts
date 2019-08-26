
// @ts-ignore 1192 - No default export
import puppeteer, { AXNode, Browser, Page } from 'puppeteer';
import * as ReactDOMServer from 'react-dom/server';
import { ReactElement } from 'react';

export const guideDog = async (reactComp: ReactElement): Promise<AXNode[]> => {
  const comp = ReactDOMServer.renderToString(reactComp);

  // This is terribly slow and should be reused between tests...
  const browser: Browser = await puppeteer.launch();
  const page: Page = await browser.newPage();

  await page.setContent(comp);
  const tree: AXNode = await page.accessibility.snapshot();

  await browser.close();

  return tree.children;
};
