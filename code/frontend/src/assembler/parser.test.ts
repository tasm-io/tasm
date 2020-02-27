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
  org 10     ; inline boi
  byte 5    
  org 0
  mov al, 100\r
  ret;hello!
  iret    
  ; heyo  
  mov [al+3], 4
  mov [al], 3
  mov [X], 3
  mov al, [al+3]
  mov bl, [al]
  mov   cl,   [40]    `;
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
      source: { offset: 16, line: 3, column: 3 },
      value: Integer { source: { offset: 21, line: 3, column: 8 }, value: 0 }
    },
    Ascii { source: { offset: 25, line: 4, column: 3 }, value: 'Hey' },
    Asciiz {
      source: { offset: 41, line: 5, column: 3 },
      value: 'ello'
    },
    Break { source: { offset: 59, line: 6, column: 3 } },
    Org {
      source: { offset: 69, line: 8, column: 3 },
      addr: Integer { source: { offset: 73, line: 8, column: 7 }, value: 10 }
    },
    Byte {
      source: { offset: 95, line: 9, column: 3 },
      value: Integer { source: { offset: 100, line: 9, column: 8 }, value: 5 }
    },
    Org {
      source: { offset: 108, line: 10, column: 3 },
      addr: Integer {
        source: { offset: 112, line: 10, column: 7 },
        value: 0
      }
    },
    Instruction {
      source: { offset: 116, line: 11, column: 3 },
      opcode: 'mov',
      operands: [
        Register {
          source: { offset: 120, line: 11, column: 7 },
          name: 'al'
        },
        Integer {
          source: { offset: 124, line: 11, column: 11 },
          value: 100
        }
      ]
    },
    Instruction {
      source: { offset: 131, line: 12, column: 3 },
      opcode: 'ret',
      operands: []
    },
    Instruction {
      source: { offset: 144, line: 13, column: 3 },
      opcode: 'iret',
      operands: []
    },
    Instruction {
      source: { offset: 166, line: 15, column: 3 },
      opcode: 'mov',
      operands: [
        RegisterOffsetAddress {
          source: { offset: 170, line: 15, column: 7 },
          register: Register {
            source: { offset: 171, line: 15, column: 8 },
            name: 'al'
          },
          offset: Integer {
            source: { offset: 174, line: 15, column: 11 },
            value: 3
          }
        },
        Integer {
          source: { offset: 178, line: 15, column: 15 },
          value: 4
        }
      ]
    },
    Instruction {
      source: { offset: 182, line: 16, column: 3 },
      opcode: 'mov',
      operands: [
        RegisterAddress {
          source: { offset: 186, line: 16, column: 7 },
          register: Register {
            source: { offset: 187, line: 16, column: 8 },
            name: 'al'
          }
        },
        Integer {
          source: { offset: 192, line: 16, column: 13 },
          value: 3
        }
      ]
    },
    Instruction {
      source: { offset: 196, line: 17, column: 3 },
      opcode: 'mov',
      operands: [
        RegisterAddress {
          source: { offset: 200, line: 17, column: 7 },
          register: Identifier {
            source: { offset: 201, line: 17, column: 8 },
            name: 'X'
          }
        },
        Integer {
          source: { offset: 205, line: 17, column: 12 },
          value: 3
        }
      ]
    },
    Instruction {
      source: { offset: 209, line: 18, column: 3 },
      opcode: 'mov',
      operands: [
        Register {
          source: { offset: 213, line: 18, column: 7 },
          name: 'al'
        },
        RegisterOffsetAddress {
          source: { offset: 217, line: 18, column: 11 },
          register: Register {
            source: { offset: 218, line: 18, column: 12 },
            name: 'al'
          },
          offset: Integer {
            source: { offset: 221, line: 18, column: 15 },
            value: 3
          }
        }
      ]
    },
    Instruction {
      source: { offset: 226, line: 19, column: 3 },
      opcode: 'mov',
      operands: [
        Register {
          source: { offset: 230, line: 19, column: 7 },
          name: 'bl'
        },
        RegisterAddress {
          source: { offset: 234, line: 19, column: 11 },
          register: Register {
            source: { offset: 235, line: 19, column: 12 },
            name: 'al'
          }
        }
      ]
    },
    Instruction {
      source: { offset: 241, line: 20, column: 3 },
      opcode: 'mov',
      operands: [
        Register {
          source: { offset: 247, line: 20, column: 9 },
          name: 'cl'
        },
        DirectAddress {
          source: { offset: 253, line: 20, column: 15 },
          value: Integer {
            source: { offset: 254, line: 20, column: 16 },
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

it('accepts binary literals', () => {
  const program = `
  byte 0b11110000
  byte 0b0
  byte 0b1
  `;
  const expectedOutput = `Block {
  source: { offset: 0, line: 1, column: 1 },
  statements: [
    Byte {
      source: { offset: 3, line: 2, column: 3 },
      value: Integer { source: { offset: 8, line: 2, column: 8 }, value: 1 }
    },
    Byte {
      source: { offset: 21, line: 3, column: 3 },
      value: Integer { source: { offset: 26, line: 3, column: 8 }, value: 0 }
    },
    Byte {
      source: { offset: 32, line: 4, column: 3 },
      value: Integer { source: { offset: 37, line: 4, column: 8 }, value: 1 }
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
    Byte {
      source: { offset: 3, line: 2, column: 3 },
      value: Integer { source: { offset: 8, line: 2, column: 8 }, value: 15 }
    },
    Byte {
      source: { offset: 15, line: 3, column: 3 },
      value: Integer { source: { offset: 20, line: 3, column: 8 }, value: 10 }
    },
    Byte {
      source: { offset: 27, line: 4, column: 3 },
      value: Integer { source: { offset: 32, line: 4, column: 8 }, value: 10 }
    },
    Byte {
      source: { offset: 39, line: 5, column: 3 },
      value: Integer { source: { offset: 44, line: 5, column: 8 }, value: 0 }
    },
    Byte {
      source: { offset: 50, line: 6, column: 3 },
      value: Integer { source: { offset: 55, line: 6, column: 8 }, value: 0 }
    },
    Byte {
      source: { offset: 62, line: 7, column: 3 },
      value: Integer { source: { offset: 67, line: 7, column: 8 }, value: 1 }
    },
    Byte {
      source: { offset: 74, line: 8, column: 3 },
      value: Integer { source: { offset: 79, line: 8, column: 8 }, value: 14 }
    }
  ]
}`;
  expect(inspect(parse(program), false, null, false)).toBe(expectedOutput);
});
