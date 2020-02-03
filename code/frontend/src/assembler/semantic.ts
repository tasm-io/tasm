import * as ast from './ast';
import { Opcode, Operand, OperandTypes, OpcodeMapping } from '../instructionset/instructionset';

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

export function detectInvalidOpcodes(program: ast.Node): ast.Instruction[] {
  const instructions = collectInstructions(program);
  return instructions.filter(instruction => OpcodeMapping[instruction.opcode] === undefined);
}

function getOperandTypes(instruction: ast.Instruction): Operand[] {
  const typeOf = ast.createNullableVisitor<null | Operand, {}>({
    visitInteger: (_visitor, _node, _context) => Operand.Integer,
    // An identifier represents either a label, or a constant, so we can be sure that
    // it will eventually turn into an integer.
    visitIdentifier: (_visitor, _node, _context) => Operand.Integer,
    visitRegister: (_visitor, _node, _context) => Operand.Register,
    visitDirectAddress: (_visitor, _node, _context) => Operand.Memory,
    visitRegisterAddress: (_visitor, _node, _context) => Operand.Memory,
    visitRegisterOffsetAddress: (_visitor, _node, _context) => Operand.Memory,
  });
  // This can't actually return nulls, we just can't prove it to the type checker.
  return instruction.operands.map(operand => operand.accept(typeOf, {}) as Operand);
}

export function detectBadlyTypedInstructions(program: ast.Node): ast.Instruction[] {
  const instructions = collectInstructions(program);
  return instructions.filter(instruction => {
    const operandTypes = getOperandTypes(instruction);
    // This can't fail: we've already made sure that all of the opcodes exist.
    const opcodes = OpcodeMapping[instruction.opcode];
    return !opcodes.some(opcode => {
      const expectedOperandTypes = OperandTypes[opcode] as Operand[];
      if (expectedOperandTypes.length !== operandTypes.length) {
        return false;
      }
      for (let i = 0; i < operandTypes.length; i++) {
        if (expectedOperandTypes[i] !== operandTypes[i]) {
          return false;
        }
      }
      return true;
    });
  });
}
