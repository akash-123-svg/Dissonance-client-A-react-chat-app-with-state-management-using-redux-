import { configureStore } from '@reduxjs/toolkit';
import { createStore } from 'redux';
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
});
export { store };
