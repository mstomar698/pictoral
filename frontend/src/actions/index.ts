import type { Heights, Position } from '../types';
import {
  SET_ZOOM_RATIO,
  SET_WIDTH_HEIGHT,
  SHOW_CROP_HANDLERS,
  SHOW_PIXELATE_HANDLERS,
  SET_PIXELATE_HANDLERS_POSITION,
  SHOW_MINI_HANDLERS,
  SET_MINI_HANDLERS_HEIGHTS,
} from '../constants/actions';

export type AppAction =
  | { type: typeof SET_ZOOM_RATIO; zoomRatio: number }
  | { type: typeof SET_WIDTH_HEIGHT; width: number; height: number }
  | { type: typeof SHOW_CROP_HANDLERS; show: boolean }
  | { type: typeof SHOW_PIXELATE_HANDLERS; visible: boolean }
  | { type: typeof SET_PIXELATE_HANDLERS_POSITION; rect: Position }
  | { type: typeof SHOW_MINI_HANDLERS; visible: boolean }
  | { type: typeof SET_MINI_HANDLERS_HEIGHTS; heights: Heights };

export function setZoomRatio(zoomRatio: number): AppAction {
  return { type: SET_ZOOM_RATIO, zoomRatio };
}

export function setWidthHeight(wh: { width: number; height: number }): AppAction {
  return { type: SET_WIDTH_HEIGHT, width: wh.width, height: wh.height };
}

export function showCropHandlers(show: boolean): AppAction {
  return { type: SHOW_CROP_HANDLERS, show };
}

export function showPixelateHandlers(visible: boolean): AppAction {
  return { type: SHOW_PIXELATE_HANDLERS, visible };
}

export function setPixelateHandlersPosition(rect: Position): AppAction {
  return { type: SET_PIXELATE_HANDLERS_POSITION, rect };
}

export function showMiniHandlers(visible: boolean): AppAction {
  return { type: SHOW_MINI_HANDLERS, visible };
}

export function setMiniHeights(heights: Heights): AppAction {
  return { type: SET_MINI_HANDLERS_HEIGHTS, heights };
}
