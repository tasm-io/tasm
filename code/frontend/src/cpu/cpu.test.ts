import { State, fetchNextInstruction, executeInstruction } from './cpu';
import { Opcode, Register } from '../instructionset/instructionset';

it('fetches the next nullary instruction', () => {
  const state: State = {
    registers: new Uint8Array(7),
    memory: new Uint8Array([Opcode.STI]),
  };
  expect(fetchNextInstruction(state)).toStrictEqual([Opcode.STI, new Uint8Array([])]);
});

it('fetches the next unary instruction', () => {
  const state: State = {
    registers: new Uint8Array(7),
    memory: new Uint8Array([Opcode.CALL, 50]),
  };
  expect(fetchNextInstruction(state)).toStrictEqual([Opcode.CALL, new Uint8Array([50])]);
});

it('fetches the next binary instruction', () => {
  const state: State = {
    registers: new Uint8Array(7),
    memory: new Uint8Array([Opcode.ADD_REG_INT, Register.AL, 50]),
  };
  expect(fetchNextInstruction(state)).toStrictEqual(
    [
      Opcode.ADD_REG_INT,
      new Uint8Array([Register.AL, 50]),
    ],
  );
});

it('fetches the next ternary instruction', () => {
  const state: State = {
    registers: new Uint8Array(7),
    memory: new Uint8Array([Opcode.ADD_REG_REG, Register.AL, Register.BL, 0]),
  };
  expect(fetchNextInstruction(state)).toStrictEqual(
    [
      Opcode.ADD_REG_REG,
      new Uint8Array([Register.AL, Register.BL]),
    ],
  );
});

it('executes ADD_REG_REG', () => {
  const state: State = {
    registers: new Uint8Array([1, 2, 0, 0, 0, 0, 0]),
    memory: new Uint8Array([]),
  };
  executeInstruction(state, Opcode.ADD_REG_REG, new Uint8Array([Register.AL, Register.BL]));
  expect(state.registers).toStrictEqual(new Uint8Array([3, 2, 0, 0, 0, 0, 0]));
});

it('executes SUB_REG_REG', () => {
  const state: State = {
    registers: new Uint8Array([0, 1, 0, 0, 0, 0, 0]),
    memory: new Uint8Array([]),
  };
  executeInstruction(state, Opcode.SUB_REG_REG, new Uint8Array([Register.AL, Register.BL]));
  expect(state.registers).toStrictEqual(new Uint8Array([255, 1, 0, 0, 0, 64, 0]));
});

it('executes MUL_REG_REG', () => {
  const state: State = {
    registers: new Uint8Array([5, 5, 0, 0, 0, 0, 0]),
    memory: new Uint8Array([]),
  };
  executeInstruction(state, Opcode.MUL_REG_REG, new Uint8Array([Register.AL, Register.BL]));
  expect(state.registers).toStrictEqual(new Uint8Array([25, 5, 0, 0, 0, 0, 0]));
});

it('executes DIV_REG_REG', () => {
  const state: State = {
    registers: new Uint8Array([5, 2, 0, 0, 0, 0, 0]),
    memory: new Uint8Array([]),
  };
  executeInstruction(state, Opcode.DIV_REG_REG, new Uint8Array([Register.AL, Register.BL]));
  expect(state.registers).toStrictEqual(new Uint8Array([2, 2, 0, 0, 0, 0, 0]));
});

it('executes AND_REG_REG', () => {
  const state: State = {
    registers: new Uint8Array([5, 1, 0, 0, 0, 0, 0]),
    memory: new Uint8Array([]),
  };
  executeInstruction(state, Opcode.AND_REG_REG, new Uint8Array([Register.AL, Register.BL]));
  expect(state.registers).toStrictEqual(new Uint8Array([1, 1, 0, 0, 0, 0, 0]));
});

it('executes OR_REG_REG', () => {
  const state: State = {
    registers: new Uint8Array([2, 0, 1, 0, 0, 0, 0]),
    memory: new Uint8Array([]),
  };
  executeInstruction(state, Opcode.OR_REG_REG, new Uint8Array([Register.AL, Register.CL]));
  expect(state.registers).toStrictEqual(new Uint8Array([3, 0, 1, 0, 0, 0, 0]));
});

it('executes XOR_REG_REG', () => {
  const state: State = {
    registers: new Uint8Array([3, 1, 0, 0, 0, 0, 0]),
    memory: new Uint8Array([]),
  };
  executeInstruction(state, Opcode.XOR_REG_REG, new Uint8Array([Register.AL, Register.BL]));
  expect(state.registers).toStrictEqual(new Uint8Array([2, 1, 0, 0, 0, 0, 0]));
});

it('executes MOV_REG_REG', () => {
  const state: State = {
    registers: new Uint8Array([0, 0, 0, 2, 0, 0, 0]),
    memory: new Uint8Array([]),
  };
  executeInstruction(state, Opcode.MOV_REG_REG, new Uint8Array([Register.AL, Register.DL]));
  expect(state.registers).toStrictEqual(new Uint8Array([2, 0, 0, 2, 0, 0, 0]));
});

it('executes MOV_REG_MEMABS', () => {
  const state: State = {
    registers: new Uint8Array([0, 0, 0, 0, 0, 0, 0]),
    memory: new Uint8Array([0, 5, 0]),
  };
  executeInstruction(state, Opcode.MOV_REG_MEMABS, new Uint8Array([Register.SP, 1]));
  expect(state.registers).toStrictEqual(new Uint8Array([0, 0, 0, 0, 5, 0, 0]));
});

it('executes MOV_REG_MEMREGOFFSET', () => {
  const state: State = {
    registers: new Uint8Array([1, 0, 0, 0, 0, 0, 0]),
    memory: new Uint8Array([0, 0, 5]),
  };
  executeInstruction(state, Opcode.MOV_REG_MEMABS, new Uint8Array([Register.DL, (Register.AL << 5) | 0b00010]));
  expect(state.registers).toStrictEqual(new Uint8Array([1, 0, 0, 5, 0, 0, 0]));
});

