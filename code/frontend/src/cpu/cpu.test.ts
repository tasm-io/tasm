import {
  DeviceState,
  State,
  step,
  fetchNextInstruction,
  executeInstruction,
} from './cpu';
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
  executeInstruction(state, [], Opcode.ADD_REG_REG, new Uint8Array([Register.AL, Register.BL]));
  expect(state.registers).toStrictEqual(new Uint8Array([3, 2, 0, 0, 0, 0, 0]));
});

it('executes SUB_REG_REG', () => {
  const state: State = {
    registers: new Uint8Array([0, 1, 0, 0, 0, 0, 0]),
    memory: new Uint8Array([]),
  };
  executeInstruction(state, [], Opcode.SUB_REG_REG, new Uint8Array([Register.AL, Register.BL]));
  expect(state.registers).toStrictEqual(new Uint8Array([255, 1, 0, 0, 0, 64, 0]));
});

it('executes MUL_REG_REG', () => {
  const state: State = {
    registers: new Uint8Array([5, 5, 0, 0, 0, 0, 0]),
    memory: new Uint8Array([]),
  };
  executeInstruction(state, [], Opcode.MUL_REG_REG, new Uint8Array([Register.AL, Register.BL]));
  expect(state.registers).toStrictEqual(new Uint8Array([25, 5, 0, 0, 0, 0, 0]));
});

it('executes DIV_REG_REG', () => {
  const state: State = {
    registers: new Uint8Array([5, 2, 0, 0, 0, 0, 0]),
    memory: new Uint8Array([]),
  };
  executeInstruction(state, [], Opcode.DIV_REG_REG, new Uint8Array([Register.AL, Register.BL]));
  expect(state.registers).toStrictEqual(new Uint8Array([2, 2, 0, 0, 0, 0, 0]));
});

it('executes AND_REG_REG', () => {
  const state: State = {
    registers: new Uint8Array([5, 1, 0, 0, 0, 0, 0]),
    memory: new Uint8Array([]),
  };
  executeInstruction(state, [], Opcode.AND_REG_REG, new Uint8Array([Register.AL, Register.BL]));
  expect(state.registers).toStrictEqual(new Uint8Array([1, 1, 0, 0, 0, 0, 0]));
});

it('executes OR_REG_REG', () => {
  const state: State = {
    registers: new Uint8Array([2, 0, 1, 0, 0, 0, 0]),
    memory: new Uint8Array([]),
  };
  executeInstruction(state, [], Opcode.OR_REG_REG, new Uint8Array([Register.AL, Register.CL]));
  expect(state.registers).toStrictEqual(new Uint8Array([3, 0, 1, 0, 0, 0, 0]));
});

it('executes XOR_REG_REG', () => {
  const state: State = {
    registers: new Uint8Array([3, 1, 0, 0, 0, 0, 0]),
    memory: new Uint8Array([]),
  };
  executeInstruction(state, [], Opcode.XOR_REG_REG, new Uint8Array([Register.AL, Register.BL]));
  expect(state.registers).toStrictEqual(new Uint8Array([2, 1, 0, 0, 0, 0, 0]));
});

it('executes CMP_REG_REG', () => {
  const state: State = {
    registers: new Uint8Array([3, 1, 0, 0, 0, 0, 0]),
    memory: new Uint8Array([]),
  };
  executeInstruction(state, [], Opcode.CMP_REG_REG, new Uint8Array([Register.AL, Register.BL]));
  expect(state.registers).toStrictEqual(new Uint8Array([2, 1, 0, 0, 0, 0, 0]));
});

it('executes MOV_REG_REG', () => {
  const state: State = {
    registers: new Uint8Array([0, 0, 0, 2, 0, 0, 0]),
    memory: new Uint8Array([]),
  };
  executeInstruction(state, [], Opcode.MOV_REG_REG, new Uint8Array([Register.AL, Register.DL]));
  expect(state.registers).toStrictEqual(new Uint8Array([2, 0, 0, 2, 0, 0, 0]));
});

it('executes MOV_REG_MEMABS', () => {
  const state: State = {
    registers: new Uint8Array([0, 0, 0, 0, 0, 0, 0]),
    memory: new Uint8Array([0, 5, 0]),
  };
  executeInstruction(state, [], Opcode.MOV_REG_MEMABS, new Uint8Array([Register.SP, 1]));
  expect(state.registers).toStrictEqual(new Uint8Array([0, 0, 0, 0, 5, 0, 0]));
});

it('executes MOV_REG_MEMREGOFFSET', () => {
  const state: State = {
    registers: new Uint8Array([1, 0, 0, 0, 0, 0, 0]),
    memory: new Uint8Array([0, 0, 5]),
  };
  executeInstruction(state, [], Opcode.MOV_REG_MEMABS, new Uint8Array(
    [
      Register.DL,
      (Register.AL << 5) | 0b00010,
    ],
  ));
  expect(state.registers).toStrictEqual(new Uint8Array([1, 0, 0, 5, 0, 0, 0]));
});

