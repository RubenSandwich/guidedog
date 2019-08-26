
import { guideDog } from './guideDog';

import * as React from 'react';

const TestComp = () => {
  return <h1>title</h1>;
};

const TestComp2 = () => {
  return <h2>title</h2>;
};

const TestCompWithProps = (props: {text: string}) => {
  return <span>props.text</span>;
};

const TestCompLandmarks = () => {
  return (
    <body>
      <header><div>title</div></header>
      <main><h1>title 1</h1></main>
      <footer><h1>title 2</h1></footer>
    </body>
  );
};

test('guideDog', async () => {
  const accessibilityTree = await guideDog(<TestComp />);

  expect(accessibilityTree).toMatchSnapshot();
});

test('guideDog 2', async () => {
  const accessibilityTree = await guideDog(<TestComp2 />);

  expect(accessibilityTree).toMatchSnapshot();
});

test('guideDog comp with props', async () => {
  const accessibilityTree = await guideDog(<TestCompWithProps text='great'/>);

  expect(accessibilityTree).toMatchSnapshot();
});

test('guideDog landmarks', async () => {
  // puppeteer doesn't have great aria landmark support...
  const accessibilityTree = await guideDog(<TestCompLandmarks />);

  expect(accessibilityTree).toMatchSnapshot();
});
