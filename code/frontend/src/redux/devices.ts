export const CHANGE_ACTIVE_DEVICE = 'CHANGE_ACTIVE_DEVICE';
export const SEND_DEVICE_INPUT = 'SEND_DEVICE_INPUT';
export const RETRIEVE_DEVICE_OUTPUT = 'RETRIEVE_DEVICE_OUTPUT';

export interface DeviceStore {
  activeDevice: number
  devices: DeviceState[]
}

export interface DeviceState {
  id: number
  input: (input: number) => void
  output: () => number
}

const defaultState: DeviceStore = {
  activeDevice: 0,
  devices: [],
};

export interface ChangeActiveDevice {
  type: typeof CHANGE_ACTIVE_DEVICE,
  payload: number
}

export interface SendDeviceInput {
  type: typeof SEND_DEVICE_INPUT
  payload: number
}

export interface RetrieveDeviceOutput {
  type: typeof RETRIEVE_DEVICE_OUTPUT
  payload: undefined
}

type DeviceAction = ChangeActiveDevice | SendDeviceInput | RetrieveDeviceOutput

export function DevicesReducer(state = defaultState, action: DeviceAction) {
  switch (action.type) {
  case (CHANGE_ACTIVE_DEVICE): {
    return ({ ...state, activeDevice: action.payload });
  }
  default: {
    return ({ ...state });
  }
  }
}
