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
  // memory is the 256 bytes of memory that we have available.
  private memory: number[];

  // toFill consists of pairs of addresses which are due to have the
  // location of labels filled in.
  private toFill: [number, string][];

  // labels contains the positions of the labels we have seen so far.
  private labels: Map<string, number>;

  // position is the current position in the memory buffer.
  private position: number;

  constructor() {
    this.memory = new Array(256).fill(0);
    this.toFill = [];
    this.labels = new Map();
    this.position = 0;
  }

  // Seek sets the write position.
  seek(pos: number) {
    this.position = pos;
  }

  // Write writes a single integer.
  write(n: number) {
    this.memory[this.position] = n;
    this.position += 1;
    this.position %= this.memory.length;
  }

  // Mark marks the current write position as one that should be filled in once
  // we have collected all of the labels. The argument is the label that should be
  // placed here.
  mark(name: string) {
    this.toFill.push([this.position, name]);
    this.position += 1;
    this.position %= this.memory.length;
  }

  // Label sets a label to the current write position.
  label(name: string) {
    this.labels.set(name, this.position);
  }

  fillLabels() {
    this.toFill.forEach(([position, name]) => {
      this.memory[position] = this.labels.get(name) as number;
    });
    this.toFill = [];
  }

  // Extract extracs the underlying memory.
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
    visitRegisterAddress: (_visitor, _node, _context) => Operand.MEMORY_REGISTER_OFFSET,
    visitRegisterOffsetAddress: (_visitor, _node, _context) => Operand.MEMORY_REGISTER_OFFSET,
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

const operandVisitor = ast.createNullableVisitor<void, State>({
  visitInteger: (_visitor, node, context) => {
    context.write(node.value);
  },
  visitIdentifier: (_visitor, node, context) => {
    context.mark(node.name);
  },
  visitRegister: (_visitor, node, context) => {
    context.write(Register[node.name.toUpperCase() as keyof typeof Register]);
  },
  visitDirectAddress: (visitor, node, context) => {
    node.value.accept(visitor, context);
  },
  visitRegisterAddress: (visitor, node, context) => {
    const fakeState = new State();
    node.register.accept(visitor, fakeState);
    const fakeMemory = fakeState.extract();
    // eslint-disable-next-line no-bitwise
    context.write(fakeMemory[0] << 5);
  },
  visitRegisterOffsetAddress: (visitor, node, context) => {
    // TODO(cmgn): Come up with a nicer way of doing this.
    const fakeState = new State();
    node.register.accept(visitor, fakeState);
    node.offset.accept(visitor, fakeState);
    const fakeMemory = fakeState.extract();
    // eslint-disable-next-line no-bitwise
    context.write((fakeMemory[0] << 5) | fakeMemory[1]);
  },
});

const statementVisitor = ast.createNullableVisitor<void, State>({
  visitInstruction: (_visitor, node, context) => {
    const opcode = getMatchingOpcode(node);
    context.write(opcode);
    node.operands.forEach((operand) => operand.accept(operandVisitor, context));
  },
  visitBlock: (visitor, node, context) => {
    node.statements.forEach((stmt) => stmt.accept(visitor, context));
  },
  visitByte: (_visitor, node, context) => {
    // The value of this must be an integer, because it was transformed into one
    // during the transformation stage.
    node.accept(operandVisitor, context);
  },
  visitLabel: (_visitor, node, context) => {
    context.label(node.name);
  },
  visitOrg: (_visitor, node, context) => {
    const fakeState = new State();
    node.addr.accept(operandVisitor, fakeState);
    const offset = fakeState.extract()[0];
    context.seek(offset);
  },
});

export default function assemble(program: ast.Node): number[] {
  const state = new State();
  program.accept(statementVisitor, state);
  state.fillLabels();
  return state.extract();
}
