export const ADD_NOTICE = 'ADD_NOTICE';
export const DISMISS_NOTICE = 'DISMISS_NOTICE';

export interface NoticeInterface {
    message: string
    dismissed: boolean
}

export interface NoticesInterface {
    notices: NoticeInterface[],
}

const defaultState: NoticesInterface = {
  notices: [],
};

type NoticesActions = DismissNotice | AddNotice;

export interface DismissNotice {
    type: typeof DISMISS_NOTICE
    payload: string
}

export interface AddNotice {
    type: typeof ADD_NOTICE
    payload: string
}

export const noticeReducer = (state = defaultState, action: NoticesActions) => {
  switch (action.type) {
  case (ADD_NOTICE): {
    return { notices: [...state.notices, { message: action.payload, dismissed: false }] };
  }
  case (DISMISS_NOTICE): {
    return { notices: state.notices.filter((notice) => notice.message !== action.payload) };
  }
  default:
    return state;
  }
};
