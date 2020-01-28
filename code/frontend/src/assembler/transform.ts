import * as ast from './ast';

export function removeCharacters(program: ast.Node): ast.Node {
  const transformer = ast.createTransformer({
    visitCharacter: (_visitor, node, _context) => new ast.Integer(
      node.source,
      node.value.charCodeAt(0),
    ),
  });
  return program.accept(transformer, {});
}

export function removeStrings(program: ast.Node): ast.Node {
  const transformer = ast.createTransformer({
    visitAscii: (_visitor, node, _context) => new ast.Block(
      node.source,
      // TODO(cmgn): Maybe adjust the column here?
      node.value.split('').map((c) => new ast.Integer(node.source, c.charCodeAt(0))),
    ),
    visitAsciiz: (visitor, node, context) => new ast.Ascii(
      node.source,
      `${node.value}\0`,
    ).accept(visitor, context),
  });
  return program.accept(transformer, {});
}
