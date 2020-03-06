import { inspect } from 'util';
import { SyntaxError, parse } from './parser';

// TODO(cmgn): Improve the test suite. Table-driven tests might be worth a shot.

it('parses a full program', () => {
  const program = `   byte 'x'  
  byte 0
  ascii "Hey"  
  asciiz "ello"  
  break\r\n
  org 10     ; inline boi
  byte 5    
  org 0
  foo: bar: baz: asciiz "hello"
  boo: goo: mov al, 100\r
  ret;hello!
  iret    
  ; heyo  
  mov [al+3], 4
  mov [al], 3
  mov [X], 3
  mov al, [al+3]
  mov bl, [al]
  mov   cl,   [40]    \n  `;
  const expectedOutput = `Block {
  source: { offset: 0, line: 1, column: 1 },
  statements: [
    Block {
      source: { offset: 3, line: 1, column: 4 },
      statements: [
        Byte {
          source: { offset: 3, line: 1, column: 4 },
          value: Character {
            source: { offset: 8, line: 1, column: 9 },
            value: 'x'
          }
        },
        Byte {
          source: { offset: 16, line: 2, column: 3 },
          value: Integer {
            source: { offset: 21, line: 2, column: 8 },
            value: 0
          }
        },
        Ascii {
          source: { offset: 25, line: 3, column: 3 },
          value: 'Hey'
        },
        Asciiz {
          source: { offset: 41, line: 4, column: 3 },
          value: 'ello'
        },
        Break { source: { offset: 59, line: 5, column: 3 } },
        Org {
          source: { offset: 69, line: 7, column: 3 },
          addr: Integer {
            source: { offset: 73, line: 7, column: 7 },
            value: 10
          }
        },
        Byte {
          source: { offset: 95, line: 8, column: 3 },
          value: Integer {
            source: { offset: 100, line: 8, column: 8 },
            value: 5
          }
        },
        Org {
          source: { offset: 108, line: 9, column: 3 },
          addr: Integer {
            source: { offset: 112, line: 9, column: 7 },
            value: 0
          }
        },
        Label {
          source: { offset: 116, line: 10, column: 3 },
          name: 'foo'
        },
        Label {
          source: { offset: 121, line: 10, column: 8 },
          name: 'bar'
        },
        Label {
          source: { offset: 126, line: 10, column: 13 },
          name: 'baz'
        },
        Asciiz {
          source: { offset: 131, line: 10, column: 18 },
          value: 'hello'
        },
        Label {
          source: { offset: 148, line: 11, column: 3 },
          name: 'boo'
        },
        Label {
          source: { offset: 153, line: 11, column: 8 },
          name: 'goo'
        },
        Instruction {
          source: { offset: 158, line: 11, column: 13 },
          opcode: 'mov',
          operands: [
            Register {
              source: { offset: 162, line: 11, column: 17 },
              name: 'al'
            },
            Integer {
              source: { offset: 166, line: 11, column: 21 },
              value: 100
            }
          ]
        }
      ]
    },
    Instruction {
      source: { offset: 173, line: 12, column: 3 },
      opcode: 'ret',
      operands: []
    },
    Instruction {
      source: { offset: 186, line: 13, column: 3 },
      opcode: 'iret',
      operands: []
    },
    Instruction {
      source: { offset: 208, line: 15, column: 3 },
      opcode: 'mov',
      operands: [
        RegisterOffsetAddress {
          source: { offset: 212, line: 15, column: 7 },
          register: Register {
            source: { offset: 213, line: 15, column: 8 },
            name: 'al'
          },
          offset: Integer {
            source: { offset: 216, line: 15, column: 11 },
            value: 3
          }
        },
        Integer {
          source: { offset: 220, line: 15, column: 15 },
          value: 4
        }
      ]
    },
    Instruction {
      source: { offset: 224, line: 16, column: 3 },
      opcode: 'mov',
      operands: [
        RegisterAddress {
          source: { offset: 228, line: 16, column: 7 },
          register: Register {
            source: { offset: 229, line: 16, column: 8 },
            name: 'al'
          }
        },
        Integer {
          source: { offset: 234, line: 16, column: 13 },
          value: 3
        }
      ]
    },
    Instruction {
      source: { offset: 238, line: 17, column: 3 },
      opcode: 'mov',
      operands: [
        RegisterAddress {
          source: { offset: 242, line: 17, column: 7 },
          register: Identifier {
            source: { offset: 243, line: 17, column: 8 },
            name: 'X'
          }
        },
        Integer {
          source: { offset: 247, line: 17, column: 12 },
          value: 3
        }
      ]
    },
    Instruction {
      source: { offset: 251, line: 18, column: 3 },
      opcode: 'mov',
      operands: [
        Register {
          source: { offset: 255, line: 18, column: 7 },
          name: 'al'
        },
        RegisterOffsetAddress {
          source: { offset: 259, line: 18, column: 11 },
          register: Register {
            source: { offset: 260, line: 18, column: 12 },
            name: 'al'
          },
          offset: Integer {
            source: { offset: 263, line: 18, column: 15 },
            value: 3
          }
        }
      ]
    },
    Instruction {
      source: { offset: 268, line: 19, column: 3 },
      opcode: 'mov',
      operands: [
        Register {
          source: { offset: 272, line: 19, column: 7 },
          name: 'bl'
        },
        RegisterAddress {
          source: { offset: 276, line: 19, column: 11 },
          register: Register {
            source: { offset: 277, line: 19, column: 12 },
            name: 'al'
          }
        }
      ]
    },
    Instruction {
      source: { offset: 283, line: 20, column: 3 },
      opcode: 'mov',
      operands: [
        Register {
          source: { offset: 289, line: 20, column: 9 },
          name: 'cl'
        },
        DirectAddress {
          source: { offset: 295, line: 20, column: 15 },
          value: Integer {
            source: { offset: 296, line: 20, column: 16 },
            value: 40
          }
        }
      ]
    }
  ]
}`;
  expect(inspect(parse(program), false, null, false)).toBe(expectedOutput);
});

