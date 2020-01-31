import * as ast from './ast';

// The definition of an identifier.
export type Definition = ast.Constant | ast.Label;

// Detect identifiers that have not been defined by either a const statement, or
// through a label name.
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

// Detect identifiers that have been defined in more than one place, be that via a
// label, or a const statement. The return value is a mapping between the identifier
// name and the nodes where it is defined.
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
