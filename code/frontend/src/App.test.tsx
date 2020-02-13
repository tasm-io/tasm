import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import rootReducer from './redux/root'

test('renders the application', () => {
  const store = createStore(rootReducer);
  render(<Provider store={store}><App /></Provider>);
});