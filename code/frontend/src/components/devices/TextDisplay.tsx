/* eslint-disable import/no-cycle */
import React from 'react';
import '../../App.css';

// eslint-disable-next-line no-unused-vars
import { useSelector } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { DeviceState } from '../../cpu/cpu';
// eslint-disable-next-line no-unused-vars
import { RootState } from '../../redux/root';

function mapRow(row: number[]) {
  const res: any = [];
  row.map((s) => {
    res.push(
      <td>
        {String.fromCharCode(s)}
      </td>,
    );
    return undefined;
  });
  return res;
}

const deviceInput = (device: DeviceState, input: number) => {
  const nextStoreIndex: number = 16 * 4;
  const next: number = device.memory![nextStoreIndex];
  const nextState = Object.assign(device);
  nextState.memory![next] = input;
  nextState.memory![nextStoreIndex] = (next + 1) % nextStoreIndex;
  return nextState;
};

const deviceOutput = (_dev: DeviceState) => 0;

export const defaultState: DeviceState = {
  id: 3,
  requestingInterrupt: false,
  input: deviceInput,
  output: deviceOutput,
  memory: new Uint8Array((16 * 4) + 1),
};


const TextDisplay: React.FC = () => {
  const device: DeviceState = useSelector((state : RootState) => state.simulator.devices)
    .filter((dev: DeviceState) => dev.id === defaultState.id)[0];
  const mem: number[] = Object.assign(device.memory!);
  return (
    <div className="Device">
      <table className="TextDisplay">
        <tbody>
          <tr>
            {mapRow(mem.slice(0, 16))}
          </tr>
          <tr>
            {mapRow(mem.slice(16, 32))}
          </tr>
          <tr>
            {mapRow(mem.slice(32, 48))}
          </tr>
          <tr>
            {mapRow(mem.slice(48, 64))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TextDisplay;
