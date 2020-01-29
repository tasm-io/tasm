export const codeReducer = (state = defaultState, action: CodeActions) => {
    switch(action.type) {
        case(SET_CODE): {
            return { ...state, code: action.payload }
        }
        case(UPLOAD_ERROR): {
            return { ...state, uploadErrorMessage: action.payload }
        }
        default: 
            return state
    }
}

export interface CodeInterface {
    code: String 
    isUploading: boolean
    shared: boolean
    uploadErrorMessage: String,
    shareURL: String
}

const defaultState: CodeInterface = {
    code: '',
    isUploading: false, 
    shared: false,
    uploadErrorMessage: '',
    shareURL: '',
}

type CodeActions = SetCode | UploadError

export interface SetCode {
    type: typeof SET_CODE
    payload: String
}

export interface UploadError {
    type: typeof UPLOAD_ERROR
    payload: String
}


export const SET_CODE = "SET_CODE"
export const UPLOAD_ERROR = 'UPLOAD_ERROR'