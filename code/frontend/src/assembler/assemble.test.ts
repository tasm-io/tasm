import * as ast from './ast';
import { assembleProgram } from './assemble';
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
    assembleProgram(
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

