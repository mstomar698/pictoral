import { fromJS } from 'immutable';
import { SET_ZOOM_RATIO, SET_WIDTH_HEIGHT } from '../ReactConstants/ReactAction.jsx';

const initialState = fromJS({ zoomRAtio: 1, width: 0, height: 0 });

export function ImgStatus(state = initialState, action = { type: '' }) {
  switch (action.type) {
    case SET_ZOOM_RATIO:
      return state.set('zoomRatio', action.zoomRatio);

    case SET_WIDTH_HEIGHT:
      return state.set('width', action.width).set('height', action.height);

    default:
      return state;
  }
}
