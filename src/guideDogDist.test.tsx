import { guideDog } from '../dist/index';

// TODO: Figure out how to better test exported code

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
