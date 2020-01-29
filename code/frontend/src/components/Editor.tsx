import React from 'react';
import '../App.css';

import { useSelector } from 'react-redux';

const Editor: React.FC = () => {
  const code: string = useSelector((state : any) => state.code.code);
  return (
    <div className="Editor">
      <textarea defaultValue={code} />
    </div>
  );
};

export default Editor;
