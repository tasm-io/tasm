import React from 'react';
import '../App.css';

import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { SET_CODE_DISPLAY, SetCodeDisplay } from '../redux/code';

// eslint-disable-next-line no-unused-vars
import { RootState } from '../redux/root';

function handleSettingsClick(value: boolean, dispatch: Function) {
  const action: SetCodeDisplay = {
    type: SET_CODE_DISPLAY,
    payload: value,
  };
  dispatch(action);
}

const UserButtons: React.FC = () => {
  const dispatch = useDispatch();
  const displayEditor: boolean = useSelector((state : RootState) => state.code.isDisplayed);
  return (
    <div className="Column">
      <a style={{ textDecoration: 'none' }} href="https://gitlab.computing.dcu.ie/fradls2/2020-ca326-sfradl-tasm/blob/master/user_manual/user_manual.md">
        <button className="Button" type="button">
          <i className="Icon fa fa-info-circle" />
          <div className="buttonText">User Guide</div>
        </button>
      </a>
      <button className="Button" type="button" onClick={() => handleSettingsClick(!displayEditor, dispatch)}>
        <i className="Icon fa fa-wrench" />
        <div className="buttonText">Settings</div>
      </button>
    </div>
  );
};

export default UserButtons;
