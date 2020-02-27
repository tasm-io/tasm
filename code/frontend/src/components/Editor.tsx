import React from 'react';
import AceEditor from 'react-ace';
import '../App.css';

import 'ace-builds/src-noconflict/theme-dracula';
import { useSelector, useDispatch } from 'react-redux';
/* eslint-disable */
// For some reason the linter doesn't like me using RootState in a lambda :( 
import { RootState } from '../redux/root';
import { Marker, SetCode, SET_CODE } from '../redux/code';
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

const Editor: React.FC = () => {
  const code: string = useSelector((state : RootState) => state.code.code);
  const markers: Marker[] = useSelector((state : RootState) => state.code.markers);
  const displayEditor: boolean = useSelector((state : RootState) => state.code.isDisplayed);
  const dispatch: Function = useDispatch();
  let displayNone = false;
  if (!displayEditor) setTimeout(() => { displayNone = true; }, 1000);
  return (
    <div className={displayEditor ? 'Editor' : 'Editor slide-out-right'} style={displayNone ? { display: 'none' } : {}}>
      <div className="Tabs">
        <button type="button" className="Tab">Code</button>
        <button type="button" className="Tab">Byte Code</button>
      </div>
      <AceEditor
        minLines={10}
        theme="dracula"
        showPrintMargin={false}
        width={`${(window.screen.width / 3).toString()}px`}
        height={`${(window.screen.height / 1.5).toString()}px`}
        value={code}
        onChange={(editorCode) => handleCodeChange(editorCode, dispatch)}
        name="AceEditor"
        style={{ backgroundColor: '#222230', color: '#c8d6e5' }}
        editorProps={{ $blockScrolling: true }}
        markers={markers}
      />
    </div>
  );
};

export default Editor;
