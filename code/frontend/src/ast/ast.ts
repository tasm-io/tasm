/**
 * A `Location` is a byte-wise location in the source code.
 */
export interface Location {
  line: number,
  column: number,
  offset: number,
}

/**
 * A VisitorFunction consumes some node of type `Node` within a context of type `U`, and produces a
 * value of type `T`.
 */
type VisitorFunction<Node, T, U> = (visitor: Visitor<T, U>, node: Node, context: U) => T;

// TODO(cmgn): CLEANUP: Investigate alternative ways of encoding the two types below. It's very
// repetitive at the moment.

/**
 * A Visitor traverses each node of the tree within some context of type `U`, and returns a value of
 * type `T`. This is a very generic concept: it can be used to implement tree transformations,
 * semantic check passes, etc.
 */
export interface Visitor<T, U> {
  visitInteger: VisitorFunction<Integer, T, U>,
  visitCharacter: VisitorFunction<Character, T, U>,
  visitIdentifier: VisitorFunction<Identifier, T, U>,
  visitRegister: VisitorFunction<Register, T, U>,
  visitDirectAddress: VisitorFunction<DirectAddress, T, U>,
  visitRegisterAddress: VisitorFunction<RegisterAddress, T, U>,
  visitRegisterOffsetAddress: VisitorFunction<RegisterOffsetAddress, T, U>,
  visitInstruction: VisitorFunction<Instruction, T, U>,
  visitLabel: VisitorFunction<Label, T, U>,
  visitBreak: VisitorFunction<Break, T, U>,
  visitConstant: VisitorFunction<Constant, T, U>,
  visitAscii: VisitorFunction<Ascii, T, U>,
  visitAsciiz: VisitorFunction<Asciiz, T, U>,
  visitByte: VisitorFunction<Byte, T, U>,
  visitBlock: VisitorFunction<Block, T, U>,
  visitOrg: VisitorFunction<Org, T, U>,
}

/**
 * A `PartialVisitor` is a `Visitor` that has only defined the visit operation for a subset of the
 * nodes. The rest of the operations are `undefined`.
 */
export type PartialVisitor<T, U> = Partial<Visitor<T, U>>;

/**
 * A `Transformer` traverses the tree within a context of type `T`, and produces a new tree.
 */
export type Transformer<T> = Visitor<Node, T>;

/**
 * A `PartialTransformer` is a `Transformer` that only provides the visit operation for a subset of
 * the node types.
 */
export type PartialTransformer<T> = PartialVisitor<Node, T>;

/**
 * A `NullableVisitor` is a `Visitor` that traverses the tree within a context of type `U`, and
 * returns a nullable value of type `T`.
 */
export type NullableVisitor<T, U> = Visitor<T | null, U>;

/**
 * A `PartialNullableVisitor` is a `NullableVisitor` that only provides the visit operation for a
 * subset of the node types.
 */
export type PartialNullableVisitor<T, U> = PartialVisitor<T | null, U>;

/**
 * `Node` is the base class of all abstract syntax tree nodes. It defines an `accept` method, which
 * is used to implement the visitor design pattern.
 */
export abstract class Node {
  /**
   * Source is where this node was in the original file.
   */
  public source: Location;

  constructor(source: Location) {
    this.source = source;
  }

  /**
   * Accept a `Visitor` on this node.
   *
   * This method should call the relevant visit method on the visitor instance.
   *
   * @param visitor the visitor.
   */
  public abstract accept<T, U>(visitor: Visitor<T, U>, context: U): T;
}

/**
 * An `Integer` represents an integer literal that occurs in the source code.
 */
export class Integer extends Node {
  public value: number;

  constructor(source: Location, value: number) {
    super(source);
    this.value = value;
  }

  public accept<T, U>(visitor: Visitor<T, U>, context: U): T {
    return visitor.visitInteger(visitor, this, context);
  }
}

/**
 * A `Character` represents a character literal that occurs in the source code.
 */
export class Character extends Node {
  public value: string;

  constructor(source: Location, value: string) {
    super(source);
    this.value = value;
  }

  public accept<T, U>(visitor: Visitor<T, U>, context: U): T {
    return visitor.visitCharacter(visitor, this, context);
  }
}

/**
 * An `Identifier` represents an identifier that occurs in the source code.
 */
export class Identifier extends Node {
  public name: string;

  constructor(source: Location, name: string) {
    super(source);
    this.name = name;
  }

  public accept<T, U>(visitor: Visitor<T, U>, context: U): T {
    return visitor.visitIdentifier(visitor, this, context);
  }
}

/**
 * A `Register` represents an occurrence of a register name in the source code.
 */
export class Register extends Node {
  public name: string;

  constructor(source: Location, name: string) {
    super(source);
    this.name = name;
  }

  public accept<T, U>(visitor: Visitor<T, U>, context: U): T {
    return visitor.visitRegister(visitor, this, context);
  }
}

