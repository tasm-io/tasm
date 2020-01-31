import * as ast from './ast';

export class CyclicConstantDefinition extends Error {

  constructor(remaining: Map<string, string>) {
    // TODO(cmgn): A better error message.
    super(`could not expand constants, cycle in: ${remaining}`);
  }
}

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

export function removeConstants(program: ast.Node): ast.Node {
  interface Context {
    ready: Map<string, number>,
    unready: Map<string, string>,
  };
  const extractConstantValue = ast.createNullableVisitor<null, { name: string, context: Context} >({
    visitInteger: (_visitor, node, { name, context }) => {
      context.ready.set(name, node.value);
      return null;
    },
    visitIdentifier: (_visitor, node, { name, context }) => {
      context.unready.set(name, node.name);
      return null;
    },
  });
  const collectConstantPairs = ast.createNullableVisitor({
    visitConstant: (_visitor, node, context) => {
      node.value.accept(extractConstantValue, { name: node.name, context: context });
    },
  });
  const ready = new Map<string, number>();
  const unready = new Map<string, string>();
  program.accept(collectConstantPairs, { ready, unready });
  // TODO(cmgn): Optimise this if it's a bottleneck, it's O(n^2) at the moment.
  let moreReplacements = true;
  while (moreReplacements) {
    moreReplacements = false;
    unready.forEach((val, key) => {
      const mapping = ready.get(val);
      if (mapping !== undefined) {
        ready.set(key, mapping);
        unready.delete(key);
        moreReplacements = true;
      }
    });
  }
  if (unready.size > 0) {
    throw new CyclicConstantDefinition(unready);
  }
  // Now we can fill in all the identifiers.
  const replaceConstants = ast.createTransformer({
    visitIdentifier: (_visitor, node, _context) => {
      // If it's undefined, then it must be a label.
      const newValue = ready.get(node.name);
      if (newValue === undefined) {
        return node;
      }
      return new ast.Integer(
        node.source,
        newValue,
      );
    },
    visitConstant: (_visitor, node, _context) => new ast.Block(node.source, []),
  });
  return program.accept(replaceConstants, {});
}
