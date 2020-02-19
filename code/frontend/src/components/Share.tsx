import React from 'react';
import '../App.css';

import { useDispatch, useSelector } from 'react-redux';
/* eslint-disable */
import { RootState } from '../redux/root';
import {serverURL} from '../constants';
import { UploadError, UPLOADING, UPLOAD_ERROR, UPLOAD_SUCCESS, UploadSuccess } from '../redux/code';
import { AddNotice, ADD_NOTICE } from '../redux/notices';
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
    const e: Error = _e;
    console.log(`error: ${e.message}`);
    return 'error: Failed to contact the server';
  }
}

function ShareURLNotice(id: string) : AddNotice {
  const shareURL = `Shared Sucessfully to URL: ${serverURL}/share/${id}`;
  const action: AddNotice = {
    type: ADD_NOTICE,
    payload: shareURL,
  };
  return action;
}

function handleShareSuccess(response: string) : UploadSuccess {
  const action: UploadSuccess = {
    type: UPLOAD_SUCCESS,
    payload: response,
  };
  return action;
}


function handleShareFailure(response: string) : UploadError {
  const action: UploadError = {
    type: UPLOAD_ERROR,
    payload: response,
  };
  return action;
}

function handleShareCode(code: string, dispatch: Function) {
  const uploadingAction = {
    type: typeof UPLOADING,
    payload: true,
  };
  dispatch(uploadingAction);
  uploadCode(code).then((resp) => {
    const response = resp;
    if (response.includes('error') !== true) {
      dispatch(handleShareSuccess(response));
      dispatch(ShareURLNotice(response));
    } else {
      dispatch(handleShareFailure(response));
    }
  });
}

const Share: React.FC = () => {
  const dispatch = useDispatch();
  const code: string = useSelector((state : RootState) => state.code.code);
  return (
    <div className="FileUpload">
      <button
        type="button"
        className="Button"
        onClick={() => handleShareCode(code, dispatch)}
      >
        <i className="Icon fa fa-share-square" />
        <div className="buttonText">Share</div>
      </button>
    </div>
  );
};

export default Share;
