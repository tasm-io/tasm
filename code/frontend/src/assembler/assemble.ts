import { semanticCheck } from './semantic';
import { transformationPipeline } from './transform';
import { parse } from './parser';
import generateCode from './codegen';

type Nullable<T> = null | T;

export default function assemble(code: string): [Uint8Array, Nullable<number>[]] {
  const syntaxTree = parse(code);
  semanticCheck(syntaxTree);
  return generateCode(transformationPipeline(syntaxTree));
}
