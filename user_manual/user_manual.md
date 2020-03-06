# TASM User Guide

## Table of Contents

### 0. [Overview](#0-Overview)
### 1. [User Interface](#1-User-Interface)
### 2. [Simulator Instructions](#2-Simulator-Instructions)
### 3. [Devices](#3-Devices)
### 4. [Hotkeys](#4-Hotkeys)
### 5. [Example Programs](#5-Example-Programs)

## 0. Overview 

Welcome to the TASM user guide. TASM (Typescript Assembly Simulator) is an 8-bit assembly simulator written in TypeScript. It allows students and hobbyists to write and simulate assembly instructions in an environment that is less intimidating than 32bit or 64bit assembly environments. TASM is best served alongside a college course or online tutorial series as some technical knowledge is required and presumed throughout this document.

This document outlines how you can interact with TASM and provides a great source of reference material when writing TASM programs.

This document is split into sections for your convenience:



## 1. User Interface 

### Layout 

TASM has a 3 column layout by default. With a menu bar on the left, editor and errors in the middle and devices and register display on the right. 

![](https://i.imgur.com/eelhmwj.png)

--- 

The left hand menu (1 above) of TASM provides 9 buttons for interacting with the simulator. 

#### Editor Buttons

- Load File
    - Loads a file from the device and places the content within the editor
- Share
    - Shares the current code within the editor to TASM's server and returns a url you can share with your friends. 
- Format Code
    - Formats the code within the editor to provide a legible, readable  and standardised format to read. 

#### Simulator Buttons 

- Assemble
    - Attempts to assemble the current code within the editor into bytecode.
- Step
    - Attempts to step through the next instruction.
- Run
    - Continuously steps through the next instruction. Speed can be modified in settings.
- Stop
    - Stops the simulator if it's currently running. 

#### Other Buttons 
- User Guide
    - Links to the user guide. (this document)
- Settings
    - Replaces the editor with the settings menu.

--- 

The middle column of TASM (2 above) provides users with a code editor. The code editor gets replaced by the settings menu if the user hits the settings button.

The settings view allows users to change the speed of the run action and the way in which the values of the registers are displayed. Additionally it allows users to configure the timer interrupt and indicate how many cycles should pass before it triggers.

The middle column also provides users with simulator errors and other notifications below the editor. These notifications are reset upon clicking assemble.  The shared url upon hitting the share button will be displayed in the notifications section.

---

The right hand side of TASM (3 above) provides information regarding the current state of the simulator along with the virtual devices. 

The first row is a tabbed menu that toggles the view of the RAM and virtual devices. Below this is the current active displayed device or RAM.

The final row of the right hand section provides users with information regarding the state of the registers along with the current number of instruction cycles. By default the values of the registers are displayed in binary but can be changed to decimal or hexadecimal in the [settings menu](#Settings). 

---

### Settings 

Users have 3 settings that can be modified within the settings view. 

#### Timer Cycles 
Can be increased or decreased to change how often the timer interrupt will request an interrupt. 

See the [timer interrupt](#Timer-Interrupt) in the device section for further information.

#### Simulator Speed 

Will change the speed at which the simulator runs. Useful to vary for debugging programs. 

#### Register Displays 

Allows the registers to be displayed as:
- Binary
- Hexadecimal
- Decimal

### Recommendations

TASM runs on any modern web browser. The recommended resolution for users is 1920x1080 or higher. Lower resolutions and mobiles are supported but for the best experience run TASM on a desktop PC or Laptop. 


## 2. Simulator Instructions 

TASM supports a number of instructions and directives that can be assembled and ran on the simulator. These are loosely based on the intel 8080 architecture. Understanding these instructions are crucial in developing efficient programs. 

### Registers 

TASM has 4 general purpose registers along with 3 special purpose registers.

#### General Purpose
*AL*, *BL*, *CL* and *DL* registers can be used for storing values as per your programming needs. 
The *AL* register is special as that is used with devices for inputting and outputting as mentioned with the OUT and IN instructions below.

#### Special Registers 

##### IP (Instruction Pointer)
- The instruction pointers hold the address of the next instruction that is to be executed. 
- It is visually displayed with a blue background in RAM and a blue line within the editor. 
##### SP (Stack Pointer)
- The stack pointer holds the address that the stack will use for the next value pushed. 
##### SR (Status Register)

- Is a flag register
- each bit represents a flag that is either enabled or disabled
- he following bits within the flag register have a meaning 

| Bit (MSB = 8)   | Meaning        | 
| --------        | --------       | 
| 8               | Zero Flag      | 
| 7               | Negative Flag  | 
| 6               | Interrupt Flag | 
| 5               | None           | 
| 4               | None           | 
| 3               | None           | 
| 2               | None           | 
| 1               | None           | 

##### Zero Flag
- Is set when an arithmetic operation results in zero.
- It is unset up on the execution of the next instruction.
##### Negative Flag
- Is set when an arithmetic operation results in a negative value.
- It is unset up on the execution of the next instruction.
##### Interrupt Flag
- Is set when the STI instruction is called and is unset when CLI is called.
- It represents whether interrupts should be handled at the current time by the simulator or not. 

### Syntactic Elements

#### Comments

Comments start with a `;` and continue until they encounter a newline. All characters between the two points are ignored by the assembler.

##### Examples

```
mov al, 42  ; The answer to life, the universe, and everything.
```

#### Integers

Integers are simple integer literals.

##### Examples

```
100  ; A decimal literal.
0b0110  ; A binary literal.
0xff  ; A hex literal.
```

#### Characters

Character literals represent a single ascii byte. They must be surrounded by single quotes.

##### Examples

```
'x'   ; A normal ascii character.
'\0'  ; An escape sequence.
```

#### Strings

String literals represent a sequence of ascii bytes. They must be surrounded by double quotes.

##### Examples

```
"hello"  ; A normal string.
"hey\t"  ; An escape sequence.
```

### Directives

#### const

`const` defines an assemble-time constant.

##### Examples

```
const ADDR_OFFSET 100
const THE_OFFSET ADDR_OFFSET  ; You can reference other constants.
```

#### org

`org` sets the assembler's location counter.

##### Examples

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

#### byte

`byte` places a byte at the assembler's location counter.

##### Examples

```
x: byte 10
y: byte 20
z: byte 'x'  ; Character literals work too
```

#### ascii

`ascii` places a string at the assembler's location counter.

##### Examples

```
important: ascii "my name jeff"
```

#### asciiz

`asciiz` is identical to asciiz, except it implicitly adds a `'\0'` to the end of the string.

```
important: asciiz "my name jeff"  ; This is really "my name jeff\0"
```

#### Instructions

**`REG` represents a register**
**`IMM/N` represents a N-bit immediate value**

#### MOV

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

#### INC 

Increments a register by 1.

```
INC REG
```

#### DEC 

Decrements a register by 1.

```
INC REG
```

#### ADD

Add to a register.

```
ADD REG, IMM/8
ADD REG, REG
```

#### SUB

Subtract from a register.

```
SUB REG, IMM/8
SUB REG, REG
```

#### MUL

Multiply a register.

```
MUL REG, IMM/8
MUL REG, REG
```

#### DIV

Divide a register.

```
DIV REG, IMM/8
DIV REG, REG
```

#### AND

Bitwise AND a register.

```
AND REG, REG
AND REG, IMM/8
```

#### OR

Bitwise OR a register.

```
OR REG, REG
OR REG, IMM/8
```

#### XOR

Bitwise XOR a register.

```
XOR REG, REG
XOR REG, IMM/8
```

#### NOT

Bitwise NOT a register.

```
NOT REG
```

#### SHL

Bitwise shift left a register
```
SHL REG, REG
SHL REG, IMM/8
```

#### SHR

Bitwise shift right a register
```
SHR REG, REG
SHR REG, IMM/8
```

#### PUSH

Push a value on to the stack.

```
PUSH REG
```

#### POP

Pop a value off of the stack and into a register.

```
POP REG
```

#### CMP

Compare the value in a register with another.

```
CMP REG, REG
CMP REG, IMM/8
```

#### JMP

Jump to a label.

```
JMP IMM/8
```

#### JZ

Jump to a label if last arithmetic operation resulted in zero.

```
JZ IMM/8
```

#### JNZ

Jump to a label if the last arithmetic operation did not result in zero.

```
JNZ IMM/8
```

#### JS

Jump to a label if the last arithmetic operation evaluated to a negative value.

```
JS IMM/8
```

#### JNS

Jump to a label if the last arithmetic operation did not result in a negative value.

```
JNS IMM/8
```

#### CALL

Jump to a subroutine, and push the instruction pointer on to the stack.

```
CALL IMM/8
```

#### RET

Pop a value from the stack, and jump to that address.

```
RET
```

#### CLI

Clear the interrupt flag.

```
CLI
```

#### STI

Set the interrupt flag.

```
STI
```

#### IN

Input from a port into AL.

```
IN IMM/8
```

#### OUT

Output AL to a port.

```
OUT IMM/8
```

## 3. Devices

TASM comes with 4 visual devices that can be interacted with by toggling the view in the device tabs panel alongside the timer interrupt "device"

#### Note: Devices That Request Interrupts 
ome devices may request interrupts. These get handled when the interrupt flag is set as mentioned [above](#Interrupt-Flag).
There is a range of memory locations beginning at 0x03 named the interrupt service vector (ISV). Elements of this vector contain the addresses of the subroutine that should be called when a specific interrupt is triggered. These subroutines are called interrupt service routines (ISRs). For example, in the case of the timer interrupt, the device id is 07, thus, the ISV index is 0x07. This means that the value contained at 0x07 should be the address of the subroutine to be called when the timer interrupt is triggered.

Example:
```
; A program that uses the timer interrupt
; Sets AL to 41 every x cycles

jmp loop
org 07 ; the port for timer interrupts (ISV)
byte 20 ; the location the IP will jump to

org 20 ; ISR
mov al, 41
ret

loop:
  sti ; sets the interrupt flag
  jmp loop
```

See [Timer Interrupt](#Timer-Interrupt) below for information regarding the timer interrupt. 

### Text Display 

PORT: 3

The text display device provides a 4 x 16 grid of memory to output values to be displayed as ascii characters. A value is set in the next location each time and this device can perform a full cycle. i.e. Can overwrite the first position after going through every other.

Example:
```
; Results in a "A" outputted to the first position of the text display device.
mov al, 65
out 03
```

### Virtual Keyboard

PORT: 4

The virtual keyboard allows for a character input to be entered from the user's keyboard into the input box on the device view. The user input will then be converted to the ascii value representation. The virtual keyboard will then request an interrupt.

### 7 Segment Display

PORT: 5

TASM features a 2 digit 7 segment display. 
The digits can be changed by outputting values to the 7 segment display device. 
The most significant bit represents whether to modify the left or right digit. The remaining 7 bits correspond to a segment on the display. This allows for the device to have a range of numbers from 0 - 99 displayed.



| Digit    | Binary   | 
| -------- | -------- | 
|  Empty   | 00000000 |
|  0       | 01111110 |
|  1       | 00110000 |
|  2       | 01101101 |
|  3       | 01111001 |
|  4       | 00000000 |
|  5       | 01011011 |
|  6       | 01011111 |
|  7       | 01110000 |
|  8       | 01111111 |
|  9       | 01110011 |


The example programs section contains examples of interacting with the 7 segment display 

### Traffic Lights

PORT: 6

Users can write programs to toggle the lights on a set of traffic lights.


![](https://i.imgur.com/lfGkZDM.png)



| Bit (MSB = 8)   | Meaning           | 
| --------------- | ----------------- | 
| 8               | None              |
| 7               | None              |
| 6               | Left Red Light    | 
| 5               | Left Amber Light  | 
| 4               | Left Green light  | 
| 3               | Right Red Light   | 
| 2               | Right Amber Light | 
| 1               | Right Green light |

Example:
```
; A program to set the left traffic lightlight red and green
; and set the right traffic light to amber
MOV AL, 0b101010
OUT 6
```

### Timer Interrupt

PORT: 7

The timer interrupt is a non visual device. It is set to request an interrupt every x cycles where x is the current defined setting for timer cycles in the settings window. This results in the IP pointing to whatever value is stored in memory location 0x07. 

## 4. Hotkeys 

TASM comes with a few simple hotkeys so you can easily navigate TASM with a keyboard.

The hotkeys all follow the same format:
`Ctrl + Shift + Key`


| Key  | Function  |                   |
| ---- | --------  | ----------------- |
| l    | Load File |                   |
| a    | Assemble  |                   |
| s    | Step      |                   |
| x    | Run       | Think e**X**ecute |
| q    | Stop      | Think **q**uit    |
| f    | Format    |                   |
| z    | Share     |                   |

## 5. Example Programs

Example programs to illustrate methods of interacting with the devices and instruction set are presented below.

- [Hello World](https://tasm.io/hello-world)
- [Keyboard and Text Display](https://tasm.io/keyboard)
- [7 Segment Display](https://tasm.io/counter)