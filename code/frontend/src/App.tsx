import React from 'react';
import './App.css';

import { useDispatch, useSelector } from 'react-redux';
import StateDisplay from './components/StateDisplay';
import Debugger from './components/Debugger';
import ButtonBox from './components/ButtonBox';
import Editor from './components/Editor';

import { serverURL, siteTitle } from './constants';
// eslint-disable-next-line no-unused-vars
import { RootState } from './redux/root';
// eslint-disable-next-line no-unused-vars
import { SET_CODE, SetCode } from './redux/code';
import RamDisplay from './components/RamDisplay';
import DeviceDisplayTabs from './components/DeviceDisplayTabs';
import Settings from './components/Settings';
import Error from './components/Error';
// eslint-disable-next-line no-unused-vars
import { SimulatorError } from './redux/errors';
import TextDisplay from './components/devices/TextDisplay';

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

function changeTitle() {
  if (Math.floor(Math.random() * 10) === 1) {
    const i: number = Math.floor(Math.random() * siteTitle.length);
    document.title = siteTitle[i];
  }
}

function handleDeviceDisplay(id: number) {
  const res = [
    () => <RamDisplay />,
    () => <TextDisplay />,
    () => <div className="Device">Not Implemented</div>,
    () => <div className="Device">Not Implemented</div>,
    () => <div className="Device">Not Implemented</div>,
  ];
  return res[id]();
}

const App: React.FC = () => {
  const displayEditor: boolean = useSelector((state : RootState) => state.code.isDisplayed);
  const error: SimulatorError = useSelector((state : RootState) => state.errors.errors[0]);
  const activeDevice: number = useSelector((state : RootState) => state.devices.activeDevice);
  const dispatch = useDispatch();
  return (
    <div className="Root">
      {checkURL(dispatch)}
      {changeTitle()}
      <div className="Row">
        <div className="Column LeftBar">
          <h1 className="SiteTitle">tasm.io</h1>
          <ButtonBox />
          <Debugger />
        </div>
        <div className="Column">
          {displayEditor ? <Editor /> : <Settings />}
          {error ? <Error error={error} /> : ''}
        </div>
        <div className="Column" style={{ marginLeft: '5em', marginTop: '6.5em' }}>
          <StateDisplay />
          <br />
          <DeviceDisplayTabs />
          {handleDeviceDisplay(activeDevice)}
        </div>
      </div>
    </div>
  );
};
export default App;
