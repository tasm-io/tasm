import React from 'react';
import '../App.css';
import { useDispatch, useSelector } from 'react-redux';
import { MODIFY_SPEED, MODIFY_REGISTER_DISPLAY } from '../redux/debugger';
// eslint-disable-next-line no-unused-vars
import { SET_CODE_DISPLAY, SetCodeDisplay } from '../redux/code';
// eslint-disable-next-line no-unused-vars
import { RootState } from '../redux/root';
import { MODIFY_TIMER_CYCLES } from '../redux/simulator';

function handleSpeedChange(speed: number, dispatch: Function) {
  const action = {
    type: MODIFY_SPEED,
    payload: speed,
  };
  dispatch(action);
}

function handleRegisterDisplayChange(base: number, dispatch: Function) {
  const action = {
    type: MODIFY_REGISTER_DISPLAY,
    payload: base,
  };
  dispatch(action);
}

function handleModifyTimerCycles(newCycles: number, dispatch: Function) {
  const action = {
    type: MODIFY_TIMER_CYCLES,
    payload: newCycles,
  };
  dispatch(action);
}

function handleExit(dispatch: Function) {
  const action: SetCodeDisplay = {
    type: SET_CODE_DISPLAY,
    payload: true,
  };
  dispatch(action);
}

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const speed: number = useSelector((state : RootState) => state.debugger.speed);
  const timerCycles: number = useSelector((state : RootState) => state.simulator.timerCycles);
  const registerDisplay: number = useSelector(
    (state : RootState) => state.debugger.registerDisplay,
  );
  return (
    <div className="Settings">
      <h3>Settings</h3>
      <div className="Setting">
        <p>Timer Cycles:</p>
        <input type="number" value={timerCycles} onChange={(e) => handleModifyTimerCycles(Number(e.target.value), dispatch)} />
      </div>
      <div className="Setting">
        <p>Run Speed:</p>
      </div>
      <div className="Setting">
        <label htmlFor="slow">
          <input type="radio" id="slow" checked={speed === 3000} onChange={() => handleSpeedChange(3000, dispatch)} />
        Slow
        </label>
      </div>
      <div className="Setting">
        <label htmlFor="Normal">
          <input type="radio" id="Normal" checked={speed === 1000} onChange={() => handleSpeedChange(1000, dispatch)} />
        Normal
        </label>
      </div>
      <div className="Setting">
        <label htmlFor="Fast">
          <input type="radio" id="Fast" checked={speed === 500} onChange={() => handleSpeedChange(500, dispatch)} />
        Fast
        </label>
      </div>
      <div className="Setting">
        <label htmlFor="sonic">
          <input type="radio" id="sonic" checked={speed === 50} onChange={() => handleSpeedChange(50, dispatch)} />
        Sonic
        </label>
      </div>
      <p>Display Registers As:</p>
      <div className="Setting">
        <label htmlFor="bin">
          <input type="radio" value="2" id="bin" checked={registerDisplay === 2} onChange={() => handleRegisterDisplayChange(2, dispatch)} />
        Binary
        </label>
      </div>
      <div className="Setting">
        <label htmlFor="dec">
          <input type="radio" value="10" id="dec" checked={registerDisplay === 10} onChange={() => handleRegisterDisplayChange(10, dispatch)} />
        Decimal
        </label>
      </div>
      <div className="Setting">
        <label htmlFor="hex">
          <input type="radio" value="16" id="hex" checked={registerDisplay === 16} onChange={() => handleRegisterDisplayChange(16, dispatch)} />
        Hexadecimal
        </label>
      </div>
      <div>
        <button type="button" className="Button" style={{ backgroundColor: '#1e363c' }} onClick={() => handleExit(dispatch)}>I want my editor back!</button>
      </div>
    </div>
  );
};

export default Settings;