/**
 * An `Address` represents an operand referencing memory that occurs in the source code.
 */
export abstract class Address extends Node {}

/**
 * A `DirectAddress` represents a memory reference of the form `[VALUE]` in the source code, where
 * `VALUE` is either an `Integer`, or an `Identifier`.
 */
export class DirectAddress extends Address {
  public value: Node;

  constructor(source: Location, value: Node) {
    super(source);
    this.value = value;
  }

  public accept<T, U>(visitor: Visitor<T, U>, context: U): T {
    return visitor.visitDirectAddress(visitor, this, context);
  }
}

/**
 * A `RegisterAddress` is a memory reference of the form `[VALUE]` in the source code, where `VALUE`
 * is a register.
 */
export class RegisterAddress extends Address {
  public register: Node;

  constructor(source: Location, register: Node) {
    super(source);
    this.register = register;
  }

  public accept<T, U>(visitor: Visitor<T, U>, context: U): T {
    return visitor.visitRegisterAddress(visitor, this, context);
  }
}

/**
 * A `RegisterOffsetAddress` is a memory reference of the form `[VALUE+OFFSET]` in the source code,
 * where `VALUE` is a `Register`, and `OFFSET` is an `Identifier` or an `Integer`.
 */
export class RegisterOffsetAddress extends Address {
  public register: Node;

  public offset: Node;

  constructor(source: Location, register: Node, offset: Node) {
    super(source);
    this.register = register;
    this.offset = offset;
  }

  public accept<T, U>(visitor: Visitor<T, U>, context: U): T {
    return visitor.visitRegisterOffsetAddress(visitor, this, context);
  }
}

/**
 * An `Instruction` is an assembly instruction in the source code.
 */
export class Instruction extends Node {
  public opcode: string;

  public operands: Node[];

  constructor(source: Location, opcode: string, operands: Node[]) {
    super(source);
    this.opcode = opcode;
    this.operands = operands;
  }

  public accept<T, U>(visitor: Visitor<T, U>, context: U): T {
    return visitor.visitInstruction(visitor, this, context);
  }
}

/**
 * A `Label` is a label in the source code.
 */
export class Label extends Node {
  public name: string;

  constructor(source: Location, name: string) {
    super(source);
    this.name = name;
  }

  public accept<T, U>(visitor: Visitor<T, U>, context: U): T {
    return visitor.visitLabel(visitor, this, context);
  }
}

/**
 * A `Directive` is an assembler directive in the source code.
 */
export abstract class Directive extends Node {}

export class Constant extends Directive {
  public name: string;

  public value: Node;

  constructor(source: Location, name: string, value: Node) {
    super(source);
    this.name = name;
    this.value = value;
  }

  public accept<T, U>(visitor: Visitor<T, U>, context: U): T {
    return visitor.visitConstant(visitor, this, context);
  }
}

/**
 * A `Break` is a `break` directive in the source code.
 */
export class Break extends Directive {
  public accept<T, U>(visitor: Visitor<T, U>, context: U): T {
    return visitor.visitBreak(visitor, this, context);
  }
}

/**
 * An `Ascii` is an `ascii` in the source code.
 */
export class Ascii extends Directive {
  public value: string;

  constructor(source: Location, value: string) {
    super(source);
    this.value = value;
  }

  public accept<T, U>(visitor: Visitor<T, U>, context: U): T {
    return visitor.visitAscii(visitor, this, context);
  }
}

/**
 * An `Asciiz` is an `asciiz` in the source code.
 */
export class Asciiz extends Directive {
  public value: string;

  constructor(source: Location, value: string) {
    super(source);
    this.value = value;
  }

  public accept<T, U>(visitor: Visitor<T, U>, context: U): T {
    return visitor.visitAsciiz(visitor, this, context);
  }
}

/**
 * A `Byte` is a `byte` in the source code.
 */
export class Byte extends Directive {
  public value: string;

  constructor(source: Location, value: string) {
    super(source);
    this.value = value;
  }

  public accept<T, U>(visitor: Visitor<T, U>, context: U): T {
    return visitor.visitByte(visitor, this, context);
  }
}

/**
 * An `Org` is an `org` in the source code.
 */
export class Org extends Directive {
  public addr: Node;

  constructor(source: Location, addr: Node) {
    super(source);
    this.addr = addr;
  }

  public accept<T, U>(visitor: Visitor<T, U>, context: U): T {
    return visitor.visitOrg(visitor, this, context);
  }
}

/**
 * A `Block` is a sequence of nodes.
 */
export class Block extends Node {
  public statements: Node[];

  constructor(source: Location, statements: Node[]) {
    super(source);
    this.statements = statements;
  }

  public accept<T, U>(visitor: Visitor<T, U>, context: U): T {
    return visitor.visitBlock(visitor, this, context);
  }
}

