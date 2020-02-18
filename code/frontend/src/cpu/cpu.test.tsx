import CPU from './cpu';
import { Register } from '../instructionset/instructionset';

test('initialize values correctly', () => {
  const byteCode = [5, 0, 11];
  const cpu: CPU = new CPU(byteCode);
  const expectedRegisters = new Uint8Array(7);
  expectedRegisters[Register.SP] = 255;
  expect(cpu.registers).toStrictEqual(expectedRegisters);
  expect(cpu.byteCode).toStrictEqual(byteCode);
  expect(cpu.RAM.length).toBe(256);
});

// Move instructions

test('move instruction with register, register', () => {
  const byteCode = [2, 0, 1];
  const cpu: CPU = new CPU(byteCode);
  cpu.registers[1] = 6;
  cpu.step();
  expect(cpu.registers[0]).toBe(6);
});

test('move instruction with register, absolute memory', () => {
  const byteCode = [3, 0, 2];
  const cpu: CPU = new CPU(byteCode);
  cpu.step();
  expect(cpu.registers[0]).toBe(2);
});

test('move instruction with register, register memory offset', () => {
  const byteCode = [4, 0, 38, 0, 0, 0, 0, 9];
  const cpu: CPU = new CPU(byteCode);
  cpu.registers[1] = 1;
  cpu.step();
  expect(cpu.offset(38)).toBe(7);
  expect(cpu.registers[0]).toBe(9);
});

test('move instruction with register, integer', () => {
  const byteCode = [5, 0, 129];
  const cpu: CPU = new CPU(byteCode);
  cpu.step();
  expect(cpu.registers[0]).toBe(129);
});

test('move instruction with absolute memory, register', () => {
  const byteCode = [6, 0, 0];
  const cpu: CPU = new CPU(byteCode);
  cpu.registers[0] = 7;
  cpu.step();
  expect(cpu.RAM[0]).toBe(7);
});

test('move instruction with register memory offset, register', () => {
  const byteCode = [7, 33, 0, 0, 0, 0, 0];
  const cpu: CPU = new CPU(byteCode);
  cpu.registers[0] = 4;
  cpu.registers[1] = 4;
  expect(cpu.offset(33)).toBe(5);
  cpu.step();
  expect(cpu.RAM[5]).toBe(4);
});

test('move instruction with absolute memory, integer', () => {
  const byteCode = [8, 3, 99];
  const cpu: CPU = new CPU(byteCode);
  cpu.step();
  expect(cpu.RAM[3]).toBe(99);
});

test('move instruction with register memory offset, integer', () => {
  const byteCode = [9, 33, 123];
  const cpu: CPU = new CPU(byteCode);
  cpu.step();
  expect(cpu.RAM[1]).toBe(123);
});

// Arithmetic

test('add instruction with register, register', () => {
  const byteCode = [10, 0, 1];
  const cpu: CPU = new CPU(byteCode);
  cpu.registers[0] = 2;
  cpu.registers[1] = 4;
  cpu.step();
  expect(cpu.registers[0]).toBe(6);
});

test('add instruction with register, integer', () => {
  const byteCode = [11, 0, 11];
  const cpu: CPU = new CPU(byteCode);
  cpu.registers[0] = 2;
  cpu.step();
  expect(cpu.registers[0]).toBe(13);
});

test('sub instruction with register, register', () => {
  const byteCode = [12, 0, 1];
  const cpu: CPU = new CPU(byteCode);
  cpu.registers[0] = 10;
  cpu.registers[1] = 4;
  cpu.step();
  expect(cpu.registers[0]).toBe(6);
});

test('sub instruction with register, integer', () => {
  const byteCode = [13, 0, 9];
  const cpu: CPU = new CPU(byteCode);
  cpu.registers[0] = 10;
  cpu.step();
  expect(cpu.registers[0]).toBe(1);
});

test('mul instruction with register, register', () => {
  const byteCode = [14, 0, 1];
  const cpu: CPU = new CPU(byteCode);
  cpu.registers[0] = 10;
  cpu.registers[1] = 4;
  cpu.step();
  expect(cpu.registers[0]).toBe(40);
});

test('mul instruction with register, integer', () => {
  const byteCode = [15, 0, 9];
  const cpu: CPU = new CPU(byteCode);
  cpu.registers[0] = 10;
  cpu.step();
  expect(cpu.registers[0]).toBe(90);
});

