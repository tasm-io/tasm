import * as ast from './ast';
import {
  Register,
  // This import is used. I don't understand why eslint thinks that it isn't.
  // Maybe it's because it's only used as a type?
  // eslint-disable-next-line no-unused-vars
  Opcode,
  Operand,
  OperandTypes,
  OpcodeMapping,
} from '../instructionset/instructionset';

class State {
  private memory: number[];

  private wpos: number;

  constructor() {
    this.memory = new Array(256).fill(0);
    this.wpos = 0;
  }

  seek(pos: number) {
    this.wpos = pos;
  }

  write(n: number) {
    this.memory[this.wpos] = n;
    this.wpos += 1;
  }

  extract(): number[] {
    return this.memory;
  }
}

// TODO(cmgn): De-duplicate this. It's also in semantic.ts.
function getOperandTypes(instruction: ast.Instruction): Operand[] {
  const typeOf = ast.createNullableVisitor<null | Operand, {}>({
    visitInteger: (_visitor, _node, _context) => Operand.INTEGER,
    // An identifier represents either a label, or a constant, so we can be sure that
    // it will eventually turn into an integer.
    visitIdentifier: (_visitor, _node, _context) => Operand.INTEGER,
    visitRegister: (_visitor, _node, _context) => Operand.REGISTER,
    visitDirectAddress: (_visitor, _node, _context) => Operand.MEMORY,
    visitRegisterAddress: (_visitor, _node, _context) => Operand.MEMORY,
    visitRegisterOffsetAddress: (_visitor, _node, _context) => Operand.MEMORY,
  });
  // This can't actually return nulls, we just can't prove it to the type checker.
  return instruction.operands.map((operand) => operand.accept(typeOf, {}) as Operand);
}

function getMatchingOpcode(instr: ast.Instruction): Opcode {
  const operandTypes = getOperandTypes(instr);
  const possibleOpcodes = OpcodeMapping[instr.opcode];
  return possibleOpcodes.filter((opcode) => {
    const expectedOperandTypes = OperandTypes[opcode];
    return (expectedOperandTypes.length === operandTypes.length) && (
      expectedOperandTypes.every((a, i) => a === operandTypes[i]));
  })[0];
}

function assembleOperand(operand: ast.Node, state: State) {
  const visitor = ast.createNullableVisitor({
    visitInteger: (_visitor, node, _context) => {
      state.write(node.value);
    },
    visitRegister: (_visitor, node, _context) => {
      state.write(Register[node.name.toUpperCase() as keyof typeof Register]);
    },
    visitDirectAddress: (_visitor, node, _context) => {
      assembleOperand(node.value, state);
    },
    visitRegisterAddress: (_visitor, node, _context) => {
      assembleOperand(node.register, state);
    },
    visitRegisterOffsetAddress: (_visitor, node, _context) => {
      // TODO(cmgn): Come up with a nicer way of doing this.
      const fakeState = new State();
      assembleOperand(node.register, fakeState);
      assembleOperand(node.offset, fakeState);
      const fakeMemory = fakeState.extract();
      // eslint-disable-next-line no-bitwise
      state.write((fakeMemory[0] << 5) | fakeMemory[1]);
    },
  });
  operand.accept(visitor, {});
}

function assembleStatement(stmt: ast.Node, state: State) {
  const visitor = ast.createNullableVisitor({
    visitInstruction: (_visitor, node, _context) => {
      const opcode = getMatchingOpcode(node);
      state.write(opcode);
      node.operands.forEach((operand) => assembleOperand(operand, state));
    },
    visitBlock: (_visitor, node, _context) => {
      node.statements.forEach((subStmt) => assembleStatement(subStmt, state));
    },
    visitByte: (_visitor, node, _context) => {
      // The value of this must be an integer, because it was transformed into one
      // during the transformation stage.
      assembleOperand(node.value, state);
    },
  });
  stmt.accept(visitor, {});
}

export default function assemble(program: ast.Node): number[] {
  const state = new State();
  assembleStatement(program, state);
  return state.extract();
}
