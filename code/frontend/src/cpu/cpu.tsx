/* eslint-disable no-bitwise */
import { Register, Opcode } from '../instructionset/instructionset';

class CPU {
    byteCode: number[]

    RAM: Uint8Array

    registers: Uint8Array

    instructionSet: { [key: string]: () => void } = {
      [Opcode.NOP]: () => {},
      [Opcode.MOV_REG_REG]: this.MOV_REG_REG,
      [Opcode.MOV_REG_MEMABS]: this.MOV_REG_MEMABS,
      [Opcode.MOV_REG_MEMREGOFFSET]: this.MOV_REG_MEMREGOFFSET,
      [Opcode.MOV_REG_INT]: this.MOV_REG_INT,
      [Opcode.MOV_MEMABS_REG]: this.MOV_MEMABS_REG,
      [Opcode.MOV_MEMREGOFFSET_REG]: this.MOV_MEMREGOFFSET_REG,
      [Opcode.MOV_MEMABS_INT]: this.MOV_MEMABS_INT,
      [Opcode.MOV_MEMREGOFFSET_INT]: this.MOV_MEMREGOFFSET_INT,
      [Opcode.ADD_REG_REG]: this.ADD_REG_REG,
      [Opcode.ADD_REG_INT]: this.ADD_REG_INT,
      [Opcode.SUB_REG_REG]: this.SUB_REG_REG,
      [Opcode.SUB_REG_INT]: this.SUB_REG_INT,
      [Opcode.MUL_REG_REG]: this.MUL_REG_REG,
      [Opcode.MUL_REG_INT]: this.MUL_REG_INT,
      [Opcode.DIV_REG_REG]: this.DIV_REG_REG,
      [Opcode.DIV_REG_INT]: this.DIV_REG_INT,
      [Opcode.AND_REG_REG]: this.AND_REG_REG,
      [Opcode.AND_REG_INT]: this.AND_REG_INT,
      [Opcode.OR_REG_REG]: this.OR_REG_REG,
      [Opcode.OR_REG_INT]: this.OR_REG_INT,
      [Opcode.XOR_REG_REG]: this.XOR_REG_REG,
      [Opcode.XOR_REG_INT]: this.XOR_REG_INT,
      [Opcode.CMP_REG_REG]: this.CMP_REG_REG,
      [Opcode.CMP_REG_INT]: this.CMP_REG_INT,
      [Opcode.NOT]: this.NOT,
      [Opcode.PUSH]: this.PUSH,
      [Opcode.POP]: this.POP,
    }

    constructor(byteCode: number[]) {
      this.byteCode = byteCode;
      console.log(byteCode, "Hey it's me the simulator!");
      this.registers = new Uint8Array(7).fill(0);
      this.registers[Register.SP] = 255;
      this.RAM = new Uint8Array(256);
      this.RAM.set(byteCode);
      console.log(this.RAM);
    }

    step() {
      const instruction: number = this.RAM[this.registers[Register.IP]];
      this.instructionSet[instruction].bind(this)();
      this.registers[Register.IP] += 1;
    }

    // Instructions

    // MOV

    MOV_REG_REG(): void {
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[Register.IP] += 1;
      const SECONDARY_REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[REG] = this.registers[SECONDARY_REG];
    }

    MOV_REG_MEMABS(): void {
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[Register.IP] += 1;
      const MEM = this.RAM[this.registers[Register.IP]];
      this.registers[REG] = this.RAM[MEM];
    }

    MOV_REG_MEMREGOFFSET(): void {
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[Register.IP] += 1;
      const MEM = this.offset(this.RAM[this.registers[Register.IP]]);
      this.registers[REG] = this.RAM[MEM];
    }

    MOV_REG_INT(): void {
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[Register.IP] += 1;
      const INT = this.RAM[this.registers[Register.IP]];
      this.registers[REG] = INT;
    }

    MOV_MEMABS_REG(): void {
      this.registers[Register.IP] += 1;
      const MEM: number = this.RAM[this.registers[Register.IP]];
      this.registers[Register.IP] += 1;
      const REG = this.RAM[this.registers[Register.IP]];
      this.RAM[MEM] = this.registers[REG];
    }

    MOV_MEMREGOFFSET_REG(): void {
      this.registers[Register.IP] += 1;
      const MEM = this.offset(this.RAM[this.registers[Register.IP]]);
      this.registers[Register.IP] += 1;
      const REG = this.RAM[this.registers[Register.IP]];
      this.RAM[MEM] = this.registers[REG];
    }

    MOV_MEMABS_INT(): void {
      this.registers[Register.IP] += 1;
      const MEM: number = this.RAM[this.registers[Register.IP]];
      this.registers[Register.IP] += 1;
      const INT = this.RAM[this.registers[Register.IP]];
      this.RAM[MEM] = INT;
    }

    MOV_MEMREGOFFSET_INT(): void {
      this.registers[Register.IP] += 1;
      const MEM = this.offset(this.RAM[this.registers[Register.IP]]);
      this.registers[Register.IP] += 1;
      const INT = this.RAM[this.registers[Register.IP]];
      this.RAM[MEM] = INT;
    }

