import { guideDog, GuideDogFilter } from "./guideDog";

import * as React from "react";

const TestComp = () => {
  return <h1>header 1</h1>;
};

const TestComp2 = () => {
  return <h2>header 1, level 2</h2>;
};

const TestCompWithProps = (props: { text: string }) => {
  return <span>props.text</span>;
};

const TestCompLandmarks = () => {
  return (
    <body>
      <header>
        <div>raw text</div>
      </header>
      <main>
        <h1>header 1</h1>
      </main>
      <footer>
        <h1>header 2</h1>
      </footer>
    </body>
  );
};

const TestCompTabable = () => {
  return (
    <body>
      <header>
        <div>raw text</div>
      </header>
      <main>
        <h1>header 1</h1>
      </main>
      <footer>
        <a href="test">Link 1</a>
      </footer>
      <a href="test">Link 2</a>
      <div>
        <label htmlFor="name">Your Name:</label>
        <input name="name" type="text" />
      </div>
    </body>
  );
};

test("guideDog basic react comp", async () => {
  const accessibilityTree = await guideDog(<TestComp />);

  expect(accessibilityTree).toMatchSnapshot();
});

test("guideDog basic react comp 2", async () => {
  const accessibilityTree = await guideDog(<TestComp2 />);

  expect(accessibilityTree).toMatchSnapshot();
});

test("guideDog string", async () => {
  const accessibilityTree = await guideDog("<h1>header 1</h1>");

  expect(accessibilityTree).toMatchSnapshot();
});

test("guideDog string 2", async () => {
  const accessibilityTree = await guideDog(
    `<body>
      <header>
        <div>raw text</div>
      </header>
      <main>
        <h1>header 1</h1>
      </main>
      <footer>
        <h1>header 2</h1>
      </footer>
    </body>`
  );

  expect(accessibilityTree).toMatchSnapshot();
});

test("guideDog comp with props", async () => {
  const accessibilityTree = await guideDog(<TestCompWithProps text="great" />);

  expect(accessibilityTree).toMatchSnapshot();
});

test("guideDog landmarks", async () => {
  const accessibilityTree = await guideDog(<TestCompLandmarks />, {
    filterType: GuideDogFilter.OnlyLandmarks
  });

  expect(accessibilityTree).toMatchSnapshot();
});

test("guideDog tabable elements", async () => {
  const accessibilityTree = await guideDog(<TestCompTabable />);

  expect(accessibilityTree).toMatchSnapshot();

  const tabableTree = await guideDog(<TestCompTabable />, {
    filterType: GuideDogFilter.OnlyTabableElements
  });

  expect(tabableTree).toMatchSnapshot();
  expect(tabableTree).not.toBe(accessibilityTree);
});
