import { fromJS } from 'immutable';
import {
  SHOW_PIXELATE_HANDLERS,
  SET_PIXELATE_HANDLERS_POSITION,
} from '../ReactConstants/ReactAction.jsx';

const initialState = fromJS({
  visible: false,
  position: { x: 0, y: 0, width: 0, height: 0 },
});

export function PixelateHandlers(state = initialState, action = { type: '' }) {
  switch (action.type) {
    case SHOW_PIXELATE_HANDLERS:
      return state.set('visible', action.visible);

    case SET_PIXELATE_HANDLERS_POSITION:
      return state.set('position', fromJS(action.react));

    default:
      return state;
  }
}
