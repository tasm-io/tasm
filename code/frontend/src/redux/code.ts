import { parse } from '../assembler/parser';
import format from '../formatter/format';

/* Action Types */
export const SET_CODE = 'SET_CODE';
export const UPLOAD_ERROR = 'UPLOAD_ERROR';
export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS';
export const UPLOADING = 'UPLOADING';
export const SET_CODE_DISPLAY = 'SET_CODE_DISPLAY';
export const FORMAT_CODE = 'FORMAT_CODE';

/**
 * CodeInterface represents of the user's code in the redux central store.
 * @param code the user's code stored as a `string`
 * @param isUploading whether or not the code is currently uploading to the server.
 * @param uploadErrorMessage the error message of a failed upload.
 * @param shared whether or not the current code has been uploaded to the server.
 * @param sharedURL the share ID of the current code. (Not full URL)
 *
 */

export interface CodeInterface {
    code: string
    isDisplayed: boolean
    isUploading: boolean
    uploadErrorMessage: string
    shared: boolean
    shareURL: string
}

const defaultState: CodeInterface = {
  code: '',
  isDisplayed: true,
  isUploading: false,
  shared: false,
  uploadErrorMessage: '',
  shareURL: '',
};

type CodeActions = SetCode | UploadError | UploadSuccess | Uploading | SetCodeDisplay | FormatCode

/* Actions */

export interface SetCode {
    type: typeof SET_CODE
    payload: string
}

export interface Uploading {
  type: typeof UPLOADING
  payload: boolean
}

export interface SetCodeDisplay {
  type: typeof SET_CODE_DISPLAY
  payload: boolean
}

export interface UploadSuccess {
  type: typeof UPLOAD_SUCCESS
  payload: string
}

export interface UploadError {
    type: typeof UPLOAD_ERROR
    payload: string
}

export interface FormatCode {
  type: typeof FORMAT_CODE
  payload: undefined
}

/* End of Actions */

export const codeReducer = (state = defaultState, action: CodeActions) => {
  switch (action.type) {
  case (SET_CODE): {
    return { ...state, code: action.payload };
  }
  case (UPLOADING): {
    return { ...state, isUploading: action.payload };
  }
  case (UPLOAD_SUCCESS): {
    return {
      ...state, shareURL: action.payload, shared: true, isUploading: false,
    };
  }
  case (UPLOAD_ERROR): {
    return { ...state, uploadErrorMessage: action.payload, shared: false };
  }
  case (SET_CODE_DISPLAY): {
    return { ...state, isDisplayed: action.payload };
  }
  case (FORMAT_CODE): {
    const code = state.code
    const ast = parse(code)
    const newCode = format(ast)
    return {...state, code: newCode}
  }
  default:
    return state;
  }
};
