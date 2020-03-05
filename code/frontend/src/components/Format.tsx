import React from 'react';
import '../App.css';

import { useDispatch } from 'react-redux';
import { FORMAT_CODE, FormatCode } from '../redux/code';

function handleButtonClick(dispatch: Function) {
    const action: FormatCode = {
        type: FORMAT_CODE,
        payload: undefined,
    }
    dispatch(action);
}

const Format: React.FC = () => {
  const dispatch = useDispatch();
  return (
      <button type="button" className="Button" onClick={() => handleButtonClick(dispatch)}>
      <i className="Icon fa fa-indent" />
      <div className="buttonText">Format Code</div>
    </button>
  );
};

export default Format;
