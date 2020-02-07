import React from 'react';
import '../App.css';
import { useDispatch } from 'react-redux';

function handleAssembleClick(dispatch: Function) {
  // ToDo(Fraz): Pass code to Assembler and handle errors.
  // Should make a new assembler / simulator object each time?
}

function handleStepClick(dispatch: Function) {
  // ToDo(Fraz): Ensure code is assembled and send instruction to simulator to step.
}

function handleRunClick(dispatch: Function) {
  // ToDo(Fraz): This should just frequently call handleStepClick every specified interval.
}

function handleFasterClick(dispatch: Function) {
  // ToDo(Fraz): This should increase the frequency of the run operation.
}

function handleSlowerClick(dispatch: Function) {
  // ToDo(Fraz): This should decrease the frequency of the run operation.
}

function handleStopClick(dispatch: Function) {
  // ToDo(Fraz): This should stop the run command from continuing to execute.
}

const Debugger: React.FC = () => {
  const dispatch = useDispatch;
  return (
    <div className="Debugger Row">
      <button className="Button" type="button" onClick={() => handleAssembleClick(dispatch)}>
        <i className="fa fa-play" />
        <span style={{ marginLeft: '.4em' }}>Assemble</span>
      </button>
      <button className="Button" type="button" onClick={() => handleStepClick(dispatch)}>
        <i className="fa fa-play" />
        <span style={{ marginLeft: '.4em' }}>Step</span>
      </button>
      <button className="Button" type="button" onClick={() => handleRunClick(dispatch)}>
        <i className="fa fa-play" />
        <span style={{ marginLeft: '.4em' }}>Run</span>
      </button>
      <button className="Button" type="button" onClick={() => handleFasterClick(dispatch)}>
        <i className="fa fa-play" />
        <span style={{ marginLeft: '.4em' }}>Faster</span>
      </button>
      <button className="Button" type="button" onClick={() => handleSlowerClick(dispatch)}>
        <i className="fa fa-play" />
        <span style={{ marginLeft: '.4em' }}>Slower</span>
      </button>
      <button className="Button" type="button" onClick={() => handleStopClick(dispatch)}>
        <i className="fa fa-play" />
        <span style={{ marginLeft: '.4em' }}>Stop</span>
      </button>
    </div>
  );
};

export default Debugger;
