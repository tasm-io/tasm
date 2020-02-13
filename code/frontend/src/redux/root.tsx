import { combineReducers } from 'redux';
import { codeReducer } from './code';
import { noticeReducer } from './notices';

const rootReducer = combineReducers({
  code: codeReducer,
  notices: noticeReducer,
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;
