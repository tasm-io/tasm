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

function handleAssembleClick(code: string, dispatch: Function) {
  const action: Assemble = {
    type: ASSEMBLE,
    payload: code,
  };
  dispatch(action);
}

function handleStepClick(dispatch: Function) {
  // ToDo(Fraz): Ensure code is assembled and send instruction to simulator to step.
  const action: Step = {
    type: STEP,
    payload: undefined,
  };
  dispatch(action);
}

function handleRunClick(dispatch: Function) {
  const action: SetSimulatorRunning = {
    type: SET_SIMULATOR_RUNNING,
    payload: true,
  };
  // ToDo(Fraz): Create an interval function that steps the same frequency as debugger speed.
  dispatch(action);
}

// increase the frequency of the run operation.
function handleFasterClick(dispatch: Function) {
  const action: ModifyDebuggerSpeed = {
    type: MODIFY_SPEED,
    payload: 250,
  };
  dispatch(action);
}

// decrease the frequency of the run operation.
function handleSlowerClick(dispatch: Function) {
  const action: ModifyDebuggerSpeed = {
    type: MODIFY_SPEED,
    payload: -250,
  };
  dispatch(action);
}

function handleStopClick(dispatch: Function) {
  const action: SetSimulatorRunning = {
    type: SET_SIMULATOR_RUNNING,
    payload: false,
  };
  // ToDo(Fraz): Stop the interval function that steps the same frequency as debugger speed.
  dispatch(action);
}


const Debugger: React.FC = () => {
  const code: string = useSelector((state : RootState) => state.code.code);
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
      <button className="Button" type="button" onClick={() => handleRunClick(dispatch)}>
        <i className="Icon fa fa-play" />
        <div className="buttonText">Run</div>
      </button>
      <button className="Button" type="button" onClick={() => handleStopClick(dispatch)}>
        <i className="Icon fa fa-stop" />
        <div className="buttonText">Stop</div>
      </button>
      <button className="Button" type="button" onClick={() => handleFasterClick(dispatch)}>
        <i className="Icon fa fa-fast-forward" />
        <div className="buttonText">Faster</div>
      </button>
      <button className="Button" type="button" onClick={() => handleSlowerClick(dispatch)}>
        <i className="Icon fa fa-fast-backward" />
        <div className="buttonText">Slower</div>
      </button>
    </div>
  );
};

export default Debugger;
