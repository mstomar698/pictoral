import { Image } from 'image-editor-bk-rust/image_editor';
import type { WasmImage, HistoryState } from '../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ImageClass = Image as any;

let imgObj = (function () {
  let img: WasmImage | null = null;
  let history: HistoryState[] = [];
  let historyIndex = -1;
  const MAX_HISTORY = 20;

  function createImgObj(): WasmImage {
    const newImg = ImageClass.new(0, 0, new Uint8Array(2));
    img = newImg;
    return newImg;
  }

  // Save current state to history stack
  function saveToHistory(): void {
    if (!img || img.width() === 0) return;
    
    // Get current image data from wasm - use pixels_bk as it's the saved version
    const width = img.width_bk();
    const height = img.height_bk();
    
    // Clone the backup pixels (these represent the last saved state)
    const pixelsArray = img.pixels_bk;
    if (!pixelsArray || pixelsArray.length === 0) return;
    
    const currentPixels = new Uint8Array(pixelsArray);
    
    // Remove any redo states
    if (historyIndex < history.length - 1) {
      history = history.slice(0, historyIndex + 1);
    }
    
    history.push({
      width,
      height,
      pixels: currentPixels
    });
    
    // Limit history size
    if (history.length > MAX_HISTORY) {
      history.shift();
    } else {
      historyIndex++;
    }
  }

  return {
    get_wasm_img: function (): WasmImage {
      if (!img) {
        img = createImgObj();
      }
      return img;
    },
    
    // Initialize history with current state (call when image is loaded)
    initHistory: function (): void {
      if (!img || img.width() === 0) return;
      
      const width = img.width();
      const height = img.height();
      
      // Get current pixels
      const pixelsArray = (img as unknown as { pixels_bk: Uint8Array }).pixels_bk;
      
      if (pixelsArray && pixelsArray.length > 0) {
        history = [{
          width,
          height,
          pixels: new Uint8Array(pixelsArray)
        }];
        historyIndex = 0;
      }
    },
    
    // Save current state to history (call before apply_change)
    saveState: function (): void {
      saveToHistory();
    },
    
    // Undo last change
    undo: function (): boolean {
      if (historyIndex > 0) {
        historyIndex--;
        const state = history[historyIndex];
        if (state && img) {
          img.reuse(state.width, state.height, state.pixels);
          return true;
        }
      }
      return false;
    },
    
    // Redo last undone change
    redo: function (): boolean {
      if (historyIndex < history.length - 1) {
        historyIndex++;
        const state = history[historyIndex];
        if (state && img) {
          img.reuse(state.width, state.height, state.pixels);
          return true;
        }
      }
      return false;
    },
    
    // Check if undo is available
    canUndo: function (): boolean {
      return historyIndex > 0;
    },
    
    // Check if redo is available
    canRedo: function (): boolean {
      return historyIndex < history.length - 1;
    },
    
    // Clear history
    clearHistory: function (): void {
      history = [];
      historyIndex = -1;
    },
    
    imgBuff: null as HTMLImageElement | null,
  };
})();

export default imgObj;
