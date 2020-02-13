import { combineReducers } from 'redux';
import { codeReducer } from './code';

const rootReducer = combineReducers({
  code: codeReducer,
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;
