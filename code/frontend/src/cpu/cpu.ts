/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
import { Register, Opcode, OperandTypes } from '../instructionset/instructionset';

export interface State {
  registers: Uint8Array,
  memory: Uint8Array,
}

export interface DeviceState {
  id: number
  requestingInterrupt: boolean
  input: (device: DeviceState, input: number) => DeviceState
  output: (device: DeviceState) => number
  memory?: Uint8Array
}

export class Halt extends Error {
  constructor() {
    super('Program has halted');
  }
}

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

export class NoSuchDeviceError extends Error {
  constructor(device: number) {
    super(`no device with id ${device}`);
  }
}

export function fetchNextInstruction(state: State): [Opcode, Uint8Array] {
  const pos = state.registers[Register.IP];
  const untypedOpcode = state.memory[pos];
  if (typeof Opcode[untypedOpcode] === 'undefined') {
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
    // Negative
    state.registers[Register.SR] |= 64;
  }
}

function isRegister(value: number) {
  return typeof Register[value] !== 'undefined';
}

const operatorFunctionFor = {
  [Opcode.ADD_REG_REG]: (x: number, y: number) => x + y,
  [Opcode.SUB_REG_REG]: (x: number, y: number) => x - y,
  [Opcode.MUL_REG_REG]: (x: number, y: number) => x * y,
  [Opcode.DIV_REG_REG]: (x: number, y: number) => Math.floor(x / y),
  [Opcode.AND_REG_REG]: (x: number, y: number) => x & y,
  [Opcode.OR_REG_REG]: (x: number, y: number) => x | y,
  [Opcode.XOR_REG_REG]: (x: number, y: number) => x ^ y,
  [Opcode.CMP_REG_REG]: (x: number, y: number) => x - y,
  [Opcode.SHR_REG_REG]: (x: number, y: number) => x >> y,
  [Opcode.SHL_REG_REG]: (x: number, y: number) => x << y,
  [Opcode.ADD_REG_INT]: (x: number, y: number) => x + y,
  [Opcode.SUB_REG_INT]: (x: number, y: number) => x - y,
  [Opcode.MUL_REG_INT]: (x: number, y: number) => x * y,
  [Opcode.DIV_REG_INT]: (x: number, y: number) => Math.floor(x / y),
  [Opcode.AND_REG_INT]: (x: number, y: number) => x & y,
  [Opcode.OR_REG_INT]: (x: number, y: number) => x | y,
  [Opcode.XOR_REG_INT]: (x: number, y: number) => x ^ y,
  [Opcode.CMP_REG_INT]: (x: number, y: number) => x - y,
  [Opcode.SHR_REG_INT]: (x: number, y: number) => x >> y,
  [Opcode.SHL_REG_INT]: (x: number, y: number) => x << y,
  [Opcode.NOT]: (x: number) => ~x & 0b11111111,
};

const predicateFunctionFor = {
  [Opcode.JMP]: (_flags: number) => true,
  [Opcode.JS]: (flags: number) => (flags & 64) !== 0,
  [Opcode.JNS]: (flags: number) => (flags & 64) === 0,
  [Opcode.JZ]: (flags: number) => (flags & 128) !== 0,
  [Opcode.JNZ]: (flags: number) => (flags & 128) === 0,
};

