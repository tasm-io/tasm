import React from 'react';
import './App.css';

import StateDisplay from './components/StateDisplay';
import Debugger from './components/Debugger';
import ButtonBox from './components/ButtonBox';
import Editor from './components/Editor';

const App: React.FC = () => (
  <div className="Root">
    <div className="Row" style={{ margin: '1em' }}>
      <StateDisplay />
      <Debugger />
      <ButtonBox />
    </div>
    <div className="Row">
      <Editor />
      <div className="Column" />
    </div>
  </div>
);

export default App;
