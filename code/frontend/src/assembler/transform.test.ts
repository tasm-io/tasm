import * as ast from './ast';
import * as transform from './transform';

const source = { line: 0, column: 0, offset: 0 };

it('expands characters into ints', () => {
  expect(
    transform.removeCharacters(
      new ast.Block(
        source,
        [
          new ast.Instruction(source, 'push', [new ast.Character(source, 'a')]),
        ],
      ),
    ),
  ).toStrictEqual(
    new ast.Block(
      source,
      [
        new ast.Instruction(source, 'push', [new ast.Integer(source, 97)]),
      ],
    ),
  );
});

it('expands ascii into bytes', () => {
  expect(
    transform.removeStrings(new ast.Ascii(source, 'abcdef')),
  ).toStrictEqual(
    new ast.Block(
      source,
      [
        new ast.Integer(source, 97),
        new ast.Integer(source, 98),
        new ast.Integer(source, 99),
        new ast.Integer(source, 100),
        new ast.Integer(source, 101),
        new ast.Integer(source, 102),
      ],
    )
  );
});

it('expands asciiz into bytes', () => {
  expect(
    transform.removeStrings(new ast.Asciiz(source, 'abcdef')),
  ).toStrictEqual(
    new ast.Block(
      source,
      [
        new ast.Integer(source, 97),
        new ast.Integer(source, 98),
        new ast.Integer(source, 99),
        new ast.Integer(source, 100),
        new ast.Integer(source, 101),
        new ast.Integer(source, 102),
        new ast.Integer(source, 0),
      ],
    )
  );
});

it('removes constants', () => {
  expect(
    transform.removeConstants(
      new ast.Block(
        source,
        [
          new ast.Constant(source, 'X', new ast.Integer(source, 100)),
          new ast.Constant(source, 'Y', new ast.Identifier(source, 'X')),
          new ast.Instruction(source, 'push', [new ast.Identifier(source, 'Y')]),
        ],
      ),
    ),
  ).toStrictEqual(
    new ast.Block(
      source,
      [
        new ast.Block(source, []),
        new ast.Block(source, []),
        new ast.Instruction(source, 'push', [new ast.Integer(source, 100)])
      ],
    ),
  );
});

it('doesn\'t transform labels', () => {
  expect(
    transform.removeConstants(
      new ast.Block(
        source,
        [
          new ast.Label(source, 'foo'),
          new ast.Constant(source, 'x', new ast.Integer(source, 5)),
          new ast.Instruction(
            source,
            'bar',
            [
              new ast.Identifier(source, 'x'),
              new ast.Identifier(source, 'foo'),
            ],
          ),
        ],
      ),
    ),
  ).toStrictEqual(
    new ast.Block(
      source,
      [
        new ast.Label(source, 'foo'),
          new ast.Block(source, []),
        new ast.Instruction(
          source,
          'bar',
          [
            new ast.Integer(source, 5),
            new ast.Identifier(source, 'foo'),
          ],
        ),
      ],
    ),
  );
});

it('detects constant loops', () => {
  expect(
    () => {
      transform.removeConstants(
        new ast.Block(
          source,
          [
            new ast.Constant(source, 'x', new ast.Identifier(source, 'y')),
            new ast.Constant(source, 'y', new ast.Identifier(source, 'x')),
          ],
        ),
      );
    },
  ).toThrow(transform.CyclicConstantDefinition);
});


it('performs the transformation pipeline', () => {
  const transformation = transform.createPipeline(
    transform.removeStrings,
    transform.removeCharacters,
    transform.removeConstants,
  );
  expect(
    transformation(
      new ast.Block(
        source,
        [
          new ast.Constant(source, 'x', new ast.Integer(source, 100)),
          new ast.Constant(source, 'y', new ast.Identifier(source, 'x')),
          new ast.Label(source, 'z'),
          new ast.Asciiz(source, 'abc'),
          new ast.Byte(source, new ast.Character(source, 'a')),
          new ast.Instruction(
            source,
            'mov',
            [
              new ast.Identifier(source, 'x'),
              new ast.Identifier(source, 'y'),
            ],
          ),
        ],
      ),
    ),
  ).toStrictEqual(
    new ast.Block(
      source,
      [
        new ast.Block(source, []),
        new ast.Block(source, []),
        new ast.Label(source, 'z'),
        new ast.Block(
          source,
          [
            new ast.Integer(source, 97),
            new ast.Integer(source, 98),
            new ast.Integer(source, 99),
            new ast.Integer(source, 0),
          ],
        ),
        new ast.Byte(source, new ast.Integer(source, 97)),
        new ast.Instruction(
          source,
          'mov',
          [
            new ast.Integer(source, 100),
            new ast.Integer(source, 100),
          ],
        ),
      ],
    ),
  );
});
