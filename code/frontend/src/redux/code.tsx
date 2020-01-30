export const SET_CODE = 'SET_CODE';
export const UPLOAD_ERROR = 'UPLOAD_ERROR';

export interface CodeInterface {
    code: string
    isUploading: boolean
    shared: boolean
    uploadErrorMessage: string,
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
