import React from 'react';
import '../App.css';
import { useSelector } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { RootState } from '../redux/root';
import { Register } from '../instructionset/instructionset';
import RegisterDisplay from './RegisterDisplay';

function prettyDisplay(num: number): string {
  let s = num.toString(2);
  if (s.length < 8) s = s.padStart(8, '0');
  s = `${s.slice(0, 4)} ${s.slice(4, 8)}`;
  return s;
}

const StateDisplay: React.FC = () => {
  const registers: Uint8Array = useSelector((state : RootState) => state.simulator.registers);
  return (
    <div className="StateDisplay">
      <div className="Row" style={{ marginTop: '2em' }}>
        <RegisterDisplay name="AL" value={prettyDisplay(registers[Register.AL])} />
        <RegisterDisplay name="BL" value={prettyDisplay(registers[Register.BL])} />
        <RegisterDisplay name="CL" value={prettyDisplay(registers[Register.CL])} />
        <RegisterDisplay name="DL" value={prettyDisplay(registers[Register.DL])} />
      </div>
      <div className="Row" style={{ marginTop: '2em' }}>
        <RegisterDisplay name="IP" value={prettyDisplay(registers[Register.IP])} />
        <RegisterDisplay name="SP" value={prettyDisplay(registers[Register.SP])} />
        <RegisterDisplay name="SR" value={prettyDisplay(registers[Register.SR])} />
        <div className="RegisterDisplay" />
      </div>
    </div>
  );
};

export default StateDisplay;
