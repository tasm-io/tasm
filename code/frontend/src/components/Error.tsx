
import React from 'react';
import '../App.css';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { SimulatorError, ErrorTypes, REMOVE_ERROR } from '../redux/errors';

interface Props {
  error: SimulatorError
}

function dismiss(id: string, dispatch: Function) {
  const action = {
    type: REMOVE_ERROR,
    payload: id,
  };
  dispatch(action);
}

const Error: React.FC<Props> = (props: Props) => {
  const dispatch = useDispatch();
  return (
    <div className={`Error ${ErrorTypes[props.error.type]}`}>
      <button type="button" className="NoticeDismiss" style={{ border: 0, background: 'transparent' }} id="dismiss" onClick={() => dismiss(props.error.message, dispatch)}>
        <i className="fa fa-times-circle" />
      </button>
      <div className="ErrorHeading">{props.error.title}</div>
      <div>{props.error.message}</div>
    </div>
  );
};


export default Error;
