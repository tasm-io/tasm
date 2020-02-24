import { inspect } from 'util';
import { SyntaxError, parse } from './parser';

// TODO(cmgn): Improve the test suite. Table-driven tests might be worth a shot.

it('parses a full program', () => {
  const program = `
  byte 'x'
  byte 0
  ascii "Hey"
  asciiz "ello"
  break
  org 10
  byte 5
  org 0
  mov al, 100
  ret
  iret
  ; heyo
  mov [al+3], 4
  mov [al], 3
  mov [X], 3
  mov al, [al+3]
  mov bl, [al]
  mov cl, [40]`;
  const expected = `Block {
  source: { offset: 0, line: 1, column: 1 },
  statements: [
    Byte {
      source: { offset: 3, line: 2, column: 3 },
      value: Character {
        source: { offset: 8, line: 2, column: 8 },
        value: 'x'
      }
    },
    Byte {
      source: { offset: 14, line: 3, column: 3 },
      value: Integer { source: { offset: 19, line: 3, column: 8 }, value: 0 }
    },
    Ascii { source: { offset: 23, line: 4, column: 3 }, value: 'Hey' },
    Asciiz {
      source: { offset: 37, line: 5, column: 3 },
      value: 'ello'
    },
    Break { source: { offset: 53, line: 6, column: 3 } },
    Org {
      source: { offset: 61, line: 7, column: 3 },
      addr: Integer { source: { offset: 65, line: 7, column: 7 }, value: 10 }
    },
    Byte {
      source: { offset: 70, line: 8, column: 3 },
      value: Integer { source: { offset: 75, line: 8, column: 8 }, value: 5 }
    },
    Org {
      source: { offset: 79, line: 9, column: 3 },
      addr: Integer { source: { offset: 83, line: 9, column: 7 }, value: 0 }
    },
    Instruction {
      source: { offset: 87, line: 10, column: 3 },
      opcode: 'mov',
      operands: [
        Register {
          source: { offset: 91, line: 10, column: 7 },
          name: 'al'
        },
        Integer {
          source: { offset: 95, line: 10, column: 11 },
          value: 100
        }
      ]
    },
    Instruction {
      source: { offset: 101, line: 11, column: 3 },
      opcode: 'ret',
      operands: null
    },
    Instruction {
      source: { offset: 107, line: 12, column: 3 },
      opcode: 'iret',
      operands: null
    },
    Instruction {
      source: { offset: 123, line: 14, column: 3 },
      opcode: 'mov',
      operands: [
        RegisterOffsetAddress {
          source: { offset: 127, line: 14, column: 7 },
          register: Register {
            source: { offset: 128, line: 14, column: 8 },
            name: 'al'
          },
          offset: Integer {
            source: { offset: 131, line: 14, column: 11 },
            value: 3
          }
        },
        Integer {
          source: { offset: 135, line: 14, column: 15 },
          value: 4
        }
      ]
    },
    Instruction {
      source: { offset: 139, line: 15, column: 3 },
      opcode: 'mov',
      operands: [
        RegisterAddress {
          source: { offset: 143, line: 15, column: 7 },
          register: Register {
            source: { offset: 144, line: 15, column: 8 },
            name: 'al'
          }
        },
        Integer {
          source: { offset: 149, line: 15, column: 13 },
          value: 3
        }
      ]
    },
    Instruction {
      source: { offset: 153, line: 16, column: 3 },
      opcode: 'mov',
      operands: [
        RegisterAddress {
          source: { offset: 157, line: 16, column: 7 },
          register: Identifier {
            source: { offset: 158, line: 16, column: 8 },
            name: 'X'
          }
        },
        Integer {
          source: { offset: 162, line: 16, column: 12 },
          value: 3
        }
      ]
    },
    Instruction {
      source: { offset: 166, line: 17, column: 3 },
      opcode: 'mov',
      operands: [
        Register {
          source: { offset: 170, line: 17, column: 7 },
          name: 'al'
        },
        RegisterOffsetAddress {
          source: { offset: 174, line: 17, column: 11 },
          register: Register {
            source: { offset: 175, line: 17, column: 12 },
            name: 'al'
          },
          offset: Integer {
            source: { offset: 178, line: 17, column: 15 },
            value: 3
          }
        }
      ]
    },
    Instruction {
      source: { offset: 183, line: 18, column: 3 },
      opcode: 'mov',
      operands: [
        Register {
          source: { offset: 187, line: 18, column: 7 },
          name: 'bl'
        },
        RegisterAddress {
          source: { offset: 191, line: 18, column: 11 },
          register: Register {
            source: { offset: 192, line: 18, column: 12 },
            name: 'al'
          }
        }
      ]
    },
    Instruction {
      source: { offset: 198, line: 19, column: 3 },
      opcode: 'mov',
      operands: [
        Register {
          source: { offset: 202, line: 19, column: 7 },
          name: 'cl'
        },
        DirectAddress {
          source: { offset: 206, line: 19, column: 11 },
          value: Integer {
            source: { offset: 207, line: 19, column: 12 },
            value: 40
          }
        }
      ]
    }
  ]
}`;
  expect(inspect(parse(program), false, null, false)).toBe(expected);
});

it('rejects an invalid program', () => {
  const program = 'mov al, [bl';
  expect(() => parse(program)).toThrow(SyntaxError);
});
