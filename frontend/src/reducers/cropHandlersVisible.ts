import type { AppAction } from '../actions';
import { SHOW_CROP_HANDLERS } from '../constants/actions';

const initialState = false;

export function showCropHandlers(
  state: boolean = initialState,
  action: AppAction = { type: SHOW_CROP_HANDLERS, show: false }
): boolean {
  switch (action.type) {
    case SHOW_CROP_HANDLERS:
      return action.show;
    default:
      return state;
  }
}
