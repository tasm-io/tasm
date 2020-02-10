import React from 'react';
import AceEditor from 'react-ace';
import '../App.css';

import 'ace-builds/src-noconflict/theme-github';
import { useSelector, useDispatch } from 'react-redux';
/* eslint-disable */
// For some reason the linter doesn't like me using RootState in a lambda :( 
import { RootState } from '../redux/root';
import { Marker, SetCode, SET_CODE } from '../redux/code';
/* eslint-enable */

// Handle changes in the code and send the changes to the redux store.
function handleCodeChange(code: string, dispatch: Function) {
  const action: SetCode = {
    payload: code,
    type: SET_CODE,
  };
  dispatch(action);
}

const Editor: React.FC = () => {
  const code: string = useSelector((state : RootState) => state.code.code);
  const markers: Marker[] = useSelector((state : RootState) => state.code.markers);
  const dispatch: Function = useDispatch();
  return (
    <div className="Editor">
      <AceEditor
        minLines={10}
        theme="github"
        showPrintMargin={false}
        width={`${(window.screen.width / 2.5).toString()}px`}
        value={code}
        onChange={(editorCode) => handleCodeChange(editorCode, dispatch)}
        name="AceEditor"
        editorProps={{ $blockScrolling: true }}
        markers={markers}
      />
    </div>
  );
};

export default Editor;
