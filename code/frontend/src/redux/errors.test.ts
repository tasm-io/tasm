import ErrorsReducer, {
  ErrorStore, ADD_ERROR, REMOVE_ERROR, AddError, RemoveError, SimulatorError, ErrorTypes,
} from './errors';


test('default case of error reducer', () => {
  const state: ErrorStore = {
    errors: [],
  };
  expect(ErrorsReducer(state, { type: 'NOT_REAL', payload: 'widePeepoHappy' } as unknown as AddError)).toStrictEqual(state);
});

test('adds an error', () => {
  const startState: ErrorStore = {
    errors: [],
  };
  const payload: SimulatorError = {
    type: ErrorTypes.Good,
    title: 'Error Title',
    message: 'Error Message',
  };
  const action: AddError = {
    type: ADD_ERROR,
    payload,
  };
  const expectedEndState: ErrorStore = {
    errors: [payload],
  };
  expect(ErrorsReducer(startState, action)).toStrictEqual(expectedEndState);
});

test('removes an error', () => {
  const errorOne: SimulatorError = {
    type: ErrorTypes.Good,
    title: 'Error Title',
    message: 'Error Message',
  };
  const errorTwo: SimulatorError = {
    type: ErrorTypes.Good,
    title: 'Error Title',
    message: 'A Different Error Message',
  };
  const startState: ErrorStore = {
    errors: [errorOne, errorTwo],
  };
  const action: RemoveError = {
    type: REMOVE_ERROR,
    payload: 'Error Message',
  };
  const expectedEndState = {
    errors: [errorTwo],
  };
  expect(ErrorsReducer(startState, action)).toStrictEqual(expectedEndState);
});
