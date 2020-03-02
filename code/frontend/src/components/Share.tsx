import React from 'react';
import '../App.css';

import { useDispatch, useSelector } from 'react-redux';
/* eslint-disable */
import { RootState } from '../redux/root';
import {serverURL} from '../constants';
import { UploadError, UPLOADING, UPLOAD_ERROR, UPLOAD_SUCCESS, UploadSuccess, CodeInterface } from '../redux/code';
import { ADD_ERROR, ErrorTypes, SimulatorError, AddError } from '../redux/errors';
/* eslint-enable */

const shareEndpoint: string = `${serverURL}/submit`;

async function uploadCode(code: string) {
  try {
    const response : any = await fetch(shareEndpoint, {
      method: 'POST',
      body: code,
    });
    return await response.text();
  } catch (_e) {
    return 'Error: Failed to contact the server';
  }
}

function handleShareSuccess(response: string) : UploadSuccess {
  const action: UploadSuccess = {
    type: UPLOAD_SUCCESS,
    payload: response,
  };
  return action;
}

function NotifyUser(id: string) {
  const error: SimulatorError = {
    type: ErrorTypes.Good,
    title: 'Code Uploaded & Shared',
    message: `The url is: ${serverURL}/share/${id} and has been automatically copied!`,
  };
  const payload: AddError = {
    type: ADD_ERROR,
    payload: error,
  };
  return payload;
}

function NotifyUserError(resp: string) {
  const error: SimulatorError = {
    type: ErrorTypes.Bad,
    title: 'Error Sharing Code',
    message: `${resp.split(':')[1]}`,
  };
  const payload: AddError = {
    type: ADD_ERROR,
    payload: error,
  };
  return payload;
}

function copyToClipboard(id: string) {
  navigator.clipboard.writeText(`${serverURL}/share/${id}`);
}

function handleShareFailure(response: string) : UploadError {
  const action: UploadError = {
    type: UPLOAD_ERROR,
    payload: response,
  };
  return action;
}

function handleShareCode(code: CodeInterface, dispatch: Function) {
  if (code.shared) {
    const uri = code.shareURL;
    dispatch(NotifyUser(uri));
    copyToClipboard(uri);
    return undefined;
  }
  const uploadingAction = {
    type: typeof UPLOADING,
    payload: true,
  };
  dispatch(uploadingAction);
  uploadCode(code.code).then((resp) => {
    const response = resp;
    if (!response.includes('error')) {
      const uri: string = encodeURIComponent(response);
      dispatch(handleShareSuccess(uri));
      dispatch(NotifyUser(uri));
      copyToClipboard(uri);
    } else {
      dispatch(handleShareFailure(response));
      dispatch(NotifyUserError(response));
    }
  });
  return undefined;
}

const Share: React.FC = () => {
  const dispatch = useDispatch();
  const codeStore: CodeInterface = useSelector((state : RootState) => state.code);
  return (
    <div className="FileUpload">
      <button
        type="button"
        className="Button"
        id="share"
        onClick={() => handleShareCode(codeStore, dispatch)}
      >
        <i className="Icon fa fa-share-square" />
        <div className="buttonText">Share</div>
      </button>
    </div>
  );
};

export default Share;
