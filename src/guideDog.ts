
// @ts-ignore 1192 - No default export
import puppeteer, { AXNode, Browser, Page } from 'puppeteer';
import * as ReactDOMServer from 'react-dom/server';
import { ReactElement } from 'react';

let browser: Browser;
let page: Page;

// This is a jest hack. This project should expose a jest present to do this...
beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
});
afterAll(async () => {
  await browser.close();
});

export const guideDog = async (reactComp: ReactElement): Promise<AXNode[]> => {
  const comp = ReactDOMServer.renderToString(reactComp);

  await page.setContent(comp);
  const tree: AXNode = await page.accessibility.snapshot();

  return tree.children;
};
