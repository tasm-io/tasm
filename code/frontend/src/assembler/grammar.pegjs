// To build this use
// tspegjs -o parser.ts --custom-header "import * as ast from './ast';" grammar.pegjs

Program
	= _ commands:ProgramRec? _ {
        if (commands === null) {
            commands = [];
        }
        return new ast.Block(location().start, commands);
    }
    
ProgramRec
	= head:Command _ tail:ProgramRec _ {
        tail.unshift(head);
        return tail;
    }
	/ head:Command {
        return [head];
    }

Command
	= Org
    / Const
    / Byte
    / Ascii
    / Asciiz
    / Break
    / Label
    / Instruction

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
        return new ast.Ascii(location().start, value);
    }
Asciiz
	= "asciiz" _ value:String {
        return new ast.Asciiz(location().start, value);
    }
Break
    = "break" {
        return new ast.Break(location().start);
    }
Label
    = name:Identifier _ ":" {
        return new ast.Label(location().start, name);
    }

Instruction
	= opcode:Identifier _ operands:Operands {
        return new ast.Instruction(location().start, opcode, operands);
    }

Operands
	= OperandsRec?
OperandsRec
	= head:Operand _ "," _ tail:OperandsRec {
        tail.unshift(head);
        return tail;
    }
	/ head:Operand {
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
	= "[" _ address:Integer _ "]" {
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
	= integer:[0-9]+ {
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

// Whitespace & comments
_ = ([ \r\n\t\v] / ";" (!"\n" .)*)*