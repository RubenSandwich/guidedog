import { guideDog } from './guideDog';
import { GuideDogFilter } from './types';

test('guideDog single h1', () => {
  const accessibilityTree = guideDog('<h1>header 1</h1>');

  expect(accessibilityTree).toEqual([
    {
      role: 'heading',
      name: 'header 1',
      level: 1,
      focusable: false,
    },
  ]);
});

test("guideDog two h1's", () => {
  const accessibilityTree = guideDog('<h1>header 1</h1><h1>header 2</h1>');

  expect(accessibilityTree).toEqual([
    {
      role: 'heading',
      name: 'header 1',
      level: 1,
      focusable: false,
    },
    {
      role: 'heading',
      name: 'header 2',
      level: 1,
      focusable: false,
    },
  ]);
});

test('guideDog h1 with h2 child', () => {
  const accessibilityTree = guideDog('<h1>header 1</h1><h2>header 2</h2>');

  expect(accessibilityTree).toEqual([
    {
      role: 'heading',
      name: 'header 1',
      level: 1,
      focusable: false,
      children: [
        {
          role: 'heading',
          name: 'header 2',
          level: 2,
          focusable: false,
        },
      ],
    },
  ]);
});

test('guideDog nested h1, h2, and h3s', () => {
  const accessibilityTree = guideDog(
    '<h1>header 1</h1><h2>header 2</h2><h3>header 3</h3><h2>header 2</h2>',
  );

  expect(accessibilityTree).toEqual([
    {
      role: 'heading',
      name: 'header 1',
      level: 1,
      focusable: false,
      children: [
        {
          role: 'heading',
          name: 'header 2',
          level: 2,
          focusable: false,
          children: [
            {
              role: 'heading',
              name: 'header 3',
              level: 3,
              focusable: false,
            },
          ],
        },
        {
          role: 'heading',
          name: 'header 2',
          level: 2,
          focusable: false,
        },
      ],
    },
  ]);
});

test('guideDog single h1 w/ source loc', () => {
  const accessibilityTree = guideDog('<h1>header 1</h1>', {
    sourceCodeLoc: true,
  });

  expect(accessibilityTree).toEqual([
    {
      role: 'heading',
      name: 'header 1',
      level: 1,
      focusable: false,
      sourceCodeLoc: {
        startOffset: 0,
        endOffset: 17,
      },
    },
  ]);
});

test('guideDog h1 with h2 child w/ source loc', () => {
  const accessibilityTree = guideDog('<h1>header 1</h1><h2>header 2</h2>', {
    sourceCodeLoc: true,
  });

  expect(accessibilityTree).toEqual([
    {
      role: 'heading',
      name: 'header 1',
      level: 1,
      focusable: false,
      sourceCodeLoc: {
        startOffset: 0,
        endOffset: 17,
      },
      children: [
        {
          role: 'heading',
          name: 'header 2',
          level: 2,
          focusable: false,
          sourceCodeLoc: {
            startOffset: 17,
            endOffset: 34,
          },
        },
      ],
    },
  ]);
});

test('guideDog single link', () => {
  const accessibilityTree = guideDog('<a href="">test</a>', {
    sourceCodeLoc: true,
    filterType: GuideDogFilter.Links,
  });

  expect(accessibilityTree).toEqual([
    {
      role: 'link',
      name: 'test',
      focusable: true,
      sourceCodeLoc: {
        startOffset: 0,
        endOffset: 19,
      },
    },
  ]);
});

test('guideDog single empty link', () => {
  const accessibilityTree = guideDog('<a>test</a>', {
    sourceCodeLoc: true,
  });

  expect(accessibilityTree).toEqual([]);
});

test('guideDog single empty link with filter', () => {
  const accessibilityTree = guideDog('<a>test</a>', {
    sourceCodeLoc: true,
    filterType: GuideDogFilter.Links,
  });

  expect(accessibilityTree).toEqual([]);
});

test('guideDog two links', () => {
  const accessibilityTree = guideDog(
    '<a href="">test</a><a href="">test 2</a>',
    {
      sourceCodeLoc: true,
      filterType: GuideDogFilter.Links,
    },
  );

  expect(accessibilityTree).toEqual([
    {
      role: 'link',
      name: 'test',
      focusable: true,
      sourceCodeLoc: {
        startOffset: 0,
        endOffset: 19,
      },
    },
    {
      role: 'link',
      name: 'test 2',
      focusable: true,
      sourceCodeLoc: {
        startOffset: 19,
        endOffset: 40,
      },
    },
  ]);
});

test('guideDog link with header', () => {
  const accessibilityTree = guideDog('<h1>header</h1><a href="">link</a>', {
    sourceCodeLoc: true,
  });

  expect(accessibilityTree).toEqual([
    {
      role: 'heading',
      name: 'header',
      level: 1,
      focusable: false,
      sourceCodeLoc: {
        startOffset: 0,
        endOffset: 15,
      },
    },
    {
      role: 'link',
      name: 'link',
      focusable: true,
      sourceCodeLoc: {
        startOffset: 15,
        endOffset: 34,
      },
    },
  ]);
});

// test('guideDog link within a header', () => {
//   const accessibilityTree = guideDog('<h1><a href="">link</a></h1>', {
//     sourceCodeLoc: true,
//   });

//   expect(accessibilityTree).toEqual([
//     {
//       role: 'heading',
//       name: 'link',
//       level: 1,
//       focusable: false,
//       sourceCodeLoc: {
//         startOffset: 0,
//         endOffset: 15,
//       },
//       children: [
//         {
//           role: 'link',
//           name: 'link',
//           focusable: true,
//           sourceCodeLoc: {
//             startOffset: 15,
//             endOffset: 34,
//           },
//         },
//       ],
//     },
//   ]);
// });
