import {SimulatorStoreInterface, simulatorReducer, Assemble, ASSEMBLE, STEP, Step, ChangeActiveDevice, CHANGE_ACTIVE_DEVICE, UpdateDevice, UPDATE_DEVICE} from './simulator';
import { DeviceState } from '../cpu/cpu';

test('assembles in the simulator store', () => {
    const initialState: SimulatorStoreInterface = {
        byteCode: new Uint8Array(256),
        ram: new Uint8Array(256),
        editorLines: new Array(256),
        registers: new Uint8Array(7),
        cycles: 0,
        devices: [].map((state: DeviceState) => Object.assign(state)),
        activeDevice: 2, // Should relate to the device.id
      };
      const action: Assemble = {
          type: ASSEMBLE,
          payload: 'mov al, 09 \n',
      }
      const expectedRam = new Uint8Array(256)
      expectedRam[0] = 5
      expectedRam[2] = 9
      const output = simulatorReducer(initialState, action)
      expect(output.ram).toStrictEqual(expectedRam)
})

test('steps in the simulator store', () => {
    const initialState: SimulatorStoreInterface = {
        byteCode: new Uint8Array(256),
        ram: new Uint8Array(256).fill(5), // mov, 5th register, 5 
        editorLines: new Array(256),
        registers: new Uint8Array(7),
        cycles: 0,
        devices: [].map((state: DeviceState) => Object.assign(state)),
        activeDevice: 2, // Should relate to the device.id
      };
      const action: Step = {
          type: STEP,
          payload: undefined,
      }
      expect(simulatorReducer(initialState, action).registers[5]).toStrictEqual(5)
})

test('changes active device in the simulator store', () => {
    const initialState: SimulatorStoreInterface = {
        byteCode: new Uint8Array(256),
        ram: new Uint8Array(256),
        editorLines: new Array(256),
        registers: new Uint8Array(7),
        cycles: 0,
        devices: [].map((state: DeviceState) => Object.assign(state)),
        activeDevice: 2, // Should relate to the device.id
      };
      const action: ChangeActiveDevice = {
          type: CHANGE_ACTIVE_DEVICE,
          payload: 999,
      }
      expect(simulatorReducer(initialState, action).activeDevice).toStrictEqual(999)    
})

test('updates the device state in the simulator store', () => {
    const startDummyDevice: DeviceState = {
        id: -1,
        requestingInterrupt: false,
        input: (a, b) => a,
        output: (a) => a.memory![0],
        memory: new Uint8Array(2).fill(0),
    }
    const expectedDummyDevice: DeviceState = {
        id: -1,
        requestingInterrupt: false,
        input: (a, b) => a,
        output: (a) => a.memory![0],
        memory: new Uint8Array(2).fill(1),
    }
    const initialState: SimulatorStoreInterface = {
        byteCode: new Uint8Array(256),
        ram: new Uint8Array(256),
        editorLines: new Array(256),
        registers: new Uint8Array(7),
        cycles: 0,
        devices: [startDummyDevice].map((state: DeviceState) => Object.assign(state)),
        activeDevice: 2, // Should relate to the device.id
      };
      const action: UpdateDevice = {
          type: UPDATE_DEVICE,
          payload: expectedDummyDevice,
      }
      expect(simulatorReducer(initialState, action).devices[0]).toStrictEqual(expectedDummyDevice)
})