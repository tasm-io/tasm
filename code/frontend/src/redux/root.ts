import { combineReducers } from 'redux';
import { codeReducer } from './code';
import { simulatorReducer } from './simulator';
import { debuggerReducer } from './debugger';
import ErrorsReducer from './errors';

const rootReducer = combineReducers({
  code: codeReducer,
  simulator: simulatorReducer,
  debugger: debuggerReducer,
  errors: ErrorsReducer,
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;
