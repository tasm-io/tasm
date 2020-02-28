/* eslint-disable import/no-cycle */
import assemble from '../assembler/assemble';
// eslint-disable-next-line no-unused-vars
import { State, step } from '../cpu/cpu';
import { Register } from '../instructionset/instructionset';
// eslint-disable-next-line no-unused-vars
import { DeviceState } from '../cpu/cpu';
import { defaultState as VirtualKeyboardState } from '../components/devices/VirtualKeyboard';
import { defaultState as TextDisplayState } from '../components/devices/TextDisplay';
import { defaultState as SevenSegmentState } from '../components/devices/SevenSegment';
import { defaultState as TrafficLightsState } from '../components/devices/TrafficLights';
import { edit } from 'ace-builds';
/* Action Types */
export const ASSEMBLE = 'ASSEMBLE';
export const STEP = 'STEP';
export const RUN = 'RUN';
export const CHANGE_ACTIVE_DEVICE = 'CHANGE_ACTIVE_DEVICE';
export const UPDATE_DEVICE = 'UPDATE_DEVICE';

type Nullable<T> = null | T;


export interface SimulatorStoreInterface {
    byteCode: Uint8Array
    ram: Uint8Array
    registers: Uint8Array
    editorLines: Nullable<number>[];
    cycles: number
    devices: DeviceState[],
    activeDevice: number
}

const defaultState: SimulatorStoreInterface = {
  byteCode: new Uint8Array(256),
  ram: new Uint8Array(256),
  editorLines: new Array(256),
  registers: new Uint8Array(7),
  cycles: 0,
  devices: [VirtualKeyboardState, TextDisplayState, SevenSegmentState, TrafficLightsState],
  activeDevice: 2,
};


type SimulatorActions = Assemble | Step | Run | ChangeActiveDevice | UpdateDevice

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

export interface ChangeActiveDevice {
  type: typeof CHANGE_ACTIVE_DEVICE,
  payload: number
}

export interface UpdateDevice {
  type: typeof UPDATE_DEVICE
  payload: DeviceState
}

export const simulatorReducer = (state = defaultState, action: SimulatorActions) => {
  switch (action.type) {
  case (ASSEMBLE): {
    const [byteCode, editorLines] = assemble(action.payload);
    console.log("EDITOR", editorLines)
    const registers = new Uint8Array(7).fill(0);
    registers[Register.SP] = 255;
    return {
      ...state, byteCode, ram: new Uint8Array(byteCode), registers, editorLines,
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
  case (CHANGE_ACTIVE_DEVICE): {
    return ({ ...state, activeDevice: action.payload });
  }
  case (UPDATE_DEVICE): {
    const otherDevices = state.devices.filter((dev) => dev.id !== action.payload.id);
    otherDevices.push(action.payload);
    return { ...state, devices: otherDevices };
  }
  default:
    return { ...state };
  }
};