    // Arithmetic

    ADD_REG_REG(): void {
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[Register.IP] += 1;
      const SECONDARY_REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[REG] += this.registers[SECONDARY_REG];
    }

    ADD_REG_INT(): void {
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[Register.IP] += 1;
      const INT: number = this.RAM[this.registers[Register.IP]];
      this.registers[REG] += INT;
    }

    SUB_REG_REG(): void {
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[Register.IP] += 1;
      const SECONDARY_REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[REG] -= this.registers[SECONDARY_REG];
    }

    SUB_REG_INT(): void {
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[Register.IP] += 1;
      const INT: number = this.RAM[this.registers[Register.IP]];
      this.registers[REG] -= INT;
    }

    MUL_REG_REG(): void {
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[Register.IP] += 1;
      const SECONDARY_REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[REG] *= this.registers[SECONDARY_REG];
    }

    MUL_REG_INT(): void {
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[Register.IP] += 1;
      const INT: number = this.RAM[this.registers[Register.IP]];
      this.registers[REG] *= INT;
    }

    DIV_REG_REG(): void {
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[Register.IP] += 1;
      const SECONDARY_REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[REG] /= this.registers[SECONDARY_REG];
      this.registers[REG] = Math.floor(this.registers[REG]);
    }

    DIV_REG_INT(): void {
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[Register.IP] += 1;
      const INT: number = this.RAM[this.registers[Register.IP]];
      this.registers[REG] /= INT;
      this.registers[REG] = Math.floor(this.registers[REG]);
    }

    // Bitwise

    AND_REG_REG(): void {
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[Register.IP] += 1;
      const SECONDARY_REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[REG] &= this.registers[SECONDARY_REG];
    }

    AND_REG_INT(): void {
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[Register.IP] += 1;
      const INT: number = this.RAM[this.registers[Register.IP]];
      this.registers[REG] &= INT;
    }

    OR_REG_REG(): void {
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[Register.IP] += 1;
      const SECONDARY_REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[REG] |= this.registers[SECONDARY_REG];
    }

    OR_REG_INT(): void {
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[Register.IP] += 1;
      const INT: number = this.RAM[this.registers[Register.IP]];
      this.registers[REG] |= INT;
    }

    XOR_REG_REG(): void {
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[Register.IP] += 1;
      const SECONDARY_REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[REG] ^= this.registers[SECONDARY_REG];
    }

    XOR_REG_INT(): void {
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[Register.IP] += 1;
      const INT: number = this.RAM[this.registers[Register.IP]];
      this.registers[REG] ^= INT;
    }

    NOT(): void {
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      const notted = ~this.registers[REG];
      this.registers[REG] = notted;
    }

    // Comparison

    CMP_REG_REG(): void {
      this.unsetSignFlag();
      this.unsetZeroFlag();
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[Register.IP] += 1;
      const SECONDARY_REG: number = this.RAM[this.registers[Register.IP]];
      const test = this.registers[REG] - this.registers[SECONDARY_REG];
      if (test === 0) {
        this.setZeroFlag();
      } else if (test < 0) {
        this.setSignFlag();
      }
    }

    CMP_REG_INT(): void {
      this.unsetSignFlag();
      this.unsetZeroFlag();
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[Register.IP] += 1;
      const INT: number = this.RAM[this.registers[Register.IP]];
      const test = this.registers[REG] - INT;
      if (test === 0) {
        this.setZeroFlag();
      } else if (test < 0) {
        this.setSignFlag();
      }
    }

    // Stack

    PUSH(): void {
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      this.RAM[this.registers[Register.SP]] = this.registers[REG];
      this.registers[Register.SP] -= 1;
    }

    // Todo(Fraz): Handle stack underflows?
    POP(): void {
      this.registers[Register.IP] += 1;
      const REG: number = this.RAM[this.registers[Register.IP]];
      this.registers[REG] = this.RAM[this.registers[Register.SP]];
      this.registers[Register.SP] += 1;
    }

    // Devices

    // Jumps

    // Interrupts

    // Utils

    setSignFlag(): void {
      this.registers[Register.SR] |= 128;
    }

    unsetSignFlag(): void {
      this.registers[Register.SR] &= 127;
    }

    setZeroFlag(): void {
      this.registers[Register.SR] |= 64;
    }

    unsetZeroFlag(): void {
      this.registers[Register.SR] &= 191;
    }

    // 8080 didn't have an interrupt flag so using |= 32 ¯\_(ツ)_/¯
    setInterruptFlag(): void {
      this.registers[Register.SR] |= 32;
    }

    unsetInterruptFlag(): void {
      this.registers[Register.SR] &= 223;
    }

    offset(val: number): number {
      const offset: number = val & 0b00011111;
      const register: number = val >> 5;
      const value: number = this.registers[register] + offset;
      return value;
    }
}

export default CPU;