function defaultNullableVisitor<T, U>(): NullableVisitor<T, U> {
  return {
    visitInteger: (_visitor, _integer, _context) => null,
    visitCharacter: (_visitor, _character, _context) => null,
    visitIdentifier: (_visitor, _identifier, _context) => null,
    visitRegister: (_visitor, _register, _context) => null,
    visitDirectAddress: (visitor, addr, context) => {
      addr.value.accept(visitor, context);
      return null;
    },
    visitRegisterAddress: (visitor, addr, context) => {
      addr.register.accept(visitor, context);
      return null;
    },
    visitRegisterOffsetAddress: (visitor, addr, context) => {
      addr.register.accept(visitor, context);
      addr.offset.accept(visitor, context);
      return null;
    },
    visitInstruction: (visitor, instr, context) => {
      instr.operands.map((op) => op.accept(visitor, context));
      return null;
    },
    visitLabel: (_visitor, _label, _context) => null,
    visitBreak: (_visitor, _break, _context) => null,
    visitConstant: (visitor, constant, context) => {
      constant.value.accept(visitor, context);
      return null;
    },
    visitAscii: (_visitor, _ascii, _context) => null,
    visitAsciiz: (_visitor, _asciiz, _context) => null,
    visitByte: (_visitor, _byte, _context) => null,
    visitBlock: (visitor, block, context) => {
      block.statements.map((stmt) => stmt.accept(visitor, context));
      return null;
    },
    visitOrg: (visitor, org, context) => {
      org.addr.accept(visitor, context);
      return null;
    },
  };
}

function merge<T>(a: { [key: string]: T }, b: { [key: string]: T }): { [key: string]: T } {
  const result = Object.fromEntries(Object.entries(a));
  Object.keys(a).forEach((k) => {
    if (typeof (b[k]) !== 'undefined') {
      result[k] = b[k];
    }
  });
  return result;
}

/**
 * Transform a `PartialNullableVisitor` into a `NullableVisitor`.
 *
 * @param partialVisitor the partial visitor.
 * @returns the nullable visitor.
 */
export function createNullableVisitor<T, U>(
  partialNullableVisitor: PartialNullableVisitor<T, U>,
): NullableVisitor<T, U> {
  type DynamicVisitor = { [key: string]: VisitorFunction<Node, null, T> };
  const full = defaultNullableVisitor<T, U>() as unknown as DynamicVisitor;
  const partial = partialNullableVisitor as DynamicVisitor;
  return merge(full, partial) as unknown as NullableVisitor<T, U>;
}

function defaultTransformer<T>(): Transformer<T> {
  return {
    visitInteger: (_visitor, integer, _context) => integer,
    visitCharacter: (_visitor, character, _context) => character,
    visitIdentifier: (_visitor, identifier, _context) => identifier,
    visitRegister: (_visitor, register, _context) => register,
    visitDirectAddress: (visitor, addr, context) => new DirectAddress(
      addr.source,
      addr.value.accept(visitor, context),
    ),
    visitRegisterAddress: (visitor, addr, context) => new RegisterAddress(
      addr.source,
      addr.register.accept(visitor, context),
    ),
    visitRegisterOffsetAddress: (visitor, addr, context) => new RegisterOffsetAddress(
      addr.source,
      addr.register.accept(visitor, context),
      addr.offset.accept(visitor, context),
    ),
    visitInstruction: (visitor, instr, context) => new Instruction(
      instr.source,
      instr.opcode,
      instr.operands.map((op) => op.accept(visitor, context)),
    ),
    visitLabel: (_visitor, label, _context) => label,
    visitBreak: (_visitor, break_, _context) => break_,
    visitConstant: (visitor, constant, context) => new Constant(
      constant.source,
      constant.name,
      constant.value.accept(visitor, context),
    ),
    visitAscii: (_visitor, ascii, _context) => ascii,
    visitAsciiz: (_visitor, asciiz, _context) => asciiz,
    visitByte: (_visitor, byte, _context) => byte,
    visitBlock: (visitor, block, context) => new Block(
      block.source,
      block.statements.map((stmt) => stmt.accept(visitor, context)),
    ),
    visitOrg: (visitor, org, context) => new Org(
      org.source,
      org.addr.accept(visitor, context),
    ),
  };
}

/**
 * Transform a `PartialTransformer` into a `Transformer`.
 *
 * @param partrans a partial implementation of a visitor.
 * @returns the transformer.
 */
export function createTransformer<T>(
  partialTransformer: PartialTransformer<T>,
): Transformer<T> {
  type DynamicTransformer = { [key: string]: VisitorFunction<Node, Node, T> };
  const full = defaultTransformer<T>() as unknown as DynamicTransformer;
  const partial = partialTransformer as unknown as DynamicTransformer;
  return merge(full, partial) as unknown as Transformer<T>;
}
