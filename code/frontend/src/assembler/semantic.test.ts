import * as ast from './ast';
import * as semantic from './semantic';

const source = { offset: 0, line: 0, column: 0 };

it('detects undefined identifiers', () => {
  expect(
    semantic.detectUndefinedIdentifiers(
      new ast.Block(
        source,
        [
          new ast.Constant(source, 'x', new ast.Integer(source, 0)),
          new ast.Constant(source, 'y', new ast.Identifier(source, 'undefined_1')),
          new ast.Instruction(
            source,
            'foo',
            [
              new ast.Identifier(source, 'undefined_2'),
              new ast.Identifier(source, 'x'),
              new ast.Identifier(source, 'y'),
            ],
          )
        ],
      ),
    ),
  ).toStrictEqual(
    [
      new ast.Identifier(source, 'undefined_1'),
      new ast.Identifier(source, 'undefined_2'),
    ],
  );
});

it('detects duplicate label names', () => {
  expect(
    semantic.detectDuplicateDefinitions(
      new ast.Block(
        source,
        [
          new ast.Label(source, 'x'),
          new ast.Label(source, 'y'),
          new ast.Instruction(source, 'jmp', [new ast.Identifier(source, 'x')]),
          new ast.Label(source, 'x'),
          new ast.Instruction(source, 'jmp', [new ast.Identifier(source, 'x')]),
          new ast.Label(source, 'z'),
          new ast.Label(source, 'x'),
        ],
      ),
    ),
  ).toStrictEqual(
    new Map<string, semantic.Definition[]>(
      [
        [
          'x',
          [
            new ast.Label(source, 'x'),
            new ast.Label(source, 'x'),
            new ast.Label(source, 'x'),
          ],
        ],
      ],
    ),
  );
});

it('detects duplicate constants', () => {
  expect(
    semantic.detectDuplicateDefinitions(
      new ast.Block(
        source,
        [
          new ast.Constant(source, 'x', new ast.Integer(source, 0)),
          new ast.Constant(source, 'x', new ast.Integer(source, 2)),
          new ast.Constant(source, 'y', new ast.Integer(source, 5)),
          new ast.Constant(source, 'z', new ast.Integer(source, 2)),
          new ast.Constant(source, 'y', new ast.Integer(source, 6)),
        ],
      ),
    ),
  ).toStrictEqual(
    new Map<string, semantic.Definition[]>(
      [
        [
          'x',
          [
            new ast.Constant(source, 'x', new ast.Integer(source, 0)),
            new ast.Constant(source, 'x', new ast.Integer(source, 2)),
          ],
        ],
        [
          'y',
          [
            new ast.Constant(source, 'y', new ast.Integer(source, 5)),
            new ast.Constant(source, 'y', new ast.Integer(source, 6)),
          ],
        ],
      ],
    ),
  );
});

it('detects overlapping constants and labels', () => {
  expect(
    semantic.detectDuplicateDefinitions(
      new ast.Block(
        source,
        [
          new ast.Label(source, 'x'),
          new ast.Constant(source, 'x', new ast.Integer(source, 0)),
          new ast.Constant(source, 'z', new ast.Integer(source, 1)),
          new ast.Label(source, 'y'),
          new ast.Label(source, 'z'),
          new ast.Constant(source, 'z', new ast.Integer(source, 1)),
        ],
      ),
    ),
  ).toStrictEqual(
    new Map<string, semantic.Definition[]>(
      [
        [
          'x',
          [
            new ast.Label(source, 'x'),
            new ast.Constant(source, 'x', new ast.Integer(source, 0)),
          ],
        ],
        [
          'z',
          [
            new ast.Constant(source, 'z', new ast.Integer(source, 1)),
            new ast.Label(source, 'z'),
            new ast.Constant(source, 'z', new ast.Integer(source, 1)),
          ],
        ],
      ],
    ),
  );
});

it('rejects invalid opcodes', () => {
  expect(
    semantic.detectInvalidOpcodes(
      new ast.Block(
        source,
        [
          new ast.Instruction(source, 'foo', []),
          new ast.Instruction(source, 'mov', []),
          new ast.Instruction(source, 'goo', []),
        ],
      ),
    ),
  ).toStrictEqual(
    [
      new ast.Instruction(source, 'foo', []),
      new ast.Instruction(source, 'goo', []),
    ]
  );
});

it('rejects badly-typed instructions', () => {
  expect(
    semantic.detectBadlyTypedInstructions(
      new ast.Block(
        source,
        [
          new ast.Instruction(
            source,
            'mov',
            [
              new ast.Integer(source, 5),
              new ast.Register(source, 'al'),
            ],
          ),
          new ast.Instruction(
            source,
            'mov',
            [
              new ast.Register(source, 'al'),
              new ast.Integer(source, 5),
            ],
          ),
          new ast.Instruction(
            source,
            'out',
            [
              new ast.DirectAddress(source, new ast.Integer(source, 5)),
            ],
          ),
          new ast.Instruction(
            source,
            'jz',
            [
              new ast.Identifier(source, 'label'),
            ],
          ),
          new ast.Instruction(
            source,
            'jz',
            [
              new ast.Identifier(source, 'label'),
            ],
          ),
        ],
      ),
    ),
  ).toStrictEqual(
    [
      new ast.Instruction(
        source,
        'mov',
        [
          new ast.Integer(source, 5),
          new ast.Register(source, 'al'),
        ],
      ),
      new ast.Instruction(
        source,
        'out',
        [
          new ast.DirectAddress(source, new ast.Integer(source, 5)),
        ],
      ),
    ]
  );
});

