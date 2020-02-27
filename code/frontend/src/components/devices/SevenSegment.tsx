/* eslint-disable import/no-cycle */
import React from 'react';
import '../../App.css';

// eslint-disable-next-line no-unused-vars
import { useSelector } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { DeviceState } from '../../cpu/cpu';
// eslint-disable-next-line no-unused-vars
import { RootState } from '../../redux/root';
import { prettyDisplay } from '../StateDisplay';

const segments: number[][][] = [
  [[10, 10], [20, 0], [80, 0], [90, 10], [80, 20], [20, 20]],
  [[90, 10], [100, 20], [100, 80], [90, 90], [80, 80], [80, 20]],
  [[90, 90], [100, 100], [100, 160], [90, 170], [80, 160], [80, 100]],
  [[90, 170], [80, 180], [20, 180], [10, 170], [20, 160], [80, 160]],
  [[10, 170], [0, 160], [0, 100], [10, 90], [20, 100], [20, 160]],
  [[10, 90], [0, 80], [0, 20], [10, 10], [20, 20], [20, 80]],
  [[10, 90], [20, 80], [80, 80], [90, 90], [80, 100], [20, 100]],
];

const to8BitArray = (n: number) => {
  const bin: number[] = n.toString(2).split('').map((s) => Number(s));
  const res = new Array<number>(8 - bin.length).fill(0).concat(bin);
  return res;
};

const mapDigit = (n: number) => {
  const displayMem = to8BitArray(n);
  const res: any[] = [];
  displayMem.shift();
  displayMem.map((val: number, i) => {
    if (val) {
      res.push(
        <polygon
          points={segments[i].toString()}
          fill="#11ac84"
        />,
      );
    }
    return val;
  });
  return res;
};


const deviceInput = (device: DeviceState, input: number) => {
  const full = to8BitArray(input);
  const nextState = Object.assign(device);
  if (full[0] === 1) nextState.memory![1] = input;
  else { nextState.memory![0] = input; }
  return nextState;
};

const deviceOutput = (_dev: DeviceState) => 0;

export const defaultState: DeviceState = {
  id: 3,
  requestingInterrupt: false,
  input: deviceInput,
  output: deviceOutput,
  memory: new Uint8Array(2).fill(255),
};

const SevenSegment: React.FC = () => {
  const device: DeviceState = useSelector((state : RootState) => state.simulator.devices)
    .filter((dev: DeviceState) => dev.id === defaultState.id)[0];
  return (
    <div className="Device SevenSegment">
      <div>
        <svg height="200" width="100" style={{ marginRight: '1em' }}>
          {mapDigit(device.memory![0])}
        </svg>
        <svg height="200" width="100" style={{ marginRight: '1em' }}>
          {mapDigit(device.memory![1])}
        </svg>
      </div>
      <div className="Row DisplayInfo">
        <div>
          Left Display Value:
          {' '}
          {prettyDisplay(2, device.memory![0])}
        </div>
        <div>
          Right Display Value:
          {' '}
          {prettyDisplay(2, device.memory![1])}
        </div>
      </div>
    </div>
  );
};

export default SevenSegment;
