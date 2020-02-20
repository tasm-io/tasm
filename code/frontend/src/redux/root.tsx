import { combineReducers } from 'redux';
import { codeReducer } from './code';
import { noticeReducer } from './notices';
import { simulatorReducer } from './simulator';
import { debuggerReducer } from './debugger';

const rootReducer = combineReducers({
  code: codeReducer,
  notices: noticeReducer,
  simulator: simulatorReducer,
  debugger: debuggerReducer,
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;
