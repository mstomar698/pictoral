import { fromJS } from 'immutable';
import {
  SHOW_MINI_HANDLERS,
  SET_MINI_HANDLERS_HEIGHTS,
} from '../ReactConstants/ReactAction.jsx';

const initialState = fromJS({
  visible: false,
  hieght: { top: 0, bottom: 0 },
});

export function MiniHandlers(state = initialState, action = { type: '' }) {
  switch (action.type) {
    case SHOW_MINI_HANDLERS:
      return state.set('visible', action.visible);

    case SET_MINI_HANDLERS_HEIGHTS:
      return state.set('heights', fromJS(action.heights));

    default:
      return state;
  }
}
