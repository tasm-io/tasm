import React from 'react';
import '../App.css';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { RootState } from '../redux/root';
import {
  // eslint-disable-next-line no-unused-vars
  SetSimulatorRunning, SET_SIMULATOR_RUNNING,
} from '../redux/debugger';

import {
  // eslint-disable-next-line no-unused-vars
  ASSEMBLE, Assemble, STEP, Step,
} from '../redux/simulator';
import {
  // eslint-disable-next-line no-unused-vars
  ADD_ERROR, ErrorTypes, ResetErrors, RESET_ERRORS,
} from '../redux/errors';

function handleError(err: Error, dispatch: Function) {
  dispatch({
    type: ADD_ERROR,
    payload: {
      type: ErrorTypes.Bad,
      title: 'Simulator Error',
      message: err.message,
    },
  });
}

function handleStopClick(dispatch: Function, running: number) {
  const action: SetSimulatorRunning = {
    type: SET_SIMULATOR_RUNNING,
    payload: -1,
  };
  clearInterval(running);
  dispatch(action);
}

function handleAssembleClick(code: string, dispatch: Function, running: number) {
  handleStopClick(dispatch, running);
  const resetErrorsAction: ResetErrors = {
    type: RESET_ERRORS,
    payload: undefined,
  };
  const assembleAction: Assemble = {
    type: ASSEMBLE,
    payload: code,
  };
  try {
    dispatch(resetErrorsAction);
    dispatch(assembleAction);
  } catch (error) {
    handleError(error, dispatch);
  }
}

function handleStepClick(dispatch: Function) {
  const action: Step = {
    type: STEP,
    payload: undefined,
  };
  try {
    dispatch(action);
  } catch (error) {
    handleError(error, dispatch);
  }
}

function runInterval(dispatch: Function, handle: number) {
  const action: Step = {
    type: STEP,
    payload: undefined,
  };
  try {
    dispatch(action);
  } catch (error) {
    handleError(error, dispatch);
    // eslint-disable-next-line no-use-before-define
    handleStopClick(dispatch, handle);
  }
}

function handleRunClick(dispatch: Function, running: number, speed: number) {
  // eslint-disable-next-line no-var
  if (running < 0) {
    // Cheeky hack to pass the handle into the runInterval function
    // eslint-disable-next-line
    var handle: any = setInterval(() => runInterval(dispatch, handle), speed);
    const action: SetSimulatorRunning = {
      type: SET_SIMULATOR_RUNNING,
      payload: handle,
    };
    try {
      dispatch(action);
    } catch (error) {
      handleError(error, dispatch);
    }
  }
}

const Debugger: React.FC = () => {
  const code: string = useSelector((state : RootState) => state.code.code);
  const running: number = useSelector((state : RootState) => state.debugger.running);
  const speed: number = useSelector((state : RootState) => state.debugger.speed);
  const dispatch = useDispatch();
  return (
    <div className="Column">
      <button className="Button" type="button" id="assemble" onClick={() => handleAssembleClick(code, dispatch, running)}>
        <i className="Icon fa fa-cog Rotate" />
        <div className="buttonText">Assemble</div>
      </button>
      <button className="Button" type="button" id="step" onClick={() => handleStepClick(dispatch)}>
        <i className="Icon fa fa-arrow-right Step" />
        <div className="buttonText">Step</div>
      </button>
      <button className="Button" type="button" id="run" style={running > 0 ? { color: '#11ac84' } : {}} onClick={() => handleRunClick(dispatch, running, speed)}>
        <i className="Icon fa fa-play" />
        <div className="buttonText">Run</div>
      </button>
      <button className="Button" id="stop" style={running === -1 ? { color: 'tomato' } : {}} type="button" onClick={() => handleStopClick(dispatch, running)}>
        <i className="Icon fa fa-stop" />
        <div className="buttonText">Stop</div>
      </button>
    </div>
  );
};

export default Debugger;
