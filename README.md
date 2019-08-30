# Guide Dog
## This is only a prototype. 
## It will not work as intended! 
## Here be dragons. 
##### Beware of Dog. 

Guide Dog is an experiment in regression testing for accessability.

It currently only works with React components, which can then be "snapshotted" with jest to tell when  element changes produce accessability changes.

Guide Dog can produce:
- Accessability tree
- Tabable elements tree
- Landmarks tree

## Usage:
```bash
yarn add --dev @rubennic/guidedog
```

In your jest file:
```jsx
import { guideDog, GuideDogFilter } from '@rubennic/guidedog';

test('guideDog test', async () => {
  const accessibilityTree = await guideDog(<TestComp/>);
  expect(accessibilityTree).toMatchSnapshot();

  const tabableTree = await guideDog(<TestComp/>, {
    filterType: GuideDogFilter.OnlyTabableElements,
  });
  expect(tabableTree).toMatchSnapshot();

  const landmarksTree = await guideDog(<TestComp/>, {
    filterType: GuideDogFilter.OnlyLandmarks,
  });
  expect(landmarksTree).toMatchSnapshot();
});
```

## A few of it's current limitations:

1. Super slow. This is due to using puppeteer to generate accessability trees.
2. Invalid snapshots do not link back to offending react components.

I'm working on ideas for all of the above problems.
