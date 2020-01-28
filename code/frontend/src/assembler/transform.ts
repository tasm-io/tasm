import * as ast from './ast';

// TODO(cmgn): Maybe create a common error superclass, which contains the source location.
class CyclicConstantDefinition extends Error {}
class ConstantRedefinition extends Error {}
class UndefinedVariableReference extends Error {}

export function removeCharacters(program: ast.Node): ast.Node {
  const transformer = ast.createTransformer({
    visitCharacter: (_visitor, node, _context) => new ast.Integer(
      node.source,
      node.value.charCodeAt(0),
    ),
  });
  return program.accept(transformer, {});
}
