import React from 'react';
import './App.css';

import { useDispatch, useSelector } from 'react-redux';
import StateDisplay from './components/StateDisplay';
import Debugger from './components/Debugger';
import EditorButtons from './components/EditorButtons';
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
import UserButtons from './components/UserButtons';

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
    // eslint-disable-next-line no-restricted-globals
    history.pushState(null, '', '/');
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
    if (!e.ctrlKey || !e.shiftKey) return undefined;
    switch (e.which) {
    case (88): {
      document.getElementById('run')!.click(); // ctrl + shift + x
      break;
    } case (81): {
      document.getElementById('stop')!.click(); // ctrl + shift + q
      break;
    } case (83): {
      document.getElementById('step')!.click(); // ctrl + shift + s
      break;
    } case (65): {
      document.getElementById('assemble')!.click(); // ctrl + shift + a
      break;
    } case (76): {
      document.getElementById('fileUpload')!.click(); // // ctrl + shift + l
      break;
    } case (90): {
      document.getElementById('share')!.click(); // // ctrl + shift + z
      break;
    } case (70): {
      document.getElementById('format')!.click(); // // ctrl + shift + f
      break;
    }
    default: {
      break;
    }
    }
    return undefined;
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
          <EditorButtons />
          <hr style={{ width: '100%' }} />
          <Debugger />
          <hr style={{ width: '100%' }} />
          <UserButtons />
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
