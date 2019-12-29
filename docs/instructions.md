# TASM Instructions

## Specification

`REG` represents a register  
`IMM/N` represents a N-bit immediate value

### MOV

Moves values between memory and registers, and vice versa.

```
MOV REG, IMM/8
MOV REG, REG
MOV REG, [IMM/8]
MOV REG, [REG+IMM/5]

MOV [IMM/8], REG
MOV [IMM/8], IMM/8
MOV [REG+IMM/5], REG
MOV [REG+IMM/5], IMM/8
```

### ADD

Add to a register.

```
ADD REG, IMM/8
ADD REG, REG
```

### SUB

Subtract from a register.

```
SUB REG, IMM/8
SUB REG, REG
```

### MUL

Multiply a register.

```
MUL REG, IMM/8
MUL REG, REG
```

### DIV

Divide a register.

```
DIV REG, IMM/8
DIV REG, REG
```

### AND

Bitwise AND a register.

```
AND REG, REG
AND REG, IMM/8
```

### OR

Bitwise OR a register.

```
OR REG, REG
OR REG, IMM/8
```

### XOR

Bitwise XOR a register.

```
XOR REG, REG
XOR REG, IMM/8
```

### NOT

Bitwise NOT a register.

```
NOT REG
```

### PUSH

Push a value on to the stack.

```
PUSH IMM/8
PUSH REG
```

### POP

Pop a value off of the stack and into a register.

```
POP REG
```

### CMP

Compare the value in a register with another.

```
CMP REG, REG
CMP REG, IMM/8
```

### JMP

Jump to a label.

```
JMP IMM/8
```

### JZ

Jump to a label if last arithmetic operation resulted in zero.

```
JZ IMM/8
```

### JNZ

Jump to a label if the last arithmetic operation did not result in zero.

```
JNZ IMM/8
```

### JS

Jump to a label if the last arithmetic operation evaluated to a negative value.

```
JS IMM/8
```

### JNS

Jump to a label if the last arithmetic operation did not result in a negative value.

```
JNS IMM/8
```

### CALL

Jump to a subroutine, and push the instruction pointer on to the stack.

```
CALL IMM/8
```

### RET

Pop a value from the stack, and jump to that address.

```
RET
```

### CLI

Clear the interrupt flag.

```
CLI
```

### STI

Set the interrupt flag.

```
STI
```

### IN

Input from a port into AL.

```
IN IMM/8
```

### OUT

Output AL to a port.

```
OUT IMM/8
```