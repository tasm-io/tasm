import React from 'react';
import '../App.css';

export interface RegisterDisplayProps {
    name: string
    value: string
}

const RegisterDisplay: React.FC <RegisterDisplayProps> = (register : RegisterDisplayProps) => (
  <div className="RegisterDisplay">
    {register.name}
      :&nbsp;
    {register.value}
  </div>
);

export default RegisterDisplay;
