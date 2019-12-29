# TASM Assembler

## Syntactic Elements

### Comments

Comments start with a `;` and continue until they encounter a newline. All characters between the two points are ignored by the assembler.

#### Examples

```
mov al, 42  ; The answer to life, the universe, and everything.
```

### Integers

Integers are simple integer literals.

#### Examples

```
100  ; A decimal literal.
10b  ; A binary literal.
50o  ; An octal literal.
aah  ; A hex literal.
```

### Characters

Character literals represent a single ascii byte. They must be surrounded by single quotes.

#### Examples

```
'x'   ; A normal ascii character.
'\0'  ; An escape sequence.
```

### Strings

String literals represent a sequence of ascii bytes. They must be surrounded by double quotes.

#### Examples

```
"hello"  ; A normal string.
"hey\t"  ; An escape sequence.
```

## Directives

### const

`const` defines an assemble-time constant.

#### Examples

```
const ADDR_OFFSET 100
const THE_OFFSET ADDR_OFFSET  ; You can reference other constants.
```

### org

`org` sets the assembler's location counter.

#### Examples

```
org 40
mov al, 00  ; This will occupy address 40 through to 42.
```

```
const INC_ADDR 100

org INC_ADDR
inc:
  ...
```

### byte

`byte` places a byte at the assembler's location counter.

#### Examples

```
x: byte 10
y: byte 20
z: byte 'x'  ; Character literals work too
```

### ascii

`ascii` places a string at the assembler's location counter.

#### Examples

```
important: ascii "my name jeff"
```

### asciiz

`asciiz` is identical to asciiz, except it implicitly adds a `'\0'` to the end of the string.

```
important: asciiz "my name jeff"  ; This is really "my name jeff\0"
```

### break

`break` sets a breakpoint for the debugger.

#### Examples

```
mov al, 00h
break
mov al, 01h
```
