import * as ast from './ast';
import assemble from './assemble';
import { Register, Opcode } from '../instructionset/instructionset';

const source = { line: 0, column: 0, offset: 0 };

function buildMemory(...commands: [number, number][]): number[] {
  const buffer = new Array(256).fill(0);
  commands.forEach(([i, v]) => {
    buffer[i] = v;
  });
  return buffer;
}

it('assembles a basic add', () => {
  expect(
    assemble(
      new ast.Instruction(
        source,
        'add',
        [
          new ast.Register(source, 'AL'),
          new ast.Integer(source, 5),
        ],
      ),
    ),
  ).toStrictEqual(
    buildMemory(
      [0, Opcode.ADD_REG_INT],
      [1, Register.AL],
      [2, 5],
    ),
  );
});

it('implements all the arithmetic operators', () => {
  expect(
    assemble(
      new ast.Block(
        source,
        [
          new ast.Instruction(
            source,
            'add',
            [
              new ast.Register(source, 'al'),
              new ast.Register(source, 'al'),
            ],
          ),
          new ast.Instruction(
            source,
            'sub',
            [
              new ast.Register(source, 'sp'),
              new ast.Integer(source, 43),
            ],
          ),
          new ast.Instruction(
            source,
            'mul',
            [
              new ast.Register(source, 'sp'),
              new ast.Register(source, 'dl'),
            ],
          ),
          new ast.Instruction(
            source,
            'div',
            [
              new ast.Register(source, 'bl'),
              new ast.Register(source, 'cl'),
            ],
          ),
        ],
      ),
    ),
  ).toStrictEqual(
    buildMemory(
      [0, Opcode.ADD_REG_REG],
      [1, Register.AL],
      [2, Register.AL],
      [3, Opcode.SUB_REG_INT],
      [4, Register.SP],
      [5, 43],
      [6, Opcode.MUL_REG_REG],
      [7, Register.SP],
      [8, Register.DL],
      [9, Opcode.DIV_REG_REG],
      [10, Register.BL],
      [11, Register.CL],
    ),
  );
});

