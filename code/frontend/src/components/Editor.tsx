import React from 'react';
import '../App.css';

import { useSelector } from 'react-redux';
import { RootState } from '../redux/root'

const Editor: React.FC = () => {
  const code: string = useSelector((state : RootState) => state.code.code);
  return (
    <div className="Editor">
      <textarea defaultValue={code} />
    </div>
  );
};

export default Editor;
