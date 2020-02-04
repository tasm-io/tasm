export const SET_CODE = 'SET_CODE';
export const UPLOAD_ERROR = 'UPLOAD_ERROR';

/**
 * CodeInterface represents of the user's code in the redux central store. 
 * @param code the user's code stored as a `string`
 * @param isUploading whether or not the code is currently uploading to the server.
 * @param uploadErrorMessage the error message of a failed upload.
 * @param shared whether or not the current code has been uploaded to the server. 
 * @param sharedURL the full URL to access the shared code. 
 * 
 */

export interface CodeInterface {
    code: string
    isUploading: boolean
    uploadErrorMessage: string,
    shared: boolean
    shareURL: string
}

const defaultState: CodeInterface = {
  code: '',
  isUploading: false,
  shared: false,
  uploadErrorMessage: '',
  shareURL: '',
};

type CodeActions = SetCode | UploadError

export interface SetCode {
    type: typeof SET_CODE
    payload: string
}

export interface UploadError {
    type: typeof UPLOAD_ERROR
    payload: string
}


export const codeReducer = (state = defaultState, action: CodeActions) => {
  switch (action.type) {
    case (SET_CODE): {
      return { ...state, code: action.payload };
    }
    case (UPLOAD_ERROR): {
      return { ...state, uploadErrorMessage: action.payload };
    }
    default:
      return state;
  }
};
