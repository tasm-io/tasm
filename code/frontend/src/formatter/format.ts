import * as ast from '../assembler/ast';

export default function format(program: ast.Node): string {
  const formattingVisitor = ast.createNullableVisitor<string, {}>({
    visitInteger: (_visitor, node, _context) => `${node.value}`,
    visitCharacter: (_visitor, node, _context) => `'${node.value}'`,
    visitIdentifier: (_visitor, node, _context) => `${node.name}`,
    visitRegister: (_visitor, node, _context) => `${node.name.toLowerCase()}`,
    visitBlock: (visitor, node, _context) => node.statements.map((child) => child.accept(visitor, {})).join('\n'),
    visitByte: (visitor, node, _context) => `    byte ${node.value.accept(visitor, {})}`,
    visitOrg: (visitor, node, _context) => `\n    org ${node.addr.accept(visitor, {})}`,
    visitLabel: (_visitor, node, _context) => `${node.name}:`,
    visitDirectAddress: (visitor, node, _context) => `[${node.value.accept(visitor, {})}]`,
    visitRegisterAddress: (visitor, node, _context) => `[${node.register.accept(visitor, {})}]`,
    visitRegisterOffsetAddress: (visitor, node, _context) => `[${node.register.accept(visitor, {})} + ${node.offset.accept(visitor, {})}]`,
    visitInstruction: (visitor, node, _context) => {
      const operands = node.operands.map((operand) => operand.accept(visitor, {})).join(', ');
      if (operands.length !== 0) {
        return `    ${node.opcode} ${operands}`;
      }
      return `    ${node.opcode}`;
    },
    visitAscii: (_visitor, node, _context) => `    ascii "${node.value}"`,
    visitAsciiz: (_visitor, node, _context) => `    asciiz "${node.value}"`,
    visitConstant: (visitor, node, _context) => `    const ${node.name} ${node.value.accept(visitor, {})}`,
  });
  return program.accept(formattingVisitor, {}) || '';
}
