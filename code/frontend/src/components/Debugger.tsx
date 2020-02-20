import React from 'react';
import '../App.css';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { RootState } from '../redux/root';
import {
  // eslint-disable-next-line no-unused-vars
  ModifyDebuggerSpeed, MODIFY_SPEED,
  // eslint-disable-next-line no-unused-vars
  SetSimulatorRunning, SET_SIMULATOR_RUNNING,
} from '../redux/debugger';

import {
  // eslint-disable-next-line no-unused-vars
  ASSEMBLE, Assemble, STEP, Step,
} from '../redux/simulator';
import { SET_CODE_DISPLAY, SetCodeDisplay } from '../redux/code';

function handleAssembleClick(code: string, dispatch: Function) {
  const assembleAction: Assemble = {
    type: ASSEMBLE,
    payload: code,
  };
  dispatch(assembleAction);
  const debuggerResetAction: SetSimulatorRunning = {
    type: SET_SIMULATOR_RUNNING,
    payload: -2,
  };
  dispatch(debuggerResetAction);
}

function handleStepClick(dispatch: Function) {
  // ToDo(Fraz): Ensure code is assembled and send instruction to simulator to step.
  const action: Step = {
    type: STEP,
    payload: undefined,
  };
  dispatch(action);
}

function runInterval(dispatch: Function) {
  const action: Step = {
    type: STEP,
    payload: undefined,
  };
  dispatch(action);
}

function handleRunClick(dispatch: Function, running: number, speed: number) {
  const handle: number = setInterval(runInterval, speed, dispatch, running);
  const action: SetSimulatorRunning = {
    type: SET_SIMULATOR_RUNNING,
    payload: handle,
  };
  dispatch(action);
}

function handleStopClick(dispatch: Function, running: number) {
  const action: SetSimulatorRunning = {
    type: SET_SIMULATOR_RUNNING,
    payload: -1,
  };
  clearInterval(running);
  dispatch(action);
}

function handleSettingsClick(value: boolean, dispatch: Function) {
  const action: SetCodeDisplay = {
    type: SET_CODE_DISPLAY,
    payload: value,
  };
  dispatch(action);
}


const Debugger: React.FC = () => {
  const code: string = useSelector((state : RootState) => state.code.code);
  const running: number = useSelector((state : RootState) => state.debugger.running);
  const speed: number = useSelector((state : RootState) => state.debugger.speed);
  const displayEditor: boolean = useSelector((state : RootState) => state.code.isDisplayed);
  const dispatch = useDispatch();
  return (
    <div className="Column">
      <button className="Button" type="button" onClick={() => handleAssembleClick(code, dispatch)}>
        <i className="Icon fa fa-cog Rotate" />
        <div className="buttonText">Assemble</div>
      </button>
      <button className="Button" type="button" onClick={() => handleStepClick(dispatch)}>
        <i className="Icon fa fa-arrow-right Step" />
        <div className="buttonText">Step</div>
      </button>
      <button className="Button" type="button" style={running > 0 ? { color: '#11ac84' } : {}} onClick={() => handleRunClick(dispatch, running, speed)}>
        <i className="Icon fa fa-play" />
        <div className="buttonText">Run</div>
      </button>
      <button className="Button" style={running === -1 ? { color: 'tomato' } : {}} type="button" onClick={() => handleStopClick(dispatch, running)}>
        <i className="Icon fa fa-stop" />
        <div className="buttonText">Stop</div>
      </button>
      <hr style={{width: '100%'}} />
      <button className="Button" type="button">
        <i className="Icon fa fa-info-circle" />
        <div className="buttonText">User Guide</div>
      </button>
      <button className="Button" type="button" onClick={() => handleSettingsClick(!displayEditor, dispatch)}>
        <i className="Icon fa fa-wrench" />
        <div className="buttonText">Settings</div>
      </button>
    </div>
  );
};

export default Debugger;
