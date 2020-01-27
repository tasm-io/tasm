import { inspect } from 'util';
import { SyntaxError, parse } from './parser';

// TODO(cmgn): Improve the test suite. Table-driven tests might be worth a shot.

it('parses a full program', () => {
  const program = `
    org 50
    org XX
    org 'e'
      const
    X 30
    const Y 'b'
  aaaa: byte 'x'
  bbbb: ascii "hello\\n\\""
  cccc: byte 30
        byte 20
        byte 30
  label:
    mov al, 100
    mov bl, [10]
    mov cl, [al+10];    comment
    mov FOO, bar, BAZ
    mov dl, 
      ; and another one!
  [al+ABC]
    jmp label
  ; comment
    inc
    dec
  break
  `;
  const expectedOutput = `Block {
  source: { offset: 0, line: 1, column: 1 },
  statements: [
    Org {
      source: { offset: 5, line: 2, column: 5 },
      addr: Integer { source: { offset: 9, line: 2, column: 9 }, value: 50 }
    },
    Org {
      source: { offset: 16, line: 3, column: 5 },
      addr: Identifier {
        source: { offset: 20, line: 3, column: 9 },
        name: 'XX'
      }
    },
    Org {
      source: { offset: 27, line: 4, column: 5 },
      addr: Character {
        source: { offset: 31, line: 4, column: 9 },
        value: 'e'
      }
    },
    Constant {
      source: { offset: 41, line: 5, column: 7 },
      name: 'X',
      value: Integer { source: { offset: 53, line: 6, column: 7 }, value: 30 }
    },
    Constant {
      source: { offset: 60, line: 7, column: 5 },
      name: 'Y',
      value: Character {
        source: { offset: 68, line: 7, column: 13 },
        value: 'b'
      }
    },
    Label {
      source: { offset: 74, line: 8, column: 3 },
      name: Identifier {
        source: { offset: 74, line: 8, column: 3 },
        name: 'aaaa'
      }
    },
    Byte {
      source: { offset: 80, line: 8, column: 9 },
      value: Character {
        source: { offset: 85, line: 8, column: 14 },
        value: 'x'
      }
    },
    Label {
      source: { offset: 91, line: 9, column: 3 },
      name: Identifier {
        source: { offset: 91, line: 9, column: 3 },
        name: 'bbbb'
      }
    },
    Ascii {
      source: { offset: 97, line: 9, column: 9 },
      value: [
        'h', 'e', 'l',
        'l', 'o', '\\n',
        '"'
      ]
    },
    Label {
      source: { offset: 117, line: 10, column: 3 },
      name: Identifier {
        source: { offset: 117, line: 10, column: 3 },
        name: 'cccc'
      }
    },
    Byte {
      source: { offset: 123, line: 10, column: 9 },
      value: Integer {
        source: { offset: 128, line: 10, column: 14 },
        value: 30
      }
    },
    Byte {
      source: { offset: 139, line: 11, column: 9 },
      value: Integer {
        source: { offset: 144, line: 11, column: 14 },
        value: 20
      }
    },
    Byte {
      source: { offset: 155, line: 12, column: 9 },
      value: Integer {
        source: { offset: 160, line: 12, column: 14 },
        value: 30
      }
    },
    Label {
      source: { offset: 165, line: 13, column: 3 },
      name: Identifier {
        source: { offset: 165, line: 13, column: 3 },
        name: 'label'
      }
    },
    Instruction {
      source: { offset: 176, line: 14, column: 5 },
      opcode: Identifier {
        source: { offset: 176, line: 14, column: 5 },
        name: 'mov'
      },
      operands: [
        Register {
          source: { offset: 180, line: 14, column: 9 },
          name: 'al'
        },
        Integer {
          source: { offset: 184, line: 14, column: 13 },
          value: 100
        }
      ]
    },
    Instruction {
      source: { offset: 192, line: 15, column: 5 },
      opcode: Identifier {
        source: { offset: 192, line: 15, column: 5 },
        name: 'mov'
      },
      operands: [
        Register {
          source: { offset: 196, line: 15, column: 9 },
          name: 'bl'
        },
        DirectAddress {
          source: { offset: 200, line: 15, column: 13 },
          value: Integer {
            source: { offset: 201, line: 15, column: 14 },
            value: 10
          }
        }
      ]
    },
    Instruction {
      source: { offset: 209, line: 16, column: 5 },
      opcode: Identifier {
        source: { offset: 209, line: 16, column: 5 },
        name: 'mov'
      },
      operands: [
        Register {
          source: { offset: 213, line: 16, column: 9 },
          name: 'cl'
        },
        RegisterOffsetAddress {
          source: { offset: 217, line: 16, column: 13 },
          register: Register {
            source: { offset: 218, line: 16, column: 14 },
            name: 'al'
          },
          offset: Integer {
            source: { offset: 221, line: 16, column: 17 },
            value: 10
          }
        }
      ]
    },
    Instruction {
      source: { offset: 241, line: 17, column: 5 },
      opcode: Identifier {
        source: { offset: 241, line: 17, column: 5 },
        name: 'mov'
      },
      operands: [
        Identifier {
          source: { offset: 245, line: 17, column: 9 },
          name: 'FOO'
        },
        Identifier {
          source: { offset: 250, line: 17, column: 14 },
          name: 'bar'
        },
        Identifier {
          source: { offset: 255, line: 17, column: 19 },
          name: 'BAZ'
        }
      ]
    },
    Instruction {
      source: { offset: 263, line: 18, column: 5 },
      opcode: Identifier {
        source: { offset: 263, line: 18, column: 5 },
        name: 'mov'
      },
      operands: [
        Register {
          source: { offset: 267, line: 18, column: 9 },
          name: 'dl'
        },
        RegisterOffsetAddress {
          source: { offset: 299, line: 20, column: 3 },
          register: Register {
            source: { offset: 300, line: 20, column: 4 },
            name: 'al'
          },
          offset: Identifier {
            source: { offset: 303, line: 20, column: 7 },
            name: 'ABC'
          }
        }
      ]
    },
    Instruction {
      source: { offset: 312, line: 21, column: 5 },
      opcode: Identifier {
        source: { offset: 312, line: 21, column: 5 },
        name: 'jmp'
      },
      operands: [
        Identifier {
          source: { offset: 316, line: 21, column: 9 },
          name: 'label'
        }
      ]
    },
    Instruction {
      source: { offset: 338, line: 23, column: 5 },
      opcode: Identifier {
        source: { offset: 338, line: 23, column: 5 },
        name: 'inc'
      },
      operands: [
        Identifier {
          source: { offset: 346, line: 24, column: 5 },
          name: 'dec'
        }
      ]
    },
    Break { source: { offset: 352, line: 25, column: 3 } }
  ]
}`;
  expect(inspect(parse(program), false, null, false)).toBe(expectedOutput);
});

it('rejects an invalid program', () => {
  const program = 'mov al, [bl';
  expect(() => parse(program)).toThrow(SyntaxError);
});