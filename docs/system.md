# TASM System

## Specification

### Word size

The TASM system has an 8-bit word size.

### Registers

1. AL
1. BL
1. CL
1. DL
1. SP
1. IP
1. SR

Registers AL through to DL are general purpose.  
SP is the stack pointer.  
IP is the instruction pointer.  
SR is the flags register.

### Flags

1. Z
1. S
1. I

Z is set if the last arithmetic operation resulted in a zero.  
S is set if the last arithmetic operation results in a negative value.  
I is set if interrupts are enabled.

### Memory

The TASM system has 256 bytes of memory, addressable as `0x00` through to `0xff`.
