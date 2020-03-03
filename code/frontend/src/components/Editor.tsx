import React from 'react';
import AceEditor from 'react-ace';
import '../App.css';

import 'ace-builds/src-noconflict/theme-dracula';


import { useSelector, useDispatch } from 'react-redux';
/* eslint-disable */
// For some reason the linter doesn't like me using RootState in a lambda :( 
import { RootState } from '../redux/root';
import {SetCode, SET_CODE } from '../redux/code';
import { Register } from '../instructionset/instructionset';
/* eslint-enable */

// Handle changes in the code and send the changes to the redux store.
function handleCodeChange(code: string, dispatch: Function) {
  localStorage.setItem('code', code);
  const action: SetCode = {
    payload: code,
    type: SET_CODE,
  };
  dispatch(action);
}


interface Marker {
  startRow: number
  startCol: number
  endRow: number
  endCol: number
  className: string
  type: string,
}

const Editor: React.FC = () => {
  const code: string = useSelector((state : RootState) => state.code.code);
  const displayEditor: boolean = useSelector((state : RootState) => state.code.isDisplayed);
  /* const IP: number = useSelector((state : RootState) => state.simulator.registers[Register.IP]);
  const editorLines: (null | number)[] = useSelector((state : RootState)
  => state.simulator.editorLines);
  const marker: Marker = {
    startRow: 3,
    startCol: 1,
    endRow: 4,
    endCol: 9009090000,
    className: 'EditorMarker',
    type: 'background',
  };
  console.log(marker);
  */
  const dispatch: Function = useDispatch();
  let displayNone = false;
  if (!displayEditor) setTimeout(() => { displayNone = true; }, 1000);
  return (
    <div className={displayEditor ? 'Editor' : 'Editor slide-out-right'} style={displayNone ? { display: 'none' } : {}}>
      <div className="Tabs">
        <button type="button" className="Tab">Code</button>
      </div>
      <AceEditor
        aria-label="Code Editor"
        minLines={10}
        theme="dracula"
        showPrintMargin={false}
        height={`${(window.screen.height / 1.5).toString()}px`}
        value={code}
        onChange={(editorCode) => handleCodeChange(editorCode, dispatch)}
        name="AceEditor"
        style={{ backgroundColor: '#222230', color: '#c8d6e5' }}
        editorProps={{ $blockScrolling: true }}
        // markers={}
      />
    </div>
  );
};

export default Editor;
