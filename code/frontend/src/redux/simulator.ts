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
/* Action Types */
export const ASSEMBLE = 'ASSEMBLE';
export const STEP = 'STEP';
export const CHANGE_ACTIVE_DEVICE = 'CHANGE_ACTIVE_DEVICE';
export const UPDATE_DEVICE = 'UPDATE_DEVICE';

type Nullable<T> = null | T;


/**
 * SimulatorStoreInterface represents of the state of the simulator in the redux central store.
 * @param byteCode the ByteCode representation of the current assembled program
 * @param ram The current state of the RAM in the simulator
 * @param registers the current state of the registers in the simulator.
 * @param editorLines A mapping between instruction in RAM and line of code in the editor.
 * @param cycles a counter of the current steps cycled through in the simulator
 * @param devices the state of all active devices within the simulator
 * @param activeDevice the current visible device in the device panel.
 *
 */
export interface SimulatorStoreInterface {
    byteCode: Uint8Array
    ram: Uint8Array
    registers: Uint8Array
    editorLines: Nullable<number>[];
    cycles: number
    devices: DeviceState[],
    activeDevice: number
}

const ActiveDevices: DeviceState[] = [
  VirtualKeyboardState,
  TextDisplayState,
  SevenSegmentState,
  TrafficLightsState,
];


const defaultState: SimulatorStoreInterface = {
  byteCode: new Uint8Array(256),
  ram: new Uint8Array(256),
  editorLines: new Array(256),
  registers: new Uint8Array(7),
  cycles: 0,
  devices: [...ActiveDevices].map((state: DeviceState) => Object.assign(state)),
  activeDevice: 2, // Should relate to the device.id
};


type SimulatorActions = Assemble | Step | ChangeActiveDevice | UpdateDevice


export interface Assemble {
    type: typeof ASSEMBLE
    payload: string
}

export interface Step {
    type: typeof STEP
    payload: undefined
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
    const registers = new Uint8Array(7).fill(0);
    registers[Register.SP] = 255;
    const devices: DeviceState[] = [...ActiveDevices];
    // Reset device memory and clear any requesting interrupts.
    // eslint-disable-next-line
    devices.map((dev) => (dev.memory ? dev.memory = new Uint8Array(dev.memory.length) : undefined))
    // eslint-disable-next-line no-param-reassign
    devices.map((dev) => { dev.requestingInterrupt = false; return undefined; });
    return {
      ...state,
      byteCode,
      ram: new Uint8Array(byteCode),
      registers,
      editorLines,
      devices,
      cycles: 0,
    };
  }
  case (STEP): {
    const simulatorState: State = {
      registers: state.registers,
      memory: state.ram,
    };
    const devs = [...state.devices];
    step(simulatorState, devs);
    return {
      ...state,
      registers: new Uint8Array(simulatorState.registers),
      ram: new Uint8Array(simulatorState.memory),
      cycles: state.cycles + 1,
      devices: devs,
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
