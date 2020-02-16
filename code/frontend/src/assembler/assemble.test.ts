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


it('assembles mov correctly', () => {
  expect(
    assemble(
      new ast.Block(
        source,
        [
          new ast.Instruction(
            source,
            'mov',
            [
              new ast.Register(source, 'al'),
              new ast.Register(source, 'bl'),
            ],
          ),
          new ast.Instruction(
            source,
            'mov',
            [
              new ast.Register(source, 'cl'),
              new ast.DirectAddress(
                source,
                new ast.Integer(source, 10),
              ),
            ],
          ),
          new ast.Instruction(
            source,
            'mov',
            [
              new ast.Register(source, 'dl'),
              new ast.RegisterOffsetAddress(
                source,
                new ast.Register(source, 'sp'),
                new ast.Integer(source, 5),
              ),
            ],
          ),
          new ast.Instruction(
            source,
            'mov',
            [
              new ast.Register(source, 'sp'),
              new ast.Integer(source, 10),
            ],
          ),
          new ast.Instruction(
            source,
            'mov',
            [
              new ast.DirectAddress(
                source,
                new ast.Integer(source, 10),
              ),
              new ast.Register(source, 'cl'),
            ],
          ),
          new ast.Instruction(
            source,
            'mov',
            [
              new ast.RegisterAddress(
                source,
                new ast.Register(source, 'bl'),
              ),
              new ast.Register(source, 'bl'),
            ],
          ),
          new ast.Instruction(
            source,
            'mov',
            [
              new ast.DirectAddress(
                source,
                new ast.Integer(source, 128),
              ),
              new ast.Integer(source, 50),
            ],
          ),
          new ast.Instruction(
            source,
            'mov',
            [
              new ast.RegisterOffsetAddress(
                source,
                new ast.Register(source, 'bl'),
                new ast.Integer(source, 10),
              ),
              new ast.Integer(source, 1),
            ],
          ),
        ],
      ),
    ),
  ).toStrictEqual(
    buildMemory(
      [0, Opcode.MOV_REG_REG],
      [1, Register.AL],
      [2, Register.BL],
      [3, Opcode.MOV_REG_MEMABS],
      [4, Register.CL],
      [5, 10],
      [6, Opcode.MOV_REG_MEMREGOFFSET],
      [7, Register.DL],
      [8, (Register.SP << 5) | 5],
      [9, Opcode.MOV_REG_INT],
      [10, Register.SP],
      [11, 10],
      [12, Opcode.MOV_MEMABS_REG],
      [13, 10],
      [14, Register.CL],
      [15, Opcode.MOV_MEMREGOFFSET_REG],
      [16, Register.BL << 5],
      [17, Register.BL],
      [18, Opcode.MOV_MEMABS_INT],
      [19, 128],
      [20, 50],
      [21, Opcode.MOV_MEMREGOFFSET_INT],
      [22, (Register.BL << 5) | 10],
      [23, 1],
    ),
  );
});
