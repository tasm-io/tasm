import * as ast from './ast';

const source = { line: 0, column: 0, offset: 0 };

it('visits correctly', () => {
  // Collect all the constants in the program.
  const collectConstants: ast.Visitor<null, Set<string>> = ast.createNullableVisitor({
    visitConstant: (_visitor, node, context) => {
      context.add(node.name);
      return null;
    },
  });
  const identifiers = new Set();
  new ast.Block(source, [
    new ast.Constant(source, 'X', new ast.Integer(source, 100)),
    new ast.Integer(source, 100),
    new ast.Constant(source, 'Y', new ast.Integer(source, 100)),
  ]).accept(collectConstants, identifiers);
  expect(identifiers).toStrictEqual(new Set(['X', 'Y']));
});

it('transforms correctly', () => {
  // Transform Asciiz into Ascii, and transform Ascii into a block of bytes.
  const byteTransformer: ast.Transformer<{}> = ast.createTransformer({
    visitAscii: (_visitor, node, _context) => new ast.Block(
      node.source,
      node.value.split('').map((c) => new ast.Byte(node.source, new ast.Character(node.source, c))),
    ),
    visitAsciiz: (visitor, node, context) => new ast.Ascii(
      source,
      `${node.value}\0`,
    ).accept(visitor, context),
  });
  expect(
    new ast.Block(source, [
      new ast.Label(source, 'str'),
      new ast.Asciiz(source, 'abc'),
    ]).accept(byteTransformer, {}),
  ).toStrictEqual(
    new ast.Block(source, [
      new ast.Label(source, 'str'),
      new ast.Block(source, [
        new ast.Byte(source, new ast.Character(source, 'a')),
        new ast.Byte(source, new ast.Character(source, 'b')),
        new ast.Byte(source, new ast.Character(source, 'c')),
        new ast.Byte(source, new ast.Character(source, '\0')),
      ]),
    ]),
  );
});