export function executeInstruction(
  state: State,
  devices: DeviceState[],
  opcode: Opcode,
  operands: Uint8Array,
) {
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
      if (!isRegister(register) || !isRegister(operands[0])) {
        throw new IllegalOperandError(opcode, operands);
      }
      const offset = operands[1] & 0b00011111;
      state.registers[operands[0]] = state.memory[state.registers[register] + offset];
    }
    break;
  case Opcode.MOV_REG_INT:
    if (!isRegister(operands[0])) {
      throw new IllegalOperandError(opcode, operands);
    }
    state.registers[operands[0]] = operands[1];
    break;
  case Opcode.MOV_MEMABS_REG:
    if (!isRegister(operands[1])) {
      throw new IllegalOperandError(opcode, operands);
    }
    state.memory[operands[0]] = state.registers[operands[1]];
    break;
  case Opcode.MOV_MEMREGOFFSET_REG:
    {
      const register = operands[0] >> 5;
      if (!isRegister(register) || !isRegister(operands[1])) {
        throw new IllegalOperandError(opcode, operands);
      }
      const offset = operands[0] & 0b00011111;
      state.memory[state.registers[register] + offset] = state.registers[operands[1]];
    }
    break;
  case Opcode.MOV_MEMABS_INT:
    state.memory[operands[0]] = state.registers[operands[0]];
    break;
  case Opcode.MOV_MEMREGOFFSET_INT:
    {
      const register = operands[0] >> 5;
      if (!isRegister(register)) {
        throw new IllegalOperandError(opcode, operands);
      }
      const offset = operands[0] & 0b00011111;
      state.memory[state.registers[register] + offset] = operands[1];
    }
    break;
  case Opcode.INC:
  case Opcode.DEC:
    if (!isRegister(operands[0])) {
      throw new IllegalOperandError(opcode, operands);
    }
    state.registers[operands[0]] = state.registers[operands[0]] + (opcode === Opcode.INC ? 1 : -1);
    break;
  case Opcode.ADD_REG_REG:
  case Opcode.SUB_REG_REG:
  case Opcode.MUL_REG_REG:
  case Opcode.DIV_REG_REG:
  case Opcode.AND_REG_REG:
  case Opcode.OR_REG_REG:
  case Opcode.XOR_REG_REG:
  case Opcode.SHR_REG_REG:
  case Opcode.SHL_REG_REG:
    if (!isRegister(operands[0]) || !isRegister(operands[1])) {
      throw new IllegalOperandError(opcode, operands);
    }
    state.registers[operands[0]] = operatorFunctionFor[opcode](
      state.registers[operands[0]],
      state.registers[operands[1]],
    );
    updateFlags(state, state.registers[operands[0]]);
    break;
  case Opcode.CMP_REG_REG:
    {
      if (!isRegister(operands[0]) || !isRegister(operands[1])) {
        throw new IllegalOperandError(opcode, operands);
      }
      const result = new Uint8Array([
        state.registers[operands[0]] - state.registers[operands[1]],
      ])[0];
      updateFlags(state, result);
    }
    break;
  case Opcode.ADD_REG_INT:
  case Opcode.SUB_REG_INT:
  case Opcode.MUL_REG_INT:
  case Opcode.DIV_REG_INT:
  case Opcode.AND_REG_INT:
  case Opcode.OR_REG_INT:
  case Opcode.XOR_REG_INT:
  case Opcode.SHR_REG_INT:
  case Opcode.SHL_REG_INT:
    if (!isRegister(operands[0])) {
      throw new IllegalOperandError(opcode, operands);
    }
    state.registers[operands[0]] = operatorFunctionFor[opcode](
      state.registers[operands[0]],
      operands[1],
    );
    updateFlags(state, state.registers[operands[0]]);
    break;
  case Opcode.CMP_REG_INT:
    {
      if (!isRegister(operands[0])) {
        throw new IllegalOperandError(opcode, operands);
      }
      const result = new Uint8Array([
        state.registers[operands[0]] - operands[1],
      ])[0];
      updateFlags(state, result);
    }
    break;
  case Opcode.NOT:
    if (!isRegister(operands[0])) {
      throw new IllegalOperandError(opcode, operands);
    }
    state.registers[operands[0]] = ~state.registers[operands[0]];
    updateFlags(state, state.registers[operands[0]]);
    break;
  case Opcode.PUSH:
    if (!isRegister(operands[0])) {
      throw new IllegalOperandError(opcode, operands);
    }
    state.memory[state.registers[Register.SP]] = state.registers[operands[0]];
    state.registers[Register.SP] -= 1;
    break;
  case Opcode.POP:
    if (!isRegister(operands[0])) {
      throw new IllegalOperandError(opcode, operands);
    }
    state.registers[Register.SP] += 1;
    state.registers[operands[0]] = state.memory[state.registers[Register.SP]];
    break;
  case Opcode.CALL:
    // Offset it by 2 because this instruction occupies 2 bytes, and we want to end
    // up at the next instruction when we return.
    state.memory[state.registers[Register.SP]] = state.registers[Register.IP] + 2;
    state.registers[Register.SP] -= 1;
    // The IP will be incremented by 2 after this instruction has been executed, so
    // we have to bring it back by 2 places.
    state.registers[Register.IP] = operands[0] - 2;
    break;
  case Opcode.RET:
    {
      state.registers[Register.SP] += 1;
      const returnAddr = state.memory[state.registers[Register.SP]];
      // This IP will be incremented by 1 after this instruction, so we have to offset
      // the return address.
      state.registers[Register.IP] = returnAddr - 1;
    }
    break;
  case Opcode.CLI:
    state.registers[Register.SR] &= ~32;
    break;
  case Opcode.STI:
    state.registers[Register.SR] |= 32;
    break;
  case Opcode.JMP:
  case Opcode.JS:
  case Opcode.JNS:
  case Opcode.JZ:
  case Opcode.JNZ:
    if (predicateFunctionFor[opcode](state.registers[Register.SR])) {
      // Offset by 2 because this instruction occupies 2 bytes, so the IP will be
      // incremented by 2 bytes when it is finished.
      state.registers[Register.IP] = operands[0] - 2;
    }
    break;
  case Opcode.IN:
    {
      const device = devices.filter((dev) => dev.id === operands[0])[0];
      if (typeof device === 'undefined') {
        throw new NoSuchDeviceError(operands[0]);
      }
      state.registers[Register.AL] = device.output(device);
    }
    break;
  case Opcode.OUT:
    {
      const device = devices.filter((dev) => dev.id === operands[0])[0];
      if (typeof device === 'undefined') {
        throw new NoSuchDeviceError(operands[0]);
      }
      const newDevice = device.input(device, state.registers[Register.AL]);
      for (let i = 0; i < devices.length; i += 1) {
        if (devices[i].id === device.id) {
          devices[i] = newDevice;
          break;
        }
      }
    }
    break;
  default:
    throw new Error('Well, well, well. Here we are. Some idiot^W^W^W^W^W developer has forgotten '
                    + 'to add their new opcode to the executeInstruction function. If we were using '
                    + 'a half decent programming language, we probably could\'ve caught this at '
                    + 'compile time! But alas, we are not.');
  }
}

