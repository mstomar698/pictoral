// Redux state types
export interface ImgStat {
  zoomRatio: number;
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Heights {
  top: number;
  bottom: number;
}

export interface RootState {
  imgStat: {
    zoomRatio: number;
    width: number;
    height: number;
  };
  cropHandlersVisible: boolean;
  pixelateHandlers: {
    visible: boolean;
    position: Position;
  };
  miniHandlers: {
    visible: boolean;
    heights: Heights;
  };
}

// WASM Image type - will be augmented from the actual WASM module
export interface WasmImage {
  width: () => number;
  height: () => number;
  width_bk: () => number;
  height_bk: () => number;
  pixels_data: () => Uint8Array;
  pixels: () => number;
  pixels_bk: Uint8Array;
  reuse: (width: number, height: number, data: Uint8Array) => void;
  apply_change: () => void;
  discard_change: () => void;
  rgb_to_hsi: () => void;
  clear_hsi: () => void;
  pixelate: (x: number, y: number, width: number, height: number, blockSize: number, blurType: string) => void;
  gaussian_blur: (sigma: number) => void;
  miniaturize: (sigma: number, height: number, isTop: boolean) => void;
  bilateral_filter: (radius: number, sigmaR: number, iterCount: number, incr: boolean) => void;
  crop: (x: number, y: number, width: number, height: number) => void;
  rotate: (clockwise: boolean) => void;
  flip_h: () => void;
  flip_v: () => void;
  scale: (factor: number) => void;
  adjust_hsi: (h: number, s: number, t: number, g: boolean, i: boolean) => void;
  auto_adjust_intensity: () => void;
  manual_adjust_intensity: (c: number, b: number) => void;
  blur: (radius: number) => void;
  cartoonify: (a: number, b: number, c: number, d: boolean) => void;
}

// History state type
export interface HistoryState {
  width: number;
  height: number;
  pixels: Uint8Array;
}

// Component prop types
export interface EditorCallbacks {
  resizeCanvas: (autoFit: boolean) => void;
  loadImage: (src?: string | Blob) => void;
}

export interface RedrawProps {
  redraw?: (reposition?: boolean) => void;
}

export interface ToolSubtoolProps extends RedrawProps {
  onSelectTool: (evt?: React.MouseEvent<Element> | '') => void;
}

export interface ToolSubtoolWithLoadProps extends ToolSubtoolProps {
  loadImage?: EditorCallbacks['loadImage'];
}

export interface ZoomRatioProps {
  zoomRatio: number;
}

export interface DefaultComponentProps {
  className?: string;
  style?: React.CSSProperties;
}
