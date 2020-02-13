import React from 'react';
import { NoticesInterface, NoticeInterface, noticeReducer, AddNotice, ADD_NOTICE, DismissNotice, DISMISS_NOTICE } from './notices';

test('adds a notice', () => {
    let initialState: NoticesInterface = {notices: []}
    let addAction: AddNotice = {
        type: ADD_NOTICE,
        payload: 'test',
    }
    expect(noticeReducer(initialState, addAction)).toMatchObject({notices: [{message: 'test', dismissed: false}]})
});

test('dismisses a notice', () => {
    let notice: NoticeInterface = { message: 'test', dismissed: false }
    let initialState: NoticesInterface = {notices: [notice]}
    let DismissAction: DismissNotice = {
        type: DISMISS_NOTICE,
        payload: 'test',
    }
    expect(noticeReducer(initialState, DismissAction)).toMatchObject({notices: []})
});

test('does not affect notices', () => {
        let notice: NoticeInterface = { message: 'test', dismissed: false }
        let initialState: NoticesInterface = {notices: [notice]}
        expect(noticeReducer(initialState, {} as NoticeActions)).toMatchObject({notices: [notice]})
    
})