function getAwaitingDevice(devices: DeviceState[]): null | number {
  // We pick the first device that is awaiting an interrupt.
  for (let i = 0; i < devices.length; i += 1) {
    if (devices[i].requestingInterrupt) {
      return i;
    }
  }
  return null;
}

function executeNextInstruction(state: State, devices: DeviceState[]): void {
  const [opcode, operands] = fetchNextInstruction(state);
  executeInstruction(state, devices, opcode, operands);
  // The number of operands plus the opcode.
  state.registers[Register.IP] += operands.length + 1;
}

function handleInterrupt(state: State, device: DeviceState): void {
  // Push the current position, then jump to the new one.
  state.memory[state.registers[Register.SP]] = state.registers[Register.IP];
  state.registers[Register.SP] -= 1;
  // The device's ID is used to work out where the interrupt routine's address
  // is located.
  state.registers[Register.IP] = state.memory[device.id];
  device.requestingInterrupt = false;
}

export function step(state: State, devices: DeviceState[]): void {
  const awaitingDeviceIndex = getAwaitingDevice(devices);
  const interruptFlag = state.registers[Register.SR] & 32;
  if (interruptFlag === 0 || awaitingDeviceIndex === null) {
    executeNextInstruction(state, devices);
  } else {
    handleInterrupt(state, devices[awaitingDeviceIndex]);
  }
}
