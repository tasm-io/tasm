import * as ast from './ast';
import * as semantic from './semantic';

const source = { offset: 0, line: 0, column: 0 };

it('detects undefined identifiers', () => {
  expect(
    semantic.detectUndefinedIdentifiers(
      new ast.Block(
        source,
        [
          new ast.Constant(source, 'x', new ast.Integer(source, 0)),
          new ast.Constant(source, 'y', new ast.Identifier(source, 'undefined_1')),
          new ast.Instruction(
            source,
            'foo',
            [
              new ast.Identifier(source, 'undefined_2'),
              new ast.Identifier(source, 'x'),
              new ast.Identifier(source, 'y'),
            ],
          )
        ],
      ),
    ),
  ).toStrictEqual(
    [
      new ast.Identifier(source, 'undefined_1'),
      new ast.Identifier(source, 'undefined_2'),
    ],
  );
});
