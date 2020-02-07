import React from 'react';
import '../App.css';
import RegisterDisplay from './RegisterDisplay';


const StateDisplay: React.FC = () => (
  <div className="StateDisplay">
    <div className="Row" style={{ marginTop: '2em' }}>
      <RegisterDisplay name="AL" value="0000 0000" />
      <RegisterDisplay name="BL" value="0000 0000" />
      <RegisterDisplay name="CL" value="0000 0000" />
      <RegisterDisplay name="DL" value="0000 0000" />
    </div>
    <div className="Row" style={{ marginTop: '2em' }}>
      <RegisterDisplay name="IP" value="0000 0000" />
      <RegisterDisplay name="SP" value="0000 0000" />
      <RegisterDisplay name="SR" value="0000 0000" />
      <div className="RegisterDisplay" />
    </div>
  </div>
);

export default StateDisplay;
