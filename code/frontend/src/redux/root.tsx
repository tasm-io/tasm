import {combineReducers} from 'redux'

import {codeReducer} from './code'

export const rootReducer = combineReducers({
    code: codeReducer,
})