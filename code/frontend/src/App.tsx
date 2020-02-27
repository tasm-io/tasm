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
import VirtualKeyboard from './components/devices/VirtualKeyboard';
import SevenSegment from './components/devices/SevenSegment';
import TrafficLights from './components/devices/TrafficLights';

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
    const url: string = s.slice(4, s.length).join('');
    fetchCode(url, dispatch);
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
    () => {},
    () => {},
    () => <RamDisplay />,
    () => <TextDisplay />,
    () => <VirtualKeyboard />,
    () => <SevenSegment />,
    () => <TrafficLights />,
  ];
  return res[id]();
}

function enableHotkeys() {
  function handleHotkey(e: any) {
    if (e.altKey && e.which === 82) {
      document.getElementById('run')!.click(); // alt + r
    } else if (e.altKey && e.which === 69) {
      document.getElementById('stop')!.click(); // alt + e
    } else if (e.altKey && e.which === 83) {
      document.getElementById('step')!.click(); // alt + s
    } else if (e.altKey && e.which === 65) {
      document.getElementById('assemble')!.click(); // alt + a
    } else if (e.altKey && e.which === 76) {
      document.getElementById('fileUpload')!.click(); // alt + l
    }
  }
  document.onkeyup = (e) => handleHotkey(e);
}

const App: React.FC = () => {
  const displayEditor: boolean = useSelector((state : RootState) => state.code.isDisplayed);
  const error: SimulatorError = useSelector((state : RootState) => state.errors.errors[0]);
  const activeDevice: number = useSelector((state : RootState) => state.simulator.activeDevice);
  const dispatch = useDispatch();
  return (
    <div className="Root">
      {checkURL(dispatch)}
      {enableHotkeys()}
      {changeTitle()}
      <div className="Row">
        <div className="Column LeftBar" aria-label="Left menu">
          <h1 className="SiteTitle">tasm.io</h1>
          <ButtonBox />
          <Debugger />
        </div>
        <div className="Column">
          {displayEditor ? <Editor /> : <Settings />}
          {error ? <Error aria-label="Error" error={error} /> : ''}
        </div>
        <div className="Column RightBar">
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
