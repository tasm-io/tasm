import React from 'react';
import '../App.css';

import LoadFile from './LoadFile';
import Share from './Share';
import Format from './Format';

const EditorButtons: React.FC = () => (
  <div className="Column">
    <LoadFile />
    <Share />
    <Format />
  </div>
);

export default EditorButtons;
