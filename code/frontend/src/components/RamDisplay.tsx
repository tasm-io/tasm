import React from 'react';
import '../App.css';
import { useSelector } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { RootState } from '../redux/root';
import {
  // eslint-disable-next-line no-unused-vars
  Register, Opcode, OperandTypes, Operand,
} from '../instructionset/instructionset';

function displayTableTop() {
  const res: any = [];
  res.push(<th key="blank">&nbsp;</th>);
  for (let i = 0; i < 16; i += 1) {
    res.push(<th key={i}>{`0${Number(i).toString(16).toUpperCase()}`}</th>);
  }
  return res;
}

function styleArgs(address: number, ip: number, ram: Uint8Array) {
  const args: Operand[] = OperandTypes[ram[ip] as Opcode] || [];
  if (address === ip + 1 && args.length > 0) {
    return true;
  } if (address === ip + 2 && args.length > 1) {
    return true;
  }
  return false;
}

function styleAddress(address: number, ram: Uint8Array, ip: number, sp: number) {
  if (address === ip || styleArgs(address, ip, ram)) {
    return 'IP';
  } if (address === sp) {
    return 'SP';
  }
  return '';
}

function formatRamValue(val: number) {
  let s: string = Number(val).toString(16).toUpperCase();
  if (s.length === 1) s = `0${s}`;
  return s;
}

function mapRows(start: number, ram: Uint8Array, ip:number, sp:number) {
  const res: any = [];
  for (let i = 0; i < 16; i += 1) {
    res.push(
      <td key={start + i} className={styleAddress(start + i, ram, ip, sp)}>
        {formatRamValue(ram[start + i])}
      </td>,
    );
  }
  return res;
}

function mapRam(ram: Uint8Array, ip:number, sp:number) {
  const res: any = [];
  for (let i = 0; i < 16; i += 1) {
    res.push(
      <tr key={i}>
        <th key={`${i}0`} scope="row">{`${Number(i).toString(16).toUpperCase()}0`}</th>
        {mapRows(i * 16, ram, ip, sp)}
      </tr>,
    );
  }
  return res;
}

const RamDisplay: React.FC = () => {
  const ram: Uint8Array = useSelector((state : RootState) => state.simulator.ram);
  const ip: number = useSelector((state : RootState) => state.simulator.registers[Register.IP]);
  const sp: number = useSelector((state : RootState) => state.simulator.registers[Register.SP]);
  return (
    <table className="RamDisplay">
      <thead>
        <tr>
          {displayTableTop()}
        </tr>
      </thead>
      <tbody>
        {mapRam(ram, ip, sp)}
      </tbody>
      <tfoot>
        <tr>
          <td className="IP">Instruction Pointer</td>
          <td className="SP">Stack Pointer</td>
        </tr>
      </tfoot>
    </table>
  );
};

export default RamDisplay;
