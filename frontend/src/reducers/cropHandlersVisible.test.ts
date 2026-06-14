import { describe, it, expect } from 'vitest';
import { showCropHandlers } from './cropHandlersVisible';
import { SHOW_CROP_HANDLERS } from '../constants/actions';

describe('cropHandlersVisible reducer', () => {
  it('returns false by default', () => {
    expect(showCropHandlers(undefined, { type: SHOW_CROP_HANDLERS, show: false })).toBe(false);
  });

  it('toggles visibility from action', () => {
    expect(showCropHandlers(false, { type: SHOW_CROP_HANDLERS, show: true })).toBe(true);
  });
});
