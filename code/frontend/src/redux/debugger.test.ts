import {
  DebuggerInterface, debuggerReducer, ModifyDebuggerSpeed, MODIFY_SPEED, SetSimulatorRunning, SET_SIMULATOR_RUNNING, ModifyRegisterDisplay, MODIFY_REGISTER_DISPLAY,
} from './debugger';

test('debugger reducer default case', () => {
  const startState: DebuggerInterface = {
    speed: 1000,
    running: -2,
    registerDisplay: 2,
  };
  expect(debuggerReducer(startState, { type: 'NOT_REAL', payload: 'LESS_REAL' } as unknown as ModifyDebuggerSpeed)).toStrictEqual(startState);
});

test('change the debugger speed', () => {
  const startState: DebuggerInterface = {
    speed: 1000,
    running: -2,
    registerDisplay: 2,
  };
  const endState: DebuggerInterface = {
    speed: 2000,
    running: -2,
    registerDisplay: 2,
  };
  const action: ModifyDebuggerSpeed = {
    type: MODIFY_SPEED,
    payload: 2000,
  };
  expect(debuggerReducer(startState, action)).toStrictEqual(endState);
});

test('change the debugger speed lower bound', () => {
  const startState: DebuggerInterface = {
    speed: 1000,
    running: -2,
    registerDisplay: 2,
  };
  const endState: DebuggerInterface = {
    speed: 250,
    running: -2,
    registerDisplay: 2,
  };
  const action: ModifyDebuggerSpeed = {
    type: MODIFY_SPEED,
    payload: 0,
  };
  expect(debuggerReducer(startState, action)).toStrictEqual(endState);
});

test('change the debugger speed higher bound', () => {
  const startState: DebuggerInterface = {
    speed: 1000,
    running: -2,
    registerDisplay: 2,
  };
  const endState: DebuggerInterface = {
    speed: 5000,
    running: -2,
    registerDisplay: 2,
  };
  const action: ModifyDebuggerSpeed = {
    type: MODIFY_SPEED,
    payload: 250000,
  };
  expect(debuggerReducer(startState, action)).toStrictEqual(endState);
});

test('change the debugger running state', () => {
  const startState: DebuggerInterface = {
    speed: 1000,
    running: -2,
    registerDisplay: 2,
  };
  const endState: DebuggerInterface = {
    speed: 1000,
    running: 2,
    registerDisplay: 2,
  };
  const action: SetSimulatorRunning = {
    type: SET_SIMULATOR_RUNNING,
    payload: 2,
  };
  expect(debuggerReducer(startState, action)).toStrictEqual(endState);
});

test('change the debugger register display', () => {
  const startState: DebuggerInterface = {
    speed: 1000,
    running: -2,
    registerDisplay: 2,
  };
  const endState: DebuggerInterface = {
    speed: 1000,
    running: -2,
    registerDisplay: 16,
  };
  const action: ModifyRegisterDisplay = {
    type: MODIFY_REGISTER_DISPLAY,
    payload: 16,
  };
  expect(debuggerReducer(startState, action)).toStrictEqual(endState);
});

test('change the debugger register display to invalid', () => {
  const startState: DebuggerInterface = {
    speed: 1000,
    running: -2,
    registerDisplay: 2,
  };
  const action: ModifyRegisterDisplay = {
    type: MODIFY_REGISTER_DISPLAY,
    payload: 24,
  };
  expect(debuggerReducer(startState, action)).toStrictEqual(startState);
});
