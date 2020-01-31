import * as ast from './ast';

export type Definition = ast.Constant | ast.Label;

export function detectUndefinedIdentifiers(program: ast.Node): ast.Identifier[] {
  const visitDefinitions = ast.createNullableVisitor<null, Set<string>>({
    visitLabel: (_visitor, node, context) => {
      context.add(node.name);
      return null;
    },
    visitConstant: (_visitor, node, context) => {
      context.add(node.name);
      return null;
    },
  });
  const definedIdentifiers = new Set<string>();
  program.accept(visitDefinitions, definedIdentifiers);
  interface Context {
    defined: Set<string>,
    undefined: ast.Identifier[],
  }
  const visitUndefinedIdentifiers = ast.createNullableVisitor<null, Context>({
    visitIdentifier: (_visitor, node, context) => {
      if (!context.defined.has(node.name)) {
        context.undefined.push(node);
      }
      return null;
    },
  });
  const undefinedIdentifiers: ast.Identifier[] = [];
  program.accept(visitUndefinedIdentifiers, {
    undefined: undefinedIdentifiers,
    defined: definedIdentifiers,
  });
  return undefinedIdentifiers;
}

export function detectDuplicateDefinitions(program: ast.Node): Map<string, Definition[]> {
  const collectLocations = ast.createNullableVisitor<null, Map<string, Definition[]>>({
    visitLabel: (_visitor, node, context) => {
      const mappings = context.get(node.name) || [];
      mappings.push(node);
      context.set(node.name, mappings);
      return null;
    },
    visitConstant: (_visitor, node, context) => {
      const mappings = context.get(node.name) || [];
      mappings.push(node);
      context.set(node.name, mappings);
      return null;
    },
  });
  const locations = new Map<string, Definition[]>();
  program.accept(collectLocations, locations);
  locations.forEach((mappings, name) => {
    if (mappings.length < 2) {
      locations.delete(name);
    }
  });
  return locations;
}
