import React from 'react';
import '../App.css';

import FileUpload from './FileUpload';
import Share from './Share';

const ButtonBox: React.FC = () => (
  <div className="ButtonBox">
    <div className="Column">
      <FileUpload />
      <Share />
      <button type="button" className="Button">
        <i className="Icon fa fa-indent" />
        <div className="buttonText">Format Code</div>
      </button>
    </div>
    <hr />
  </div>
);

export default ButtonBox;
