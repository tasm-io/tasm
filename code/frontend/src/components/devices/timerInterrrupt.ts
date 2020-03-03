// eslint-disable-next-line no-unused-vars
import { DeviceState } from '../../cpu/cpu';

const input = (device: DeviceState, _input: number) => device;

const output = (_device: DeviceState) => 0;

const timerInterrupt: DeviceState = {
  id: 7,
  requestingInterrupt: false,
  output,
  input,
};

export default timerInterrupt;
