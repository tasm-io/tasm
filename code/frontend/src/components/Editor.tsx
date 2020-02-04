import React from 'react';
import AceEditor from 'react-ace';
import '../App.css';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
import { useSelector } from 'react-redux';
/* eslint-disable */
// For some reason the linter doesn't like me using RootState in a lambda :( 
import { RootState } from '../redux/root';
import { Marker } from '../redux/code';
/* eslint-enable */


const Editor: React.FC = () => {
  const code: string = useSelector((state : RootState) => state.code.code);
  const markers: Marker[] = useSelector((state : RootState) => state.code.markers);
  return (
    <div className="Editor">
      <AceEditor
        minLines={10}
        theme="github"
        showPrintMargin={false}
        width={(window.screen.width / 2.5).toString()+"px"}
        value={code}
        onChange={() => {}}
        name="AceEditor"
        editorProps={{ $blockScrolling: true }}
        markers={markers}
        annotations={[{
          row: 0, column: 2, type: 'error', text: 'Some error.',
        }]}
      />
    </div>
  );
};

export default Editor;
