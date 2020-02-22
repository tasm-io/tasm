/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
import { Register, Opcode, OperandTypes } from '../instructionset/instructionset';

export interface State {
  registers: Uint8Array,
  memory: Uint8Array,
}

export class Halt extends Error {}

export class IllegalOpcodeError extends Error {
  constructor(opcode: number) {
    super(`illegal opcode ${opcode}`);
  }
}

export class IllegalOperandError extends Error {
  constructor(opcode: number, operands: Uint8Array) {
    super(`illegal operand(s) for ${opcode}: ${operands}`);
  }
}

export function fetchNextInstruction(state: State): [Opcode, Uint8Array] {
  const pos = state.registers[Register.IP];
  const untypedOpcode = state.memory[pos];
  if (Opcode[untypedOpcode] === 'undefined') {
    throw new IllegalOpcodeError(state.memory[pos]);
  }
  const typedOpcode = untypedOpcode as Opcode;
  const operands = new Uint8Array(OperandTypes[typedOpcode].length);
  for (let i = 0; i < operands.length; i += 1) {
    operands[i] = state.memory[(pos + i + 1) % state.memory.length];
  }
  return [typedOpcode, operands];
}

function updateFlags(state: State, lastResult: number) {
  // Clear the existing flags.
  state.registers[Register.SR] &= ~(128 | 64);
  if (lastResult === 0) {
    // Zero
    state.registers[Register.SR] |= 128;
  } else if (lastResult >= 128) {
    // Overflow
    state.registers[Register.SR] |= 64;
  }
}

function isRegister(value: number) {
  return Register[value] !== 'undefined';
}

const operatorFunctionFor = {
  [Opcode.ADD_REG_REG]: (x: number, y: number) => x + y,
  [Opcode.SUB_REG_REG]: (x: number, y: number) => x - y,
  [Opcode.MUL_REG_REG]: (x: number, y: number) => x * y,
  [Opcode.DIV_REG_REG]: (x: number, y: number) => Math.floor(x / y),
  [Opcode.AND_REG_REG]: (x: number, y: number) => x & y,
  [Opcode.OR_REG_REG]: (x: number, y: number) => x | y,
  [Opcode.XOR_REG_REG]: (x: number, y: number) => x ^ y,
  [Opcode.ADD_REG_INT]: (x: number, y: number) => x + y,
  [Opcode.SUB_REG_INT]: (x: number, y: number) => x - y,
  [Opcode.MUL_REG_INT]: (x: number, y: number) => x * y,
  [Opcode.DIV_REG_INT]: (x: number, y: number) => Math.floor(x / y),
  [Opcode.AND_REG_INT]: (x: number, y: number) => x & y,
  [Opcode.OR_REG_INT]: (x: number, y: number) => x | y,
  [Opcode.XOR_REG_INT]: (x: number, y: number) => x ^ y,
};

export function executeInstruction(state: State, opcode: Opcode, operands: Uint8Array) {
  // TODO(cmgn): Get rid of this giant, ugly switch statement.
  switch (opcode) {
  case Opcode.HALT:
    throw new Halt();
  case Opcode.NOP:
    break;
  case Opcode.MOV_REG_REG:
    if (!isRegister(operands[0]) || !isRegister(operands[1])) {
      throw new IllegalOperandError(opcode, operands);
    }
    state.registers[operands[0]] = state.registers[operands[1]];
    break;
  case Opcode.MOV_REG_MEMABS:
    if (!isRegister(operands[0])) {
      throw new IllegalOperandError(opcode, operands);
    }
    state.registers[operands[0]] = state.memory[operands[1]];
    break;
  case Opcode.MOV_REG_MEMREGOFFSET:
    {
      const register = operands[1] >> 5;
      if (!isRegister(register)) {
        throw new IllegalOperandError(opcode, operands);
      }
      const offset = operands[1] & 0b00011111;
      state.registers[operands[0]] = state.memory[state.registers[register] + offset];
    }
    break;
  case Opcode.ADD_REG_REG:
  case Opcode.SUB_REG_REG:
  case Opcode.MUL_REG_REG:
  case Opcode.DIV_REG_REG:
  case Opcode.AND_REG_REG:
  case Opcode.OR_REG_REG:
  case Opcode.XOR_REG_REG:
    if (!isRegister(operands[0]) || !isRegister(operands[1])) {
      throw new IllegalOperandError(opcode, operands);
    }
    state.registers[operands[0]] = operatorFunctionFor[opcode](
      state.registers[operands[0]],
      state.registers[operands[1]],
    );
    updateFlags(state, state.registers[operands[0]]);
    break;
  case Opcode.ADD_REG_INT:
  case Opcode.SUB_REG_INT:
  case Opcode.MUL_REG_INT:
  case Opcode.DIV_REG_INT:
  case Opcode.AND_REG_INT:
  case Opcode.OR_REG_INT:
  case Opcode.XOR_REG_INT:
    if (!isRegister(operands[0])) {
      throw new IllegalOperandError(opcode, operands);
    }
    state.registers[operands[0]] = operatorFunctionFor[opcode](
      state.registers[operands[0]],
      operands[1],
    );
    updateFlags(state, state.registers[operands[0]]);
    break;
  default:
    throw new Error('uh oh!');
  }
}
