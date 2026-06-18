// Webpack-injected globals
declare const URL_PATH: string;
declare const PRODUCTION: boolean;
declare const GOOGLE_CLIENT_ID: string;
declare const GITHUB_CLIENT_ID: string;

declare module 'image-editor-bk-rust/image_editor' {
  export class Image {
    static new(width: number, height: number, data: Uint8Array): Image;
    width(): number;
    height(): number;
    width_bk(): number;
    height_bk(): number;
    pixels(): number;
    pixels_data(): Uint8Array;
    pixels_bk_data(): Uint8Array;
    reuse(width: number, height: number, data: Uint8Array): void;
    apply_change(): void;
    discard_change(): void;
    rgb_to_hsi(): void;
    clear_hsi(): void;
    adjust_hsi(h: number, s: number, t: number, grayscaled: boolean, inverted: boolean): void;
    auto_adjust_intensity(): void;
    manual_adjust_intensity(gain: number, bias: number): void;
    pixelate(x: number, y: number, width: number, height: number, blockSize: number, blurType: string): void;
    gaussian_blur(sigma: number, topX?: number, topY?: number, width?: number, height?: number, isStandalone?: boolean): void;
    blur(sigma: number): void;
    sharpen(amount: number): void;
    motion_blur(length: number): void;
    cartoonify(medianRadius: number, sigmaR: number, iterCount: number, incr: boolean): void;
    miniaturize(sigma: number, height: number, isTop: boolean): void;
    bilateral_filter(radius: number, sigmaR: number, iterCount: number, incr: boolean): void;
    crop(x: number, y: number, width: number, height: number): void;
    rotate(clockwise: boolean): void;
    flip_h(): void;
    flip_v(): void;
    scale(factor: number): void;
  }
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
