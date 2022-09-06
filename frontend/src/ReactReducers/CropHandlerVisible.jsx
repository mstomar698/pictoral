import { SHOW_CROP_HANDLERS } from '../ReactConstants/ReactAction.jsx';
const initialState = false;

export function ShowCropHandlers(state = initialState, action = { type: '' }) {
  switch (action.type) {
    case SHOW_CROP_HANDLERS:
      return action.show;
    default:
      return state;
  }
}
