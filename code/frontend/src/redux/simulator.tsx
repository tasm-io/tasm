import assemble from '../assembler/assemble';
import CPU from '../cpu/cpu';
import { parse } from '../assembler/parser';
import {
  removeCharacters, removeStrings, removeConstants, createPipeline,
} from '../assembler/transform';

/* Action Types */
export const ASSEMBLE = 'ASSEMBLE';
export const STEP = 'STEP';
export const RUN = 'RUN';

export interface SimulatorStoreInterface {
    byteCode: number[]
    cpu: CPU
    ram: Uint8Array
    registers: Uint8Array
    cycles: number
}

const defaultState: SimulatorStoreInterface = {
  byteCode: [],
  cpu: new CPU([]),
  ram: new Uint8Array(256),
  registers: new Uint8Array(7),
  cycles: 0,
};


type SimulatorActions = Assemble | Step | Run

export interface Assemble {
    type: typeof ASSEMBLE
    payload: string
}

export interface Step {
    type: typeof STEP
    payload: undefined
}

export interface Run {
    type: typeof RUN
    payload: boolean
}

export const simulatorReducer = (state = defaultState, action: SimulatorActions) => {
  switch (action.type) {
  case (ASSEMBLE): {
    const pipeline = createPipeline(removeCharacters, removeConstants, removeStrings);
    const node = parse(action.payload.toLowerCase());
    const transformed = pipeline(node);
    const byteCode = assemble(transformed);
    const cpu = new CPU([...byteCode]);
    return {
      ...state, byteCode, cpu, registers: cpu.registers, ram: cpu.RAM,
    };
  }
  case (STEP): {
    state.cpu.step();
    return {
      ...state,
      registers: new Uint8Array(state.cpu.registers),
      ram: new Uint8Array(state.cpu.RAM),
      cycles: state.cycles + 1,
    };
  }
  default:
    return { ...state };
  }
};
