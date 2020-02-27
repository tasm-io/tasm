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

const svgCircleData: string = 'M82.7 80.7L71.24 89.02L57.78 93.4L43.62 93.4L30.15 89.02L18.7 80.7L10.38 69.24L6 55.78L6 41.62L10.38 28.15L18.7 16.7L30.15 8.38L43.62 4L57.78 4L71.24 8.38L82.7 16.7L91.02 28.15L95.4 41.62L95.4 55.78L91.02 69.24L82.7 80.7Z';

const to8BitArray = (n: number) => {
  const bin: number[] = n.toString(2).split('').map((s) => Number(s));
  const res = new Array<number>(8 - bin.length).fill(0).concat(bin);
  return res;
};

const drawTrafficLights = (mem: number) => {
  const memory: number[] = to8BitArray(mem);
  return (
    <div className="TrafficLights">
      <div className="TrafficLight">
        <svg width="100" height="100">
          <path style={memory[0] ? { fill: 'green' } : { fill: 'grey' }} d={svgCircleData} />
        </svg>
        <svg width="100" height="100">
          <path style={memory[1] ? { fill: 'yellow' } : { fill: 'grey' }} d={svgCircleData} />
        </svg>
        <svg width="100" height="100">
          <path style={memory[2] ? { fill: 'red' } : { fill: 'grey' }} d={svgCircleData} />
        </svg>
      </div>
      <div className="TrafficLight">
        <svg width="100" height="100">
          <path style={memory[5] ? { fill: 'green' } : { fill: 'grey' }} d={svgCircleData} />
        </svg>
        <svg width="100" height="100">
          <path style={memory[6] ? { fill: 'yellow' } : { fill: 'grey' }} d={svgCircleData} />
        </svg>
        <svg width="100" height="100">
          <path style={memory[7] ? { fill: 'red' } : { fill: 'grey' }} d={svgCircleData} />
        </svg>
      </div>
    </div>
  );
};

const deviceInput = (device: DeviceState, input: number) => {
  const nextState = Object.assign(device);
  nextState.memory[0] = input;
  return nextState;
};

const deviceOutput = (dev: DeviceState) => dev.memory![0];

export const defaultState: DeviceState = {
  id: 6,
  requestingInterrupt: false,
  input: deviceInput,
  output: deviceOutput,
  memory: new Uint8Array(1).fill(7),
};

const TrafficLights: React.FC = () => {
  const device: DeviceState = useSelector((state : RootState) => state.simulator.devices)
    .filter((dev: DeviceState) => dev.id === defaultState.id)[0];
  return (
    <div className="Device Column">
      {drawTrafficLights(device.memory![0])}
      <div>
          Value:
        {' '}
        {prettyDisplay(2, device.memory![0])}
      </div>
    </div>
  );
};

export default TrafficLights;
