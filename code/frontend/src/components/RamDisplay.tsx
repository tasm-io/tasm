import React from 'react';
import '../App.css';
import { useSelector } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { RootState } from '../redux/root';

function displayTableTop() {
  const res: any = [];
  res.push(<th>&nbsp;</th>);
  for (let i = 0; i < 16; i += 1) {
    res.push(<th>{Number(i).toString(16).toUpperCase()}</th>);
  }
  return res;
}

function mapRow(numbers: Uint8Array) {
  const res: any = [];
  for (let i = 0; i < numbers.length; i += 1) {
    res.push(<td>{Number(numbers[i]).toString(16).toUpperCase()}</td>);
  }
  return res;
}

function mapRam(ram: Uint8Array) {
  const res: any = [];
  let j = 0;
  for (let i = 0; i < 256; i += 16) {
    res.push(
      <tr>
        <th scope="row" className="leftCol">{Number(j).toString(16).toUpperCase()}</th>
        {mapRow(ram.slice(i, i + 16))}
      </tr>,
    );
    j += 1;
  }
  return res;
}

const RamDisplay: React.FC = () => {
  const ram: Uint8Array = useSelector((state : RootState) => state.simulator.ram);
  return (
    <table className="RamDisplay">
      <thead>
        <tr>
          {displayTableTop()}
        </tr>
      </thead>
      <tbody>
        {mapRam(ram)}
      </tbody>
    </table>
  );
};

export default RamDisplay;
