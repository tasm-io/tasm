import * as ast from './ast';
import {
  Operand,
  OperandTypes,
  OpcodeMapping,
} from '../instructionset/instructionset';

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

function collectInstructions(program: ast.Node): ast.Instruction[] {
  const visitor = ast.createNullableVisitor<null, ast.Instruction[]>({
    visitInstruction: (_visitor, node, context) => {
      context.push(node);
      return null;
    },
  });
  const instructions: ast.Instruction[] = [];
  program.accept(visitor, instructions);
  return instructions;
}

// Detect any instructions with an opcode not defined by the assembler.
export function detectInvalidOpcodes(program: ast.Node): ast.Instruction[] {
  const instructions = collectInstructions(program);
  return instructions.filter((instruction) => OpcodeMapping[instruction.opcode] === undefined);
}

function getOperandTypes(instruction: ast.Instruction): Operand[] {
  const typeOf = ast.createNullableVisitor<null | Operand, {}>({
    visitInteger: (_visitor, _node, _context) => Operand.INTEGER,
    visitCharacter: (_visitor, _node, _context) => Operand.INTEGER,
    // An identifier represents either a label, or a constant, so we can be sure that
    // it will eventually turn into an integer.
    visitIdentifier: (_visitor, _node, _context) => Operand.INTEGER,
    visitRegister: (_visitor, _node, _context) => Operand.REGISTER,
    visitDirectAddress: (_visitor, _node, _context) => Operand.MEMORY,
    visitRegisterAddress: (_visitor, _node, _context) => Operand.MEMORY_REGISTER_OFFSET,
    visitRegisterOffsetAddress: (_visitor, _node, _context) => Operand.MEMORY_REGISTER_OFFSET,
  });
  // This can't actually return nulls, we just can't prove it to the type checker.
  return instruction.operands.map((operand) => operand.accept(typeOf, {}) as Operand);
}

// Detect any instructions which have operand types not matching any provided by
// the assembler.
export function detectBadlyTypedInstructions(program: ast.Node): ast.Instruction[] {
  const instructions = collectInstructions(program);
  return instructions.filter((instruction) => {
    const operandTypes = getOperandTypes(instruction);
    // This can't fail: we've already made sure that all of the opcodes exist.
    const opcodes = OpcodeMapping[instruction.opcode];
    return !opcodes.some((opcode) => {
      const expectedOperandTypes = OperandTypes[opcode] as Operand[];
      if (expectedOperandTypes.length !== operandTypes.length) {
        return false;
      }
      return operandTypes.every((a, i) => a === expectedOperandTypes[i]);
    });
  });
}

export function detectLabelsUsedInOrg(program: ast.Node): ast.Org[] {
  const collectLabelNames = ast.createNullableVisitor<void, Set<string>>({
    visitLabel: (_visitor, node, context) => { context.add(node.name); },
  });
  const labelNames = new Set<string>();
  program.accept(collectLabelNames, labelNames);
  const collectIdentifierName = ast.createNullableVisitor<
    void,
    { parentNode: ast.Org, context: ast.Org[] }
  >({
    visitIdentifier: (_visitor, node, { parentNode, context }) => {
      if (labelNames.has(node.name)) {
        context.push(parentNode);
      }
    },
  });
  const findOrgsWithLabelNames = ast.createNullableVisitor<void, ast.Org[]>({
    visitOrg: (_visitor, node, context) => {
      node.addr.accept(collectIdentifierName, { parentNode: node, context });
    },
  });
  const badOrgs: ast.Org[] = [];
  program.accept(findOrgsWithLabelNames, badOrgs);
  return badOrgs;
}

function prettyPrintUndefiniedIdentifiers(identifiers: ast.Identifier[]): string {
  return identifiers.map((identifier) => `    line ${identifier.source.line + 1}: ${identifier.name}`).join('\n');
}

export class UndefinedIdentifierError extends Error {
  public identifiers: ast.Identifier[];

  constructor(identifiers: ast.Identifier[]) {
    super(`Undefined identifiers\n${prettyPrintUndefiniedIdentifiers(identifiers)}`);
    this.identifiers = identifiers;
  }
}

function prettyPrintDuplicateDefinitions(definitions: Map<string, Definition[]>): string {
  const lines: string[] = [];
  definitions.forEach((occurrences, name) => {
    lines.push(`    ${name}: ${occurrences.map((occurrence) => `line ${occurrence.source.line + 1}`).join(', ')}`);
  });
  return lines.join('\n');
}

export class DuplicateDefinitionError extends Error {
  public definitions: Map<string, Definition[]>;

  constructor(definitions: Map<string, Definition[]>) {
    super(`Duplicate definitions\n${prettyPrintDuplicateDefinitions(definitions)}`);
    this.definitions = definitions;
  }
}

function prettyPrintOpcodesError(instructions: ast.Instruction[]): string {
  return instructions.map((instruction) => `   line ${instruction.source.line + 1}: ${instruction.opcode}`).join('\n');
}

export class InvalidOpcodesError extends Error {
  public instructions: ast.Instruction[];

  constructor(instructions: ast.Instruction[]) {
    super(`Invalid opcodes\n${prettyPrintOpcodesError(instructions)}`);
    this.instructions = instructions;
  }
}

function prettyPrintBadlyTypedInstructions(instructions: ast.Instruction[]): string {
  return instructions.map((instruction) => `   line ${instruction.source.line + 1}: ${instruction.opcode}`).join('\n');
}

export class BadlyTypedInstructionsError extends Error {
  public instructions: ast.Instruction[];

  constructor(instructions: ast.Instruction[]) {
    super(`Invalid operands to instruction\n${prettyPrintBadlyTypedInstructions(instructions)}`);
    this.instructions = instructions;
  }
}

function prettyPrintLabelsUsedInOrg(orgs: ast.Org[]): string {
  return orgs.map((org) => `   line ${org.source.line + 1}`).join('\n');
}

export class LabelsUsedInOrgError extends Error {
  public orgs: ast.Org[];

  constructor(orgs: ast.Org[]) {
    super(`Labels used in an org statement\n${prettyPrintLabelsUsedInOrg(orgs)}`);
    this.orgs = orgs;
  }
}

export function semanticCheck(program: ast.Node) {
  const undefinedIdentifiers = detectUndefinedIdentifiers(program);
  if (undefinedIdentifiers.length > 0) {
    throw new UndefinedIdentifierError(undefinedIdentifiers);
  }
  const duplicateDefinitions = detectDuplicateDefinitions(program);
  if (duplicateDefinitions.size > 0) {
    throw new DuplicateDefinitionError(duplicateDefinitions);
  }
  const invalidOpcodes = detectInvalidOpcodes(program);
  if (invalidOpcodes.length > 0) {
    throw new InvalidOpcodesError(invalidOpcodes);
  }
  const badlyTypedInstructions = detectBadlyTypedInstructions(program);
  if (badlyTypedInstructions.length > 0) {
    throw new BadlyTypedInstructionsError(badlyTypedInstructions);
  }
  const labelsUsedInOrg = detectLabelsUsedInOrg(program);
  if (labelsUsedInOrg.length > 0) {
    throw new LabelsUsedInOrgError(labelsUsedInOrg);
  }
}
