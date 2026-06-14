import { fromJS, type Map as ImmutableMap } from 'immutable';
import type { AppAction } from '../actions';
import {
  SHOW_MINI_HANDLERS,
  SET_MINI_HANDLERS_HEIGHTS,
} from '../constants/actions';

type ImmutableState = ImmutableMap<string, unknown>;

const initialState = fromJS({
  visible: false,
  heights: { top: 0, bottom: 0 },
}) as ImmutableState;

export function miniHandlers(
  state: ImmutableState = initialState,
  action: AppAction = { type: SHOW_MINI_HANDLERS, visible: false }
): ImmutableState {
  switch (action.type) {
    case SHOW_MINI_HANDLERS:
      return state.set('visible', action.visible);
    case SET_MINI_HANDLERS_HEIGHTS:
      return state.set('heights', fromJS(action.heights));
    default:
      return state;
  }
}
