/* eslint-disable import/no-cycle */
import assemble from '../assembler/assemble';
// eslint-disable-next-line no-unused-vars
import { State, step, DeviceState } from '../cpu/cpu';
import { Register } from '../instructionset/instructionset';
// eslint-disable-next-line no-unused-vars
import { defaultState as virtualKeyboardState } from '../components/devices/VirtualKeyboard';
import { defaultState as textDisplayState } from '../components/devices/TextDisplay';
import { defaultState as sevenSegmentState } from '../components/devices/SevenSegment';
import { defaultState as trafficLightsState } from '../components/devices/TrafficLights';
import timerInterrupt from '../components/devices/timerInterrrupt';
/* Action Types */
export const ASSEMBLE = 'ASSEMBLE';
export const STEP = 'STEP';
export const CHANGE_ACTIVE_DEVICE = 'CHANGE_ACTIVE_DEVICE';
export const UPDATE_DEVICE = 'UPDATE_DEVICE';
export const MODIFY_TIMER_CYCLES = 'MODIFY_TIMER_CYCLES';

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
 * @param timerCycles the number of cycles before a timer interrupt is requested.
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
    timerCycles: number,
}

const ActiveDevices: DeviceState[] = [
  timerInterrupt,
  virtualKeyboardState,
  textDisplayState,
  sevenSegmentState,
  trafficLightsState,
];


const defaultState: SimulatorStoreInterface = {
  byteCode: new Uint8Array(256),
  ram: new Uint8Array(256),
  editorLines: new Array(256),
  registers: new Uint8Array(7),
  cycles: 0,
  devices: [...ActiveDevices].map((state: DeviceState) => Object.assign(state)),
  activeDevice: 2, // Should relate to the device.id
  timerCycles: 5,
};


type SimulatorActions = Assemble | Step | ChangeActiveDevice | UpdateDevice | ModifyTimerCycles


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

export interface ModifyTimerCycles {
  type: typeof MODIFY_TIMER_CYCLES
  payload: number
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
    if ((state.cycles + 1) % state.timerCycles === 0) {
      devs.filter((dev) => dev.id === 7)[0].requestingInterrupt = true;
    }
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
  case (MODIFY_TIMER_CYCLES): {
    return { ...state, timerCycles: action.payload };
  }
  default:
    return { ...state };
  }
};
