/* eslint-disable no-unused-vars */

// Operand represnts an operand to an instruction.
export enum Operand {
  MEMORY,
  MEMORY_REGISTER_OFFSET,
  REGISTER,
  INTEGER,
}

// Opcode represents the opcode for an instruction.
export enum Opcode {
  HALT = 0,
  NOP = 1,
  MOV_REG_REG = 2,
  MOV_REG_MEMABS = 3,
  MOV_REG_MEMREGOFFSET = 4,
  MOV_REG_INT = 5,
  MOV_MEMABS_REG = 6,
  MOV_MEMREGOFFSET_REG = 7,
  MOV_MEMABS_INT = 8,
  MOV_MEMREGOFFSET_INT = 9,
  ADD_REG_REG = 10,
  ADD_REG_INT = 11,
  SUB_REG_REG = 12,
  SUB_REG_INT = 13,
  MUL_REG_REG = 14,
  MUL_REG_INT = 15,
  DIV_REG_REG = 16,
  DIV_REG_INT = 17,
  AND_REG_REG = 18,
  AND_REG_INT = 19,
  OR_REG_REG = 20,
  OR_REG_INT = 21,
  XOR_REG_REG = 22,
  XOR_REG_INT = 23,
  CMP_REG_REG = 24,
  CMP_REG_INT = 25,
  NOT = 26,
  PUSH = 27,
  POP = 28,
  IN = 29,
  OUT = 30,
  CALL = 31,
  JMP = 32,
  JS = 33,
  JNS = 34,
  JZ = 35,
  JNZ = 36,
  RET = 37,
  CLI = 38,
  STI = 39,
}

export const OpcodeMapping: { [key: string]: Opcode[] } = {
  halt: [Opcode.HALT],
  nop: [Opcode.NOP],
  mov: [
    Opcode.MOV_REG_REG,
    Opcode.MOV_REG_MEMABS,
    Opcode.MOV_REG_MEMREGOFFSET,
    Opcode.MOV_REG_INT,
    Opcode.MOV_MEMABS_REG,
    Opcode.MOV_MEMREGOFFSET_REG,
    Opcode.MOV_MEMABS_INT,
    Opcode.MOV_MEMREGOFFSET_INT,
  ],
  add: [Opcode.ADD_REG_REG, Opcode.ADD_REG_INT],
  sub: [Opcode.SUB_REG_REG, Opcode.SUB_REG_INT],
  mul: [Opcode.MUL_REG_REG, Opcode.MUL_REG_INT],
  div: [Opcode.DIV_REG_REG, Opcode.DIV_REG_INT],
  and: [Opcode.AND_REG_REG, Opcode.AND_REG_INT],
  or: [Opcode.OR_REG_REG, Opcode.OR_REG_INT],
  xor: [Opcode.XOR_REG_REG, Opcode.XOR_REG_INT],
  cmp: [Opcode.CMP_REG_REG, Opcode.CMP_REG_INT],
  not: [Opcode.NOT],
  push: [Opcode.PUSH],
  pop: [Opcode.POP],
  in: [Opcode.IN],
  out: [Opcode.OUT],
  call: [Opcode.CALL],
  jmp: [Opcode.JMP],
  js: [Opcode.JS],
  jns: [Opcode.JNS],
  jz: [Opcode.JZ],
  jnz: [Opcode.JNZ],
  ret: [Opcode.RET],
  cli: [Opcode.CLI],
  sti: [Opcode.STI],
};

// OperandTypes maps each opcode to its operand's types.
export const OperandTypes = {
  [Opcode.HALT]: [],
  [Opcode.NOP]: [],
  [Opcode.MOV_REG_REG]: [Operand.REGISTER, Operand.REGISTER],
  [Opcode.MOV_REG_MEMABS]: [Operand.REGISTER, Operand.MEMORY],
  [Opcode.MOV_REG_MEMREGOFFSET]: [Operand.REGISTER, Operand.MEMORY_REGISTER_OFFSET],
  [Opcode.MOV_REG_INT]: [Operand.REGISTER, Operand.INTEGER],
  [Opcode.MOV_MEMABS_REG]: [Operand.MEMORY, Operand.REGISTER],
  [Opcode.MOV_MEMREGOFFSET_REG]: [Operand.MEMORY_REGISTER_OFFSET, Operand.REGISTER],
  [Opcode.MOV_MEMABS_INT]: [Operand.MEMORY, Operand.INTEGER],
  [Opcode.MOV_MEMREGOFFSET_INT]: [Operand.MEMORY_REGISTER_OFFSET, Operand.INTEGER],
  [Opcode.ADD_REG_REG]: [Operand.REGISTER, Operand.REGISTER],
  [Opcode.ADD_REG_INT]: [Operand.REGISTER, Operand.INTEGER],
  [Opcode.SUB_REG_REG]: [Operand.REGISTER, Operand.REGISTER],
  [Opcode.SUB_REG_INT]: [Operand.REGISTER, Operand.INTEGER],
  [Opcode.MUL_REG_REG]: [Operand.REGISTER, Operand.REGISTER],
  [Opcode.MUL_REG_INT]: [Operand.REGISTER, Operand.INTEGER],
  [Opcode.DIV_REG_REG]: [Operand.REGISTER, Operand.REGISTER],
  [Opcode.DIV_REG_INT]: [Operand.REGISTER, Operand.INTEGER],
  [Opcode.AND_REG_REG]: [Operand.REGISTER, Operand.REGISTER],
  [Opcode.AND_REG_INT]: [Operand.REGISTER, Operand.INTEGER],
  [Opcode.OR_REG_REG]: [Operand.REGISTER, Operand.REGISTER],
  [Opcode.OR_REG_INT]: [Operand.REGISTER, Operand.INTEGER],
  [Opcode.XOR_REG_REG]: [Operand.REGISTER, Operand.REGISTER],
  [Opcode.XOR_REG_INT]: [Operand.REGISTER, Operand.INTEGER],
  [Opcode.CMP_REG_REG]: [Operand.REGISTER, Operand.REGISTER],
  [Opcode.CMP_REG_INT]: [Operand.REGISTER, Operand.INTEGER],
  [Opcode.NOT]: [Operand.REGISTER],
  [Opcode.PUSH]: [Operand.REGISTER],
  [Opcode.POP]: [Operand.REGISTER],
  [Opcode.IN]: [Operand.INTEGER],
  [Opcode.OUT]: [Operand.INTEGER],
  [Opcode.CALL]: [Operand.INTEGER],
  [Opcode.JMP]: [Operand.INTEGER],
  [Opcode.JS]: [Operand.INTEGER],
  [Opcode.JNS]: [Operand.INTEGER],
  [Opcode.JZ]: [Operand.INTEGER],
  [Opcode.JNZ]: [Operand.INTEGER],
  [Opcode.RET]: [],
  [Opcode.CLI]: [],
  [Opcode.STI]: [],
};

// Register represents a register operand type.
export enum Register {
  AL = 0,
  BL = 1,
  CL = 2,
  DL = 3,
  SP = 4,
  SR = 5,
  IP = 6,
}
