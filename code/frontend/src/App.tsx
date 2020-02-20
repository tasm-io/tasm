import React from 'react';
import './App.css';

import { useDispatch, useSelector } from 'react-redux';
import StateDisplay from './components/StateDisplay';
import Debugger from './components/Debugger';
import ButtonBox from './components/ButtonBox';
import Editor from './components/Editor';

import { serverURL } from './constants';
import Notice from './components/Notice';
// eslint-disable-next-line no-unused-vars
import { NoticesInterface, NoticeInterface } from './redux/notices';
// eslint-disable-next-line no-unused-vars
import { RootState } from './redux/root';
// eslint-disable-next-line no-unused-vars
import { SET_CODE, SetCode } from './redux/code';
import RamDisplay from './components/RamDisplay';
import DeviceDisplayTabs from './components/DeviceDisplayTabs';
import Settings from './components/Settings';

function setCode(code: string, dispatch: Function) {
  const action: SetCode = {
    type: SET_CODE,
    payload: code,
  };
  dispatch(action);
}

function fetchCode(id: string, dispatch: Function) {
  const url = `${serverURL}/request?id=${id}`;
  fetch(url).then((resp) => { resp.text().then((code) => setCode(code, dispatch)); }).catch(() => {
    setCode('TASM is unable to succcesfully contact the server...', dispatch);
  });
}

function checkURL(dispatch: Function) {
  const { href } = window.location;
  const s: string[] = href.split('/');
  if (s.length >= 4 && s[3].toLowerCase() === 'share') {
    setCode('Loading Code...', dispatch);
    fetchCode(s[4], dispatch);
  } else if (localStorage.getItem('code')) {
    setCode(localStorage.getItem('code') as string, dispatch);
  }
}

const App: React.FC = () => {
  const displayEditor: boolean = useSelector((state : RootState) => state.code.isDisplayed);
  const dispatch = useDispatch();
  return (
    <div className="Root">
      {checkURL(dispatch)}
      <div className="Row">
        <div
          className="Column"
          style={{
            marginTop: '8em', marginLeft: '5em',
          }}
        >
          <h1 className="SiteTitle text-shadow-drop-center">tasm.io</h1>
          <ButtonBox />
          <Debugger />
        </div>
        <div className="Column">
          {displayEditor ? <Editor /> : <Settings />}
        </div>
        <div className="Column" style={{ marginLeft: '5em', marginTop: '6.5em' }}>
          <StateDisplay />
          <br />
          <DeviceDisplayTabs />
          <RamDisplay />
        </div>
      </div>
    </div>
  );
};
export default App;
