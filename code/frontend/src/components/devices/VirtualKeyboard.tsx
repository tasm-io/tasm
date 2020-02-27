/* eslint-disable import/no-cycle */
import React from 'react';
import '../../App.css';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { DeviceState, UpdateDevice, UPDATE_DEVICE } from '../../redux/devices';
// eslint-disable-next-line no-unused-vars
import { RootState } from '../../redux/root';

const handleVirtualKeyboardInput = (device: DeviceState, event: any) => {
  const incoming: number = Number(event.target.value.charCodeAt(0));
  const updatedDevice = device;
  if (typeof updatedDevice.memory !== 'undefined') updatedDevice.memory[0] = incoming;
  updatedDevice.requestingInterrupt = true;
  const action: UpdateDevice = {
    type: UPDATE_DEVICE,
    payload: updatedDevice,
  };
  return (action);
};

const deviceInput = (device: DeviceState, _input: number) => device;

const deviceOutput = (dev: DeviceState) => (dev.memory ? dev.memory[0] : 0);

export const defaultState: DeviceState = {
  id: 4,
  requestingInterrupt: false,
  input: deviceInput,
  output: deviceOutput,
  memory: new Uint8Array(1),
};

const VirtualKeyboard: React.FC = () => {
  const device: DeviceState = useSelector((state : RootState) => state.devices.devices)
    .filter((dev) => dev.id === defaultState.id)[0];
  const dispatch = useDispatch();
  return (
    <div className="Device VirtualKeyboard">
      <input placeholder="Input Character Here" value="" onChange={(event: any) => dispatch(handleVirtualKeyboardInput(device, event))} />
      <div>
        Last Key Input:
        {' '}
        {device.memory ? device.memory[0] : ''}
      </div>
      <div>
      Is requesting interrupt?
        {' '}
        {device.requestingInterrupt ? 'Yes' : 'No'}
      </div>
    </div>
  );
};

export default VirtualKeyboard;
