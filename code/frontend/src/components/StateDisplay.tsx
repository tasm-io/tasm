import React from 'react';
import '../App.css';
import { useSelector } from 'react-redux';
import { Register } from '../instructionset/instructionset';
import RegisterDisplay from './RegisterDisplay';
// eslint-disable-next-line
import { RootState } from '../redux/root';

export function prettyDisplay(base: number, num: number): string {
  let s: string;
  if (base === 2) {
    s = num.toString(2);
    if (s.length < 8) s = s.padStart(8, '0');
    s = `${s.slice(0, 4)} ${s.slice(4, 8)}`;
  } else if (base === 16) {
    s = num.toString(16).toUpperCase();
    if (s.length === 1) s = `0${s}`;
  } else {
    s = num.toString();
    while (s.length !== 3) s = `0${s}`;
  }
  return s;
}

const StateDisplay: React.FC = () => {
  const registers: Uint8Array = useSelector((state : RootState) => state.simulator.registers);
  const cycles: number = useSelector((state : RootState) => state.simulator.cycles);
  const base: number = useSelector((state : RootState) => state.debugger.registerDisplay);
  return (
    <div className="StateDisplay Row" aria-label="Registers">
      <div className="Column">
        <RegisterDisplay name="AL" value={prettyDisplay(base, registers[Register.AL])} />
        <RegisterDisplay name="BL" value={prettyDisplay(base, registers[Register.BL])} />
        <RegisterDisplay name="CL" value={prettyDisplay(base, registers[Register.CL])} />
        <RegisterDisplay name="DL" value={prettyDisplay(base, registers[Register.DL])} />
      </div>
      <div className="Column">
        <RegisterDisplay name="IP" value={prettyDisplay(base, registers[Register.IP])} />
        <RegisterDisplay name="SP" value={prettyDisplay(base, registers[Register.SP])} />
        <RegisterDisplay name="SR" value={prettyDisplay(base, registers[Register.SR])} />
        <RegisterDisplay name="Cycles" value={cycles.toString()} />
        <div className="RegisterDisplay" />
      </div>
    </div>
  );
};

export default StateDisplay;