test('div instruction with register, register', () => {
  const byteCode = [16, 0, 1];
  const cpu: CPU = new CPU(byteCode);
  cpu.registers[0] = 10;
  cpu.registers[1] = 5;
  cpu.step();
  expect(cpu.registers[0]).toBe(2);
});

test('div instruction with register, integer', () => {
  const byteCode = [17, 0, 5];
  const cpu: CPU = new CPU(byteCode);
  cpu.registers[0] = 16;
  cpu.step();
  expect(cpu.registers[0]).toBe(3);
});

// Bitwise Logic

test('and instruction with register, register', () => {
  const byteCode = [18, 0, 1];
  const cpu: CPU = new CPU(byteCode);
  cpu.registers[0] = 240;
  cpu.registers[1] = 60;
  cpu.step();
  expect(cpu.registers[0]).toBe(48);
});

test('and instruction with register, integer', () => {
  const byteCode = [19, 0, 60];
  const cpu: CPU = new CPU(byteCode);
  cpu.registers[0] = 240;
  cpu.step();
  expect(cpu.registers[0]).toBe(48);
});

test('or instruction with register, register', () => {
  const byteCode = [20, 0, 1];
  const cpu: CPU = new CPU(byteCode);
  cpu.registers[0] = 224;
  cpu.registers[1] = 48;
  cpu.step();
  expect(cpu.registers[0]).toBe(240);
});

test('or instruction with register, integer', () => {
  const byteCode = [21, 0, 48];
  const cpu: CPU = new CPU(byteCode);
  cpu.registers[0] = 224;
  cpu.step();
  expect(cpu.registers[0]).toBe(240);
});

test('xor instruction with register, register', () => {
  const byteCode = [22, 0, 1];
  const cpu: CPU = new CPU(byteCode);
  cpu.registers[0] = 224;
  cpu.registers[1] = 48;
  cpu.step();
  expect(cpu.registers[0]).toBe(208);
});

test('xor instruction with register, integer', () => {
  const byteCode = [23, 0, 48];
  const cpu: CPU = new CPU(byteCode);
  cpu.registers[0] = 224;
  cpu.step();
  expect(cpu.registers[0]).toBe(208);
});

test('not instruction with register', () => {
  const byteCode = [26, 0];
  const cpu: CPU = new CPU(byteCode);
  cpu.registers[0] = 224;
  cpu.step();
  expect(cpu.registers[0]).toBe(31);
});

// Comparison

test('cmp instruction with register, register', () => {
  const byteCode = [24, 0, 1];
  const cpu: CPU = new CPU(byteCode);
  cpu.registers[0] = 224;
  cpu.registers[1] = 224;
  cpu.step();
  expect(cpu.registers[Register.SR]).toBe(64);
  cpu.registers[Register.SR] = 0;
  cpu.registers[1] = 225;
  cpu.registers[Register.IP] = 0;
  cpu.step();
  expect(cpu.registers[Register.SR]).toBe(128);
});


test('cmp instruction with register, integer', () => {
  const byteCode = [25, 0, 224];
  const cpu: CPU = new CPU(byteCode);
  cpu.registers[0] = 224;
  cpu.step();
  expect(cpu.registers[Register.SR]).toBe(64);
  cpu.registers[Register.SR] = 0;
  cpu.RAM[2] = 225;
  cpu.registers[Register.IP] = 0;
  cpu.step();
  expect(cpu.registers[Register.SR]).toBe(128);
});

// utils

it('sets the sign flag', () => {
  const cpu: CPU = new CPU([]);
  expect(cpu.registers[Register.SR]).toBe(0);
  cpu.setSignFlag();
  expect(cpu.registers[Register.SR]).toBe(128);
});

it('unsets the sign flag', () => {
  const cpu: CPU = new CPU([]);
  cpu.registers[Register.SR] = 129;
  cpu.unsetSignFlag();
  expect(cpu.registers[Register.SR]).toBe(1);
});

it('sets the zero flag', () => {
  const cpu: CPU = new CPU([]);
  expect(cpu.registers[Register.SR]).toBe(0);
  cpu.setZeroFlag();
  expect(cpu.registers[Register.SR]).toBe(64);
});

it('unsets the zero flag', () => {
  const cpu: CPU = new CPU([]);
  cpu.registers[Register.SR] = 65;
  cpu.unsetZeroFlag();
  expect(cpu.registers[Register.SR]).toBe(1);
});