it('rejects an invalid program', () => {
  const program = 'mov al, [bl';
  expect(() => parse(program)).toThrow(SyntaxError);
});

it('accepts binary literals', () => {
  const program = `
  byte 0b11110000
  byte 0b0
  byte 0b1
  `;
  const expectedOutput = `Block {
  source: { offset: 0, line: 1, column: 1 },
  statements: [
    Block {
      source: { offset: 3, line: 2, column: 3 },
      statements: [
        Byte {
          source: { offset: 3, line: 2, column: 3 },
          value: Integer {
            source: { offset: 8, line: 2, column: 8 },
            value: 240
          }
        },
        Byte {
          source: { offset: 21, line: 3, column: 3 },
          value: Integer {
            source: { offset: 26, line: 3, column: 8 },
            value: 0
          }
        },
        Byte {
          source: { offset: 32, line: 4, column: 3 },
          value: Integer {
            source: { offset: 37, line: 4, column: 8 },
            value: 1
          }
        }
      ]
    }
  ]
}`;
  expect(inspect(parse(program), false, null, false)).toBe(expectedOutput);
});


it('accepts hexadecimal literals', () => {
  const program = `
  byte 0xff
  byte 0xaB
  byte 0xa3
  byte 0x0
  byte 0x00
  byte 0x1F
  byte 0xEe
  `;
  const expectedOutput = `Block {
  source: { offset: 0, line: 1, column: 1 },
  statements: [
    Block {
      source: { offset: 3, line: 2, column: 3 },
      statements: [
        Byte {
          source: { offset: 3, line: 2, column: 3 },
          value: Integer {
            source: { offset: 8, line: 2, column: 8 },
            value: 255
          }
        },
        Byte {
          source: { offset: 15, line: 3, column: 3 },
          value: Integer {
            source: { offset: 20, line: 3, column: 8 },
            value: 171
          }
        },
        Byte {
          source: { offset: 27, line: 4, column: 3 },
          value: Integer {
            source: { offset: 32, line: 4, column: 8 },
            value: 163
          }
        },
        Byte {
          source: { offset: 39, line: 5, column: 3 },
          value: Integer {
            source: { offset: 44, line: 5, column: 8 },
            value: 0
          }
        },
        Byte {
          source: { offset: 50, line: 6, column: 3 },
          value: Integer {
            source: { offset: 55, line: 6, column: 8 },
            value: 0
          }
        },
        Byte {
          source: { offset: 62, line: 7, column: 3 },
          value: Integer {
            source: { offset: 67, line: 7, column: 8 },
            value: 31
          }
        },
        Byte {
          source: { offset: 74, line: 8, column: 3 },
          value: Integer {
            source: { offset: 79, line: 8, column: 8 },
            value: 238
          }
        }
      ]
    }
  ]
}`;
  expect(inspect(parse(program), false, null, false)).toBe(expectedOutput);
});
