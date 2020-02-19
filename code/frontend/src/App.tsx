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
  }
}

function displayNotices(noticesState: NoticesInterface) {
  const notices: any = [];
  noticesState.notices.map((n: NoticeInterface) => {
    if (n.dismissed === false) {
      notices.push(<Notice message={n.message} />);
    }
    return undefined;
  });
  return notices;
}

const App: React.FC = () => {
  const dispatch = useDispatch();
  const noticesState: NoticesInterface = useSelector((state : RootState) => state.notices);
  return (
    <div className="Root">
      <div className="Row">
        <div className="Column" style={{width: '15em', marginTop: '8em', float: 'right', marginLeft: '5em'}}>
          <ButtonBox />
          <Debugger />
        </div>
        <div className="Column">
          <Editor />
        </div>
        <div className="Column" style={{width: '33%', marginLeft: '5em', marginTop: '10em'}}>
          <StateDisplay />
          <hr />
          <div>Tabs</div>
          <RamDisplay />
        </div>
      </div>
    </div>
  );
};
export default App;