it('executes MOV_REG_INT', () => {
  const state: State = {
    registers: new Uint8Array([1, 0, 0, 0, 0, 0, 0]),
    memory: new Uint8Array([0, 0, 5]),
  };
  executeInstruction(state, [], Opcode.MOV_REG_INT, new Uint8Array(
    [
      Register.DL,
      20,
    ],
  ));
  expect(state.registers).toStrictEqual(new Uint8Array([1, 0, 0, 20, 0, 0, 0]));
});

it('executes MOV_MEMABS_REG', () => {
  const state: State = {
    registers: new Uint8Array([0, 0, 1, 0, 0, 0, 0]),
    memory: new Uint8Array([0, 0, 0]),
  };
  executeInstruction(state, [], Opcode.MOV_MEMABS_REG, new Uint8Array(
    [
      0,
      Register.CL,
    ],
  ));
  expect(state.memory).toStrictEqual(new Uint8Array([1, 0, 0]));
});

it('executes MOV_MEMREGOFFSET_REG', () => {
  const state: State = {
    registers: new Uint8Array([1, 0, 1, 0, 0, 0, 0]),
    memory: new Uint8Array([0, 0, 0]),
  };
  executeInstruction(state, [], Opcode.MOV_MEMREGOFFSET_REG, new Uint8Array(
    [
      (Register.AL << 5) | 1,
      Register.CL,
    ],
  ));
  expect(state.memory).toStrictEqual(new Uint8Array([0, 0, 1]));
});

it('executes MOV_MEMABS_INT', () => {
  const state: State = {
    registers: new Uint8Array([1, 0, 1, 0, 0, 0, 0]),
    memory: new Uint8Array([0, 0, 0]),
  };
  executeInstruction(state, [], Opcode.MOV_MEMABS_REG, new Uint8Array(
    [
      0,
      Register.CL,
    ],
  ));
  expect(state.memory).toStrictEqual(new Uint8Array([1, 0, 0]));
});

it('executes MOV_MEMREGOFFSET_INT', () => {
  const state: State = {
    registers: new Uint8Array([1, 0, 1, 0, 0, 0, 0]),
    memory: new Uint8Array([0, 0, 0]),
  };
  executeInstruction(state, [], Opcode.MOV_MEMREGOFFSET_INT, new Uint8Array(
    [
      (Register.BL << 5) | 2,
      1,
    ],
  ));
  expect(state.memory).toStrictEqual(new Uint8Array([0, 0, 1]));
});

it('executes NOT', () => {
  const state: State = {
    registers: new Uint8Array([0, 0, 0, 0, 0, 0, 0]),
    memory: new Uint8Array([0, 0, 0]),
  };
  executeInstruction(state, [], Opcode.NOT, new Uint8Array([Register.AL]));
  expect(state.registers).toStrictEqual(new Uint8Array([255, 0, 0, 0, 0, 64, 0]));
});

it('executes PUSH', () => {
  const state: State = {
    registers: new Uint8Array([3, 0, 0, 0, 2, 0, 0]),
    memory: new Uint8Array([0, 0, 0]),
  };
  executeInstruction(state, [], Opcode.PUSH, new Uint8Array([Register.AL]));
  expect(state.registers).toStrictEqual(new Uint8Array([3, 0, 0, 0, 1, 0, 0]));
  expect(state.memory).toStrictEqual(new Uint8Array([0, 0, 3]));
});

it('executes POP', () => {
  const state: State = {
    registers: new Uint8Array([0, 0, 0, 0, 1, 0, 0]),
    memory: new Uint8Array([0, 0, 4]),
  };
  executeInstruction(state, [], Opcode.POP, new Uint8Array([Register.AL]));
  expect(state.registers).toStrictEqual(new Uint8Array([4, 0, 0, 0, 2, 0, 0]));
  expect(state.memory).toStrictEqual(new Uint8Array([0, 0, 4]));
});

it('executes CALL', () => {
  const state: State = {
    registers: new Uint8Array([0, 0, 0, 0, 2, 0, 0]),
    memory: new Uint8Array([0, 0, 0]),
  };
  executeInstruction(state, [], Opcode.CALL, new Uint8Array([8]));
  expect(state.registers).toStrictEqual(new Uint8Array([0, 0, 0, 0, 1, 0, 6]));
  expect(state.memory).toStrictEqual(new Uint8Array([0, 0, 2]));
});

it('executes RET', () => {
  const state: State = {
    registers: new Uint8Array([0, 0, 0, 0, 1, 0, 0]),
    memory: new Uint8Array([0, 0, 2]),
  };
  executeInstruction(state, [], Opcode.RET, new Uint8Array([]));
  expect(state.registers).toStrictEqual(new Uint8Array([0, 0, 0, 0, 2, 0, 1]));
  expect(state.memory).toStrictEqual(new Uint8Array([0, 0, 2]));
});

