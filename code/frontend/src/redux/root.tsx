import { combineReducers } from 'redux';
import { codeReducer } from './code';
import { noticeReducer } from './notices';
import { simulatorReducer } from './simulator';

const rootReducer = combineReducers({
  code: codeReducer,
  notices: noticeReducer,
  simulator: simulatorReducer,
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;
