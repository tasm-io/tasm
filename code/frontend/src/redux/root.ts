import { combineReducers } from 'redux';
import { codeReducer } from './code';
import { simulatorReducer } from './simulator';
import { debuggerReducer } from './debugger';
import ErrorsReducer from './errors';
import { DevicesReducer } from './devices';

const rootReducer = combineReducers({
  code: codeReducer,
  simulator: simulatorReducer,
  debugger: debuggerReducer,
  devices: DevicesReducer,
  errors: ErrorsReducer,
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;