it('executes CLI', () => {
  const state: State = {
    registers: new Uint8Array([0, 0, 0, 0, 0, 32, 0]),
    memory: new Uint8Array([0, 0, 0]),
  };
  executeInstruction(state, [], Opcode.CLI, new Uint8Array([]));
  expect(state.registers).toStrictEqual(new Uint8Array([0, 0, 0, 0, 0, 0, 0]));
});

it('executes STI', () => {
  const state: State = {
    registers: new Uint8Array([0, 0, 0, 0, 0, 0, 0]),
    memory: new Uint8Array([0, 0, 0]),
  };
  executeInstruction(state, [], Opcode.STI, new Uint8Array([]));
  expect(state.registers).toStrictEqual(new Uint8Array([0, 0, 0, 0, 0, 32, 0]));
});

it('executes IN', () => {
  const fakeDevice = {
    id: 0,
    requestingInterrupt: false,
    input: (device: DeviceState, input: number): DeviceState => {
      if (typeof device.memory !== 'undefined') {
        device.memory[0] = input;
      }
      return device;
    },
    output: (device: DeviceState): number => {
      if (typeof device.memory !== 'undefined') {
        return device.memory[0];
      }
      return 255;
    },
    memory: new Uint8Array([5]),
  };
  const state: State = {
    registers: new Uint8Array([1, 0, 0, 0, 0, 0, 0]),
    memory: new Uint8Array([0, 0]),
  };
  executeInstruction(state, [fakeDevice], Opcode.IN, new Uint8Array([0]));
  expect(fakeDevice.memory).toStrictEqual(new Uint8Array([1]));
});

it('executes OUT', () => {
  const fakeDevice = {
    id: 0,
    requestingInterrupt: false,
    input: (device: DeviceState, input: number): DeviceState => {
      if (typeof device.memory !== 'undefined') {
        device.memory[0] = input;
      }
      return device;
    },
    output: (device: DeviceState): number => {
      if (typeof device.memory !== 'undefined') {
        return device.memory[0];
      }
      return 255;
    },
    memory: new Uint8Array([5]),
  };
  const state: State = {
    registers: new Uint8Array([1, 0, 0, 0, 0, 0, 0]),
    memory: new Uint8Array([0, 0]),
  };
  executeInstruction(state, [fakeDevice], Opcode.OUT, new Uint8Array([0]));
  expect(state.registers).toStrictEqual(new Uint8Array([5, 0, 0, 0, 0, 0, 0]));
});

it('steps correctly', () => {
  const state: State = {
    registers: new Uint8Array([0, 0, 0, 0, 0, 0, 0]),
    memory: new Uint8Array([Opcode.STI, 0, 0]),
  };
  step(state, []);
  expect(state.registers).toStrictEqual(new Uint8Array([0, 0, 0, 0, 0, 32, 1]));
});

it('handles an interrupt', () => {
  const fakeDevice = {
    id: 2,
    requestingInterrupt: true,
    input: (device: DeviceState, input: number): DeviceState => {
      if (typeof device.memory !== 'undefined') {
        device.memory[0] = input;
      }
      return device;
    },
    output: (device: DeviceState): number => {
      if (typeof device.memory !== 'undefined') {
        return device.memory[0];
      }
      return 255;
    },
    memory: new Uint8Array([5]),
  };
  const state: State = {
    registers: new Uint8Array([0, 0, 0, 0, 1, 32, 0]),
    memory: new Uint8Array([0, 2]),
  };
  step(state, [fakeDevice]);
  expect(state.registers).toStrictEqual(new Uint8Array([0, 0, 0, 0, 0, 32, 2]));
});

it('ignores an interrupt when the interrupt flag is disabled', () => {
  const fakeDevice = {
    id: 2,
    requestingInterrupt: true,
    input: (device: DeviceState, input: number): DeviceState => {
      if (typeof device.memory !== 'undefined') {
        device.memory[0] = input;
      }
      return device;
    },
    output: (device: DeviceState): number => {
      if (typeof device.memory !== 'undefined') {
        return device.memory[0];
      }
      return 255;
    },
    memory: new Uint8Array([5]),
  };
  const state: State = {
    registers: new Uint8Array([1, 0, 0, 0, 2, 0, 0]),
    memory: new Uint8Array([Opcode.PUSH, Register.AL, 0]),
  };
  step(state, [fakeDevice]);
  expect(state.registers).toStrictEqual(new Uint8Array([1, 0, 0, 0, 1, 0, 2]));
  expect(state.memory).toStrictEqual(new Uint8Array([Opcode.PUSH, Register.AL, 1]));
});
