/* eslint-disable import/no-cycle */
import { defaultState as VirtualKeyboardState } from '../components/devices/VirtualKeyboard';

export const CHANGE_ACTIVE_DEVICE = 'CHANGE_ACTIVE_DEVICE';
export const UPDATE_DEVICE = 'UPDATE_DEVICE';

export interface DeviceStore {
  activeDevice: number
  devices: DeviceState[]
}

export interface DeviceState {
  id: number
  requestingInterrupt: boolean
  input: (device: DeviceState, input: number) => DeviceState
  output: (device: DeviceState) => number
  memory?: Uint8Array
}

const defaultDevices: DeviceState[] = [
  VirtualKeyboardState,
];

const defaultState: DeviceStore = {
  activeDevice: 0,
  devices: defaultDevices,
};

export interface ChangeActiveDevice {
  type: typeof CHANGE_ACTIVE_DEVICE,
  payload: number
}

export interface UpdateDevice {
  type: typeof UPDATE_DEVICE
  payload: DeviceState
}

type DeviceAction = ChangeActiveDevice | UpdateDevice

export function DevicesReducer(state = defaultState, action: DeviceAction) {
  switch (action.type) {
  case (CHANGE_ACTIVE_DEVICE): {
    return ({ ...state, activeDevice: action.payload });
  }
  case (UPDATE_DEVICE): {
    const otherDevices = state.devices.filter((dev) => dev.id !== action.payload.id);
    otherDevices.push(action.payload);
    return { ...state, devices: otherDevices };
  }
  default: {
    return ({ ...state });
  }
  }
}
