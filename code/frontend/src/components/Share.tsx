import React, { useState } from 'react';
import '../App.css';

import { useDispatch, useSelector } from 'react-redux';
/* eslint-disable */
import { RootState } from '../redux/root';
import { UploadError, UPLOADING, UPLOAD_ERROR, UPLOAD_SUCCESS, UploadSuccess } from '../redux/code';
/* eslint-enable */

const shareEndpoint: string = 'https://tasm.io/submit';

interface submissionResponse {
  id: string
  uploadErrorMessage?: string
}

async function uploadCode(code: string) {
  try {
    const response : any = await fetch(shareEndpoint, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'text/plain',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: code,
    });
    return await response.json();
  } catch (_e) {
    const e: Error = _e;
    console.log(`Error: ${e.message}`);
    return { uploadErrorMessage: 'Failed to contact the server' };
  }
  // eslint-disable-next-line no-return-await
}

function handleShareSuccess(response: submissionResponse) {
  const action: UploadSuccess = {
    type: UPLOAD_SUCCESS,
    payload: response.id as string,
  };
  return action;
}
function handleShareFailure(response: submissionResponse) {
  const action: UploadError = {
    type: UPLOAD_ERROR,
    payload: response.uploadErrorMessage as string,
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
    const response: submissionResponse = resp;
    if (response.uploadErrorMessage !== undefined) {
      dispatch(handleShareSuccess(response));
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
      Share
      </button>
    </div>
  );
};

export default Share;
