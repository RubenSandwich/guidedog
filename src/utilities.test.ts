import { getHeaderInsertPath, upsertNode } from './utilities';

test('guideDog getHeaderInsertPath', () => {
  expect(getHeaderInsertPath([], 1)).toEqual([0]);

  expect(
    getHeaderInsertPath(
      [
        {
          role: 'heading',
          name: 'header 1',
          level: 1,
          focusable: false,
        },
      ],
      1,
    ),
  ).toEqual([1]); // [l:1], 1

  expect(
    getHeaderInsertPath(
      [
        {
          role: 'heading',
          name: 'header 2',
          level: 2,
          focusable: false,
        },
      ],
      1,
    ),
  ).toEqual([1]); // [l:2], 1

  expect(
    getHeaderInsertPath(
      [
        {
          role: 'heading',
          name: 'header 1',
          level: 1,
          focusable: false,
        },
      ],
      2,
    ),
  ).toEqual([0, 0]); // [l:1], 2

  expect(
    getHeaderInsertPath(
      [
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
      ],
      3,
    ),
  ).toEqual([0, 0, 0]); //[l:1 c:[l:2]], 3

  expect(
    getHeaderInsertPath(
      [
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
      ],
      2,
    ),
  ).toEqual([0, 1]); //[l:1 c:[l:2]], 2

  expect(
    getHeaderInsertPath(
      [
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
      ],
      1,
    ),
  ).toEqual([1]); //[l:1 c:[l:2]], 1

  expect(
    getHeaderInsertPath(
      [
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
            {
              role: 'heading',
              name: 'header 2',
              level: 2,
              focusable: false,
            },
          ],
        },
      ],
      3,
    ),
  ).toEqual([0, 1, 0]); //[l:1 c:[l:2, l:2]], 3
});

test('guideDog upsertNode', () => {
  const nodeOne = {
    role: 'heading',
    name: 'header 1',
    level: 1,
    focusable: false,
  };
  expect(upsertNode([], nodeOne, [0])).toEqual([nodeOne]);

  const nodeTwo = {
    role: 'heading',
    name: 'header 2',
    level: 2,
    focusable: false,
  };
  expect(upsertNode([nodeOne], nodeTwo, [1])).toEqual([nodeOne, nodeTwo]);

  expect(upsertNode([nodeOne], nodeTwo, [0])).toEqual([nodeTwo, nodeOne]);

  expect(upsertNode([nodeOne, nodeTwo], nodeOne, [2])).toEqual([
    nodeOne,
    nodeTwo,
    nodeOne,
  ]);

  expect(upsertNode([nodeTwo, nodeOne], nodeTwo, [1])).toEqual([
    nodeTwo,
    nodeTwo,
    nodeOne,
  ]);

  expect(upsertNode([nodeOne], nodeTwo, [0, 0])).toEqual([
    { ...nodeOne, children: [nodeTwo] },
  ]);

  const nodeThree = {
    role: 'heading',
    name: 'header 3',
    level: 3,
    focusable: false,
  };

  expect(
    upsertNode([{ ...nodeOne, children: [nodeTwo] }], nodeThree, [0, 0, 0]),
  ).toEqual([
    { ...nodeOne, children: [{ ...nodeTwo, children: [nodeThree] }] },
  ]);

  expect(
    upsertNode([{ ...nodeOne, children: [nodeTwo, nodeTwo] }], nodeThree, [
      0,
      0,
      0,
    ]),
  ).toEqual([
    { ...nodeOne, children: [{ ...nodeTwo, children: [nodeThree] }, nodeTwo] },
  ]);

  expect(
    upsertNode([{ ...nodeOne, children: [nodeTwo, nodeTwo] }], nodeThree, [
      0,
      1,
      0,
    ]),
  ).toEqual([
    { ...nodeOne, children: [nodeTwo, { ...nodeTwo, children: [nodeThree] }] },
  ]);

  expect(
    upsertNode(
      [
        {
          ...nodeOne,
          children: [nodeTwo, { ...nodeTwo, children: [nodeThree] }],
        },
      ],
      nodeTwo,
      [0, 2],
    ),
  ).toEqual([
    {
      ...nodeOne,
      children: [nodeTwo, { ...nodeTwo, children: [nodeThree] }, nodeTwo],
    },
  ]);

  expect(
    upsertNode(
      [
        {
          ...nodeOne,
          children: [nodeTwo, { ...nodeTwo, children: [nodeThree] }],
        },
      ],
      nodeOne,
      [1],
    ),
  ).toEqual([
    {
      ...nodeOne,
      children: [nodeTwo, { ...nodeTwo, children: [nodeThree] }],
    },
    nodeOne,
  ]);

  expect(
    upsertNode(
      [
        {
          ...nodeOne,
          children: [nodeTwo, { ...nodeTwo, children: [nodeThree] }],
        },
      ],
      nodeOne,
      [0],
    ),
  ).toEqual([
    nodeOne,
    {
      ...nodeOne,
      children: [nodeTwo, { ...nodeTwo, children: [nodeThree] }],
    },
  ]);
});
