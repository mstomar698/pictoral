import { configureStore } from '@reduxjs/toolkit';
import { fromJS } from 'immutable';
import reducers from './reducers';

const initialState = {
  imgStat: fromJS({
    zoomRatio: 0,
    width: 0,
    height: 0,
  }),
  cropHandlersVisible: false,
  pixelateHandlers: fromJS({
    visible: false,
    position: { x: 0, y: 0, width: 0, height: 0 },
  }),
  miniHandlers: fromJS({
    visible: false,
    heights: { top: 0, bottom: 0 },
  }),
};

const store = configureStore({
  reducer: reducers,
  preloadedState: initialState,
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
