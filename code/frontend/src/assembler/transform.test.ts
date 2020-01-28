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
