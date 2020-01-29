import React from 'react';
import '../App.css';

import FileUpload from './FileUpload'

const ButtonBox: React.FC = () => (
  <div className="ButtonBox">
      <div className="Column">
          <FileUpload />
          <button className="Button">Share</button>
          <button className="Button">Format</button>
      </div>
  </div>
);

export default ButtonBox;
