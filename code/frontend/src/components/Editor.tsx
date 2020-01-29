import React from 'react';
import '../App.css';

import { useDispatch, useSelector } from "react-redux";
import {CodeInterface} from '../redux/code'

const Editor: React.FC = () => {
  let code: string = useSelector((state : any) => state.code.code);
  return (
  <div className="Editor">
  <textarea value={code}></textarea>
  </div>
  )
};

export default Editor;
