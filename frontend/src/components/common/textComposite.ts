import imgObj from './imgObj';

export interface TextOverlayOptions {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
}

/** Rasterize text onto the WASM pixel buffer and commit to history. */
export function applyTextOverlay(
  options: TextOverlayOptions,
  redraw: () => void
): void {
  const { text, x, y, fontSize, color, fontFamily } = options;
  if (!text.trim()) return;

  const wasm = imgObj.get_wasm_img();
  const w = wasm.width();
  const h = wasm.height();
  const pixels = wasm.pixels_data();

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.putImageData(new ImageData(new Uint8ClampedArray(pixels), w, h), 0, 0);
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textBaseline = 'top';
  ctx.fillText(text, x, y);

  const merged = ctx.getImageData(0, 0, w, h);
  wasm.reuse(w, h, Uint8Array.from(merged.data));
  wasm.apply_change();
  imgObj.saveState();
  redraw();
}

/** Map a canvas click to image-space coordinates. */
export function canvasClickToImageCoords(
  evt: MouseEvent,
  zoomRatio: number
): { x: number; y: number } {
  const canvas = evt.target as HTMLCanvasElement;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const canvasX = (evt.clientX - rect.left) * scaleX;
  const canvasY = (evt.clientY - rect.top) * scaleY;
  return {
    x: Math.round(canvasX / zoomRatio),
    y: Math.round(canvasY / zoomRatio),
  };
}
