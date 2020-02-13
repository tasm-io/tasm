import React from 'react';
import '../App.css';

import { useSelector } from 'react-redux';
/* eslint-disable */
// For some reason the linter doesn't like me using RootState in a lambda :( 
import { RootState } from '../redux/root';
/* eslint-enable */

const Editor: React.FC = () => {
  const code: string = useSelector((state : RootState) => state.code.code);
  return (
    <div className="Editor">
      <textarea defaultValue={code} />
    </div>
  );
};

export default Editor;
