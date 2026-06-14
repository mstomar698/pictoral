import { describe, it, expect } from 'vitest';
import { fromJS } from 'immutable';
import { imgStat } from './imgStat';
import { SET_ZOOM_RATIO, SET_WIDTH_HEIGHT } from '../constants/actions';

describe('imgStat reducer', () => {
  const initial = fromJS({ zoomRatio: 1, width: 0, height: 0 });

  it('returns the initial state', () => {
    expect(imgStat(undefined, { type: SET_ZOOM_RATIO, zoomRatio: 1 })).toEqual(initial);
  });

  it('updates zoom ratio', () => {
    const next = imgStat(initial, { type: SET_ZOOM_RATIO, zoomRatio: 0.75 });
    expect(next.get('zoomRatio')).toBe(0.75);
  });

  it('updates width and height', () => {
    const next = imgStat(initial, {
      type: SET_WIDTH_HEIGHT,
      width: 1920,
      height: 1080,
    });
    expect(next.get('width')).toBe(1920);
    expect(next.get('height')).toBe(1080);
  });
});
