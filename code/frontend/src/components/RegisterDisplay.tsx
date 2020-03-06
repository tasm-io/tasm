import React from 'react';
import '../App.css';

export interface RegisterDisplayProps {
    name: string
    value: string
}

const RegisterDisplay: React.FC <RegisterDisplayProps> = (register : RegisterDisplayProps) => (
  <div className="RegisterDisplay">
    <span style={{ color: '#ff9f44' }}>{register.name}</span>
      :&nbsp;
    {register.value}
  </div>
);

export default RegisterDisplay;
