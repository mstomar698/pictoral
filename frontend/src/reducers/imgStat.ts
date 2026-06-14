import { fromJS, type Map as ImmutableMap } from 'immutable';
import type { AppAction } from '../actions';
import { SET_ZOOM_RATIO, SET_WIDTH_HEIGHT } from '../constants/actions';

const initialState = fromJS({ zoomRatio: 1, width: 0, height: 0 });

export function imgStat(
  state: ImmutableMap<string, number> = initialState,
  action: AppAction = { type: SET_ZOOM_RATIO, zoomRatio: 1 }
) {
  switch (action.type) {
    case SET_ZOOM_RATIO:
      return state.set('zoomRatio', action.zoomRatio);
    case SET_WIDTH_HEIGHT:
      return state.set('width', action.width).set('height', action.height);
    default:
      return state;
  }
}
