import React from 'react';
import '../App.css';

import LoadFile from './LoadFile';
import Share from './Share';

const EditorButtons: React.FC = () => (
  <div className="Column">
    <LoadFile />
    <Share />
    <button type="button" className="Button">
      <i className="Icon fa fa-indent" />
      <div className="buttonText">Format Code</div>
    </button>
  </div>
);

export default EditorButtons;
