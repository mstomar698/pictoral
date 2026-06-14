import { fromJS, type Map as ImmutableMap } from 'immutable';
import type { AppAction } from '../actions';
import {
  SHOW_PIXELATE_HANDLERS,
  SET_PIXELATE_HANDLERS_POSITION,
} from '../constants/actions';

type ImmutableState = ImmutableMap<string, unknown>;

const initialState = fromJS({
  visible: false,
  position: { x: 0, y: 0, width: 0, height: 0 },
}) as ImmutableState;

export function pixelateHandlers(
  state: ImmutableState = initialState,
  action: AppAction = { type: SHOW_PIXELATE_HANDLERS, visible: false }
): ImmutableState {
  switch (action.type) {
    case SHOW_PIXELATE_HANDLERS:
      return state.set('visible', action.visible);
    case SET_PIXELATE_HANDLERS_POSITION:
      return state.set('position', fromJS(action.rect));
    default:
      return state;
  }
}
