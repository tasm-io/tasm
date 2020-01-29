import { combineReducers } from 'redux';
import { codeReducer } from './code';

const rootReducer = combineReducers({
  code: codeReducer,
});

export default rootReducer;
