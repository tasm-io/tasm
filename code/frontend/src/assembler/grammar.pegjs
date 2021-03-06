// To build this use
// tspegjs -o parser.ts --custom-header "import * as ast from './ast';" grammar.pegjs

Program
    = nl? commands:ProgramRec? nl? {
        if (commands === null) {
            commands = [];
        }
        return new ast.Block(location().start, commands);
    }
    
ProgramRec
    = _ head:Command _ nl _ tail:ProgramRec _ {
        tail.unshift(head);
        return tail;
    }
    / head:Command _ {
        return [head];
    }

Command
    = noninstr:NonInstruction _ instr:Instruction? {
        if (instr !== null) {
            noninstr.statements.push(instr);
        }
        return noninstr;
    }
    / instr:Instruction {
        return instr;
    }

NonInstruction
    = instrs:NonInstructionRec {
        return new ast.Block(location().start, instrs);
    }

NonInstructionRec
    = _ head:Directive _ nl? _ tail:NonInstructionRec _ {
        tail.unshift(head);
        return tail;
    }
    / head:Directive _ {
        return [head];
    }

Directive
    = Org
    / Const
    / Byte
    / Ascii
    / Asciiz
    / Break
    / Label

Org
    = "org" _ value:Constant {
        return new ast.Org(location().start, value);
    }
Const
    = "const" _ name:Name _ value:Constant {
        return new ast.Constant(location().start, name, value);
    }
Byte
    = "byte" _ value:Character {
        return new ast.Byte(location().start, value);
    }
    / "byte" _ value:Integer {
        return new ast.Byte(location().start, value);
    }
Ascii
    = "ascii" _ value:String {
        return new ast.Ascii(location().start, value.join(""));
    }
Asciiz
    = "asciiz" _ value:String {
        return new ast.Asciiz(location().start, value.join(""));
    }
Break
    = "break" {
        return new ast.Break(location().start);
    }
Label
    = name:Name _ ":" {
        return new ast.Label(location().start, name);
    }

Instruction
    = opcode:Name _ operands:Operands _ {
        if (operands === null) {
          operands = [];
        }
        return new ast.Instruction(location().start, opcode, operands);
    }

Operands
    = OperandsRec?
OperandsRec
    = head:Operand _ "," _ tail:OperandsRec {
        tail.unshift(head);
        return tail;
    }
    / head:Operand _ {
        return [head];
    }

Operand
    = Integer
    / Character
    / Identifier
    / RegisterMemoryAccess
    / RegisterOffsetMemoryAccess
    / DirectMemoryAccess

DirectMemoryAccess
    = "[" _ address:Constant _ "]" {
        return new ast.DirectAddress(location().start, address);
    }
RegisterMemoryAccess
    = "[" _ register:Identifier _ "]" {
        return new ast.RegisterAddress(location().start, register);
    }
RegisterOffsetMemoryAccess
    = "[" _ register:Identifier _ "+" _ offset:Constant _ "]" {
        return new ast.RegisterOffsetAddress(location().start, register, offset);
    }

Constant
    = Integer
    / Character
    / Identifier

Identifier
    = name:Name {
        if (['al', 'bl', 'cl', 'dl', 'sp'].includes(name)) {
            return new ast.Register(location().start, name);
        }
        return new ast.Identifier(location().start, name);
    }

Name
    = head:([a-zA-Z_]) tail:([a-zA-Z0-9_]*) {
        return head + tail.join('');
    }

Integer
    = integer:("0x" [0-9a-fA-F]+) {
        return new ast.Integer(location().start, parseInt(integer[1].join('').toLowerCase(), 16));
    }
    / integer:("0b" [01]+) {
        return new ast.Integer(location().start, parseInt(integer[1].join('').toLowerCase(), 2));
    }
    / integer:[0-9]+ {
        return new ast.Integer(location().start, parseInt(integer.join('')));
    }

String
    = '"' characters:DoubleStringCharacter* '"' {
        return characters;
    }

Character
    = "'" byte:ByteCharacter "'" {
        return new ast.Character(location().start, byte);
    }

ByteCharacter
    = !("'" / "\\") char:. {
        return char;
    }
    / "\\" sequence:EscapeSequence {
        return sequence;
    }

DoubleStringCharacter
    = !('"' / "\\") char:. {
        return char;
    }
    / "\\" sequence:EscapeSequence {
        return sequence;
    }

EscapeSequence
    = "'"
    / '"'
    / "\\"
    / "b"  { return "\b"; }
    / "f"  { return "\f"; }
    / "n"  { return "\n"; }
    / "r"  { return "\r"; }
    / "t"  { return "\t"; }
    / "v"  { return "\x0B"; }

_ = [ \r\t]*
comment = ";" (!"\n" .)*
nl = comment? ([\n] / [\r][\n]) ([ \n\r\t] / comment)*

