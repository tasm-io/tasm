import * as ast from '../assembler/ast';
import format from './format';
import { parse } from '../assembler/parser';

it('formats a program without org', () => {
  expect(format(parse(`
    byte 'a'
  goo:
    byte 'b'
    mov al, 30
  hoo: boo:
    mov al, [0x5]
    mov bl, [cl+0b11]
    ascii "hello"
    asciiz "world"
    const X        0x10
    const Y   0b1011
  `))).toStrictEqual(`    byte 'a'
goo:
    byte 'b'
    mov al, 30
hoo:
boo:
    mov al, [5]
    mov bl, [cl + 3]
    ascii "hello"
    asciiz "world"
    const X 16
    const Y 11`);
});

it('formats code with orgs correctly', () => {
  expect(format(parse(`
  org 50
  foo:
    ret
  org 70
  bar:
    ret
  baz:
    ret
  `))).toStrictEqual(`
    org 50
foo:
    ret

    org 70
bar:
    ret
baz:
    ret`);
});
