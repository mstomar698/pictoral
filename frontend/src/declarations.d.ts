// Webpack-injected globals
declare const URL_PATH: string;
declare const PRODUCTION: boolean;

// Declare modules without TypeScript definitions

declare module 'image-editor-bk-rust/image_editor' {
  export class Image {
    constructor(width: number, height: number, data: Uint8Array);
    width(): number;
    height(): number;
    width_bk(): number;
    height_bk(): number;
    pixels(): number;
    pixels_data(): Uint8Array;
    reuse(width: number, height: number, data: Uint8Array): void;
    apply_change(): void;
    discard_change(): void;
    rgb_to_hsi(): void;
    clear_hsi(): void;
    pixelate(x: number, y: number, width: number, height: number, blockSize: number, blurType: string): void;
    gaussian_blur(sigma: number): void;
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
