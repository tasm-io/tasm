export const ADD_ERROR = 'ADD_ERROR';
export const REMOVE_ERROR = 'REMOVE_ERROR';

interface ErrorStore {
    errors: SimulatorError[]
}

export enum ErrorTypes {
    // eslint-disable-next-line no-unused-vars
    Bad = 0,
    // eslint-disable-next-line no-unused-vars
    Ok = 1,
    // eslint-disable-next-line no-unused-vars
    Good = 2,
}

export interface SimulatorError {
    type: ErrorTypes
    title: string
    message: string
}

const defaultState: ErrorStore = {
  errors: [],
};

// Actions

export interface AddError {
    type: typeof ADD_ERROR
    payload: SimulatorError
}

export interface RemoveError {
    type: typeof REMOVE_ERROR
    payload: string
}

type ErrorStoreActions = AddError | RemoveError

function ErrorsReducer(state = defaultState, action: ErrorStoreActions) {
  switch (action.type) {
  case (ADD_ERROR): {
    return { errors: [...state.errors, action.payload] };
  }
  case (REMOVE_ERROR): {
    const errors = state.errors.filter((err) => err.message !== action.payload);
    return { errors };
  }
  default: {
    return state;
  }
  }
}
export default ErrorsReducer;
