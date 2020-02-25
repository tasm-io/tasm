import { inspect } from 'util';
import { SyntaxError, parse } from './parser';

// TODO(cmgn): Improve the test suite. Table-driven tests might be worth a shot.

it('parses a full program', () => {
  const program = `
  byte 'x'
  byte 0
  ascii "Hey"
  asciiz "ello"
  break\r\n
  org 10
  byte 5
  org 0
  mov al, 100\r
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
      source: { offset: 63, line: 8, column: 3 },
      addr: Integer { source: { offset: 67, line: 8, column: 7 }, value: 10 }
    },
    Byte {
      source: { offset: 72, line: 9, column: 3 },
      value: Integer { source: { offset: 77, line: 9, column: 8 }, value: 5 }
    },
    Org {
      source: { offset: 81, line: 10, column: 3 },
      addr: Integer { source: { offset: 85, line: 10, column: 7 }, value: 0 }
    },
    Instruction {
      source: { offset: 89, line: 11, column: 3 },
      opcode: 'mov',
      operands: [
        Register {
          source: { offset: 93, line: 11, column: 7 },
          name: 'al'
        },
        Integer {
          source: { offset: 97, line: 11, column: 11 },
          value: 100
        }
      ]
    },
    Instruction {
      source: { offset: 104, line: 12, column: 3 },
      opcode: 'ret',
      operands: []
    },
    Instruction {
      source: { offset: 110, line: 13, column: 3 },
      opcode: 'iret',
      operands: []
    },
    Instruction {
      source: { offset: 126, line: 15, column: 3 },
      opcode: 'mov',
      operands: [
        RegisterOffsetAddress {
          source: { offset: 130, line: 15, column: 7 },
          register: Register {
            source: { offset: 131, line: 15, column: 8 },
            name: 'al'
          },
          offset: Integer {
            source: { offset: 134, line: 15, column: 11 },
            value: 3
          }
        },
        Integer {
          source: { offset: 138, line: 15, column: 15 },
          value: 4
        }
      ]
    },
    Instruction {
      source: { offset: 142, line: 16, column: 3 },
      opcode: 'mov',
      operands: [
        RegisterAddress {
          source: { offset: 146, line: 16, column: 7 },
          register: Register {
            source: { offset: 147, line: 16, column: 8 },
            name: 'al'
          }
        },
        Integer {
          source: { offset: 152, line: 16, column: 13 },
          value: 3
        }
      ]
    },
    Instruction {
      source: { offset: 156, line: 17, column: 3 },
      opcode: 'mov',
      operands: [
        RegisterAddress {
          source: { offset: 160, line: 17, column: 7 },
          register: Identifier {
            source: { offset: 161, line: 17, column: 8 },
            name: 'X'
          }
        },
        Integer {
          source: { offset: 165, line: 17, column: 12 },
          value: 3
        }
      ]
    },
    Instruction {
      source: { offset: 169, line: 18, column: 3 },
      opcode: 'mov',
      operands: [
        Register {
          source: { offset: 173, line: 18, column: 7 },
          name: 'al'
        },
        RegisterOffsetAddress {
          source: { offset: 177, line: 18, column: 11 },
          register: Register {
            source: { offset: 178, line: 18, column: 12 },
            name: 'al'
          },
          offset: Integer {
            source: { offset: 181, line: 18, column: 15 },
            value: 3
          }
        }
      ]
    },
    Instruction {
      source: { offset: 186, line: 19, column: 3 },
      opcode: 'mov',
      operands: [
        Register {
          source: { offset: 190, line: 19, column: 7 },
          name: 'bl'
        },
        RegisterAddress {
          source: { offset: 194, line: 19, column: 11 },
          register: Register {
            source: { offset: 195, line: 19, column: 12 },
            name: 'al'
          }
        }
      ]
    },
    Instruction {
      source: { offset: 201, line: 20, column: 3 },
      opcode: 'mov',
      operands: [
        Register {
          source: { offset: 205, line: 20, column: 7 },
          name: 'cl'
        },
        DirectAddress {
          source: { offset: 209, line: 20, column: 11 },
          value: Integer {
            source: { offset: 210, line: 20, column: 12 },
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
