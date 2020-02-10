import React from 'react';
import '../App.css';
import { useDispatch } from 'react-redux';
import {
  // eslint-disable-next-line no-unused-vars
  ModifyDebuggerSpeed, MODIFY_SPEED,
  // eslint-disable-next-line no-unused-vars
  SetSimulatorRunning, SET_SIMULATOR_RUNNING,
} from '../redux/debugger';

function handleAssembleClick(_dispatch: Function) {
  // ToDo(Fraz): Pass code to Assembler and handle errors.
  // Should make a new assembler / simulator object each time?
}

function handleStepClick(_dispatch: Function) {
  // ToDo(Fraz): Ensure code is assembled and send instruction to simulator to step.
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
  const dispatch = useDispatch();
  return (
    <div className="Debugger Row">
      <button className="Button" type="button" onClick={() => handleAssembleClick(dispatch)}>
        <i className="Icon fa fa-cog" />
        <div style={{ marginLeft: '.4em' }}>Assemble</div>
      </button>
      <button className="Button" type="button" onClick={() => handleStepClick(dispatch)}>
        <i className="Icon fa fa-arrow-right" />
        <div style={{ marginLeft: '.4em' }}>Step</div>
      </button>
      <button className="Button" type="button" onClick={() => handleRunClick(dispatch)}>
        <i className="Icon fa fa-play" />
        <div style={{ marginLeft: '.4em' }}>Run</div>
      </button>
      <button className="Button" type="button" onClick={() => handleStopClick(dispatch)}>
        <i className="Icon fa fa-stop" />
        <div style={{ marginLeft: '.4em' }}>Stop</div>
      </button>
      <button className="Button" type="button" onClick={() => handleFasterClick(dispatch)}>
        <i className="Icon fa fa-fast-forward" />
        <div style={{ marginLeft: '.4em' }}>Faster</div>
      </button>
      <button className="Button" type="button" onClick={() => handleSlowerClick(dispatch)}>
        <i className="Icon fa fa-fast-backward" />
        <div style={{ marginLeft: '.4em' }}>Slower</div>
      </button>
    </div>
  );
};

export default Debugger;
