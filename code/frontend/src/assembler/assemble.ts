import * as ast from './ast';
import { Register, Opcode, OpcodeMapping } from '../instructionset/instructionset';

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

const OpcodeHandlers: { [key: string]: (instr: ast.Instruction, state: State) => void } = {
  'add': (instr: ast.Instruction, state: State) => {
    state.write(Opcode.ADD_REG_INT);
    assembleOperand(instr.operands[0], state);
    assembleOperand(instr.operands[1], state);
  },
};

function assembleOperand(node: ast.Node, state: State) {
  const visitor = ast.createNullableVisitor({
    visitInteger: (_visitor, node, _context) => {
      state.write(node.value);
    },
    visitRegister: (_visitor, node, _context) => {
      state.write(Register[node.name.toUpperCase() as keyof typeof Register]);
    },
  });
  node.accept(visitor, {});
}

function assembleStatement(node: ast.Node, state: State) {
  const visitor = ast.createNullableVisitor({
    visitInstruction: (_visitor, node, _context) => {
      const handler = OpcodeHandlers[node.opcode];
      handler(node, state);
    },
  });
  node.accept(visitor, {});
}

export function assembleProgram(program: ast.Node): number[] {
  const state = new State();
  assembleStatement(program, state);
  return state.extract();
}

