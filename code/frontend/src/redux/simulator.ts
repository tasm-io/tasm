import assemble from '../assembler/assemble';
// eslint-disable-next-line no-unused-vars
import { State, step } from '../cpu/cpu';
import { Register } from '../instructionset/instructionset';

/* Action Types */
export const ASSEMBLE = 'ASSEMBLE';
export const STEP = 'STEP';
export const RUN = 'RUN';

export interface SimulatorStoreInterface {
    byteCode: Uint8Array
    ram: Uint8Array
    registers: Uint8Array
    cycles: number
    error?: {message: string}
}

const defaultState: SimulatorStoreInterface = {
  byteCode: new Uint8Array(256),
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
    const [byteCode, _] = assemble(action.payload);
    const { registers } = defaultState;
    registers[Register.SP] = 255;
    return {
      ...state, byteCode, ram: new Uint8Array(byteCode), registers,
    };
  }
  case (STEP): {
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
  }
  default:
    return { ...state };
  }
};
