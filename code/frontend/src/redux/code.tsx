/* Action Types */
export const SET_CODE = 'SET_CODE';
export const UPLOAD_ERROR = 'UPLOAD_ERROR';
export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS';
export const UPLOADING = 'UPLOADING';

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
    uploadErrorMessage: string
    shared: boolean
    shareURL: string
    markers: Marker[]
}

const defaultState: CodeInterface = {
  code: '',
  isUploading: false,
  shared: false,
  uploadErrorMessage: '',
  shareURL: '',
  markers: [],
};

type CodeActions = SetCode | UploadError | UploadSuccess | Uploading

/* Actions */

export interface SetCode {
    type: typeof SET_CODE
    payload: string
}

export interface Uploading {
  type: typeof UPLOADING
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

/* End of Actions */

export interface Marker {
    startRow: number
    startCol: number
    endRow: number
    endCol: number
    className: string
    type: string,
}


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
    return { ...state, uploadErrorMessage: action.payload };
  }
  default:
    return state;
  }
};
