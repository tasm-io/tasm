import React from 'react';
import '../App.css';
import { useDispatch } from 'react-redux';

function dismiss(id: number, dispatch: Function) {
  const action = {
    type: 'DISMISS_NOTICE',
    payload: id,
  };
  dispatch(action);
}

interface Props {
    message: string
}

const Notice: React.FC<Props> = (props: Props) => {
  const dispatch = useDispatch();
  return (
    <div className="Notice">
      <button aria-label="dismiss notice" type="button" className="NoticeDismiss" onClick={() => dismiss(0, dispatch)}><i className="fa fa-times-circle" /></button>
      {props.message}
    </div>
  );
};

export default Notice;
