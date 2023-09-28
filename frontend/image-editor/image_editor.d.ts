/* tslint:disable */
/* eslint-disable */
/**
*/
export class Image {
  free(): void;
/**
* @param {number} w
* @param {number} h
* @param {Uint8Array} buf
* @returns {Image}
*/
  static new(w: number, h: number, buf: Uint8Array): Image;
/**
* @param {number} w
* @param {number} h
* @param {Uint8Array} buf
*/
  reuse(w: number, h: number, buf: Uint8Array): void;
/**
* @returns {number}
*/
  pixels(): number;
/**
* @returns {number}
*/
  width(): number;
/**
* @returns {number}
*/
  height(): number;
/**
* @returns {number}
*/
  width_bk(): number;
/**
* @returns {number}
*/
  height_bk(): number;
/**
*/
  apply_change(): void;
/**
*/
  discard_change(): void;
/**
*/
  undo(): void;
/**
*/
  rgb_to_hsi(): void;
/**
* @param {number} h_amt
* @param {number} s_amt
* @param {number} t_amt
* @param {boolean} grayscaled
* @param {boolean} inverted
*/
  adjust_hsi(h_amt: number, s_amt: number, t_amt: number, grayscaled: boolean, inverted: boolean): void;
/**
* @param {Float64Array} hue
* @param {Float64Array} saturation
* @param {Float64Array} intensity
* @param {number} t_amt
*/
  hsi_to_rgb(hue: Float64Array, saturation: Float64Array, intensity: Float64Array, t_amt: number): void;
/**
* @param {number} gain
* @param {number} bias
*/
  manual_adjust_intensity(gain: number, bias: number): void;
/**
*/
  auto_adjust_intensity(): void;
/**
*/
  clear_hsi(): void;
/**
* @param {number} top_x
* @param {number} top_y
* @param {number} width
* @param {number} height
*/
  crop(top_x: number, top_y: number, width: number, height: number): void;
/**
* @param {boolean} clockwise
*/
  rotate(clockwise: boolean): void;
/**
*/
  rotate_by(): void;
/**
*/
  flip_v(): void;
/**
*/
  flip_h(): void;
/**
* @param {number} factor
*/
  scale(factor: number): void;
/**
* @param {number} top_x
* @param {number} top_y
* @param {number} p_width
* @param {number} p_height
* @param {number} block_size
* @param {string} blur_type
*/
  pixelate(top_x: number, top_y: number, p_width: number, p_height: number, block_size: number, blur_type: string): void;
/**
* @param {number} sigma
* @param {number} height
* @param {boolean} is_top
*/
  miniaturize(sigma: number, height: number, is_top: boolean): void;
/**
* @param {number} sigma
*/
  blur(sigma: number): void;
/**
* @param {number} sigma
* @param {number} top_x
* @param {number} top_y
* @param {number} width
* @param {number} height
* @param {boolean} is_standalone
*/
  gaussian_blur(sigma: number, top_x: number, top_y: number, width: number, height: number, is_standalone: boolean): void;
/**
* @param {number} radius
* @param {number} sigma_r
* @param {number} iter_count
* @param {boolean} incr
*/
  bilateral_filter(radius: number, sigma_r: number, iter_count: number, incr: boolean): void;
}
