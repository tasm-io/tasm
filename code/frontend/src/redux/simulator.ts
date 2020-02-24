import assemble from '../assembler/assemble';
// eslint-disable-next-line no-unused-vars
import { State, step } from '../cpu/cpu';
import { parse } from '../assembler/parser';
import {
  removeCharacters, removeStrings, removeConstants, createPipeline,
} from '../assembler/transform';
import { Register } from '../instructionset/instructionset';

/* Action Types */
export const ASSEMBLE = 'ASSEMBLE';
export const STEP = 'STEP';
export const RUN = 'RUN';

export interface SimulatorStoreInterface {
    byteCode: number[]
    ram: Uint8Array
    registers: Uint8Array
    cycles: number
    error?: {message: string}
}

const defaultState: SimulatorStoreInterface = {
  byteCode: [],
  ram: new Uint8Array(256),
  registers: new Uint8Array(7),
  cycles: 0,
  error: undefined,
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
    try {
      const pipeline = createPipeline(removeCharacters, removeConstants, removeStrings);
      const node = parse(action.payload.toLowerCase());
      const transformed = pipeline(node);
      const byteCode = assemble(transformed);
      const { registers } = defaultState;
      registers[Register.SP] = 255;
      return {
        ...state, byteCode, ram: new Uint8Array(byteCode), registers,
      };
    } catch (error) {
      // TODO(Fraz): handle errors
      console.log(error);
      return {
        ...state, error,
      };
    }
  }
  case (STEP): {
    try {
      const simulatorState: State = {
        registers: state.registers,
        memory: state.ram,
      };
      step(simulatorState);
      return {
        ...state,
        registers: new Uint8Array(simulatorState.registers),
        ram: new Uint8Array(simulatorState.memory),
        cycles: state.cycles + 1,
      };
    } catch (error) {
      // TODO(Fraz): handle errors
      return { ...state, error };
    }
  }
  default:
    return { ...state };
  }
};
