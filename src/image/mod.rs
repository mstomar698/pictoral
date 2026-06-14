extern crate wasm_bindgen;
extern crate console_error_panic_hook;

use wasm_bindgen::prelude::*;

mod transform_tool;
mod color_tool;
mod filter_tool;

macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[derive(Copy, Clone, Debug)] 
pub enum Operation {
    NoOp,
    AdjustColor,
    Transform, 

    
    Pixelate {top_x: u32, top_y: u32, width: u32, height: u32},
    BilateralFilter,

    
    Miniaturize {top_height: u32, bottom_height: u32},
    GaussianBlur,
    Cartoonify,
}

#[wasm_bindgen]
pub struct Image {
    width: u32,
    height: u32,
    pixels: Vec<u8>,

    pixels_bk: Vec<u8>,
    width_bk: u32,
    height_bk: u32,

    last_operation: Operation,

    hsi: Vec<Vec<f64>>, 
    lab: Vec<f64>, 
    
}

#[wasm_bindgen]
impl Image {
    pub fn new(w: u32, h: u32, buf: Vec<u8>) -> Image {
        console_error_panic_hook::set_once();
        Image {
            width: w,
            height: h,
            pixels: buf.clone(),

            pixels_bk: buf,
            width_bk: w,
            height_bk: h,

            last_operation: Operation::NoOp,

            hsi: vec![vec![], vec![], vec![]],
            lab: vec![0_f64; 0],
            
        }
    }

    
    
    
    pub fn reuse(&mut self, w: u32, h: u32, buf: Vec<u8>) {
        self.pixels = buf.clone();
        self.width = w;
        self.height = h;

        self.pixels_bk = buf;
        self.width_bk = w;
        self.height_bk = h;
    }

    pub fn pixels(&self) -> *const u8 {
        self.pixels.as_ptr()
    }

    /// Returns a copy of the current pixel buffer as RGBA bytes (for JS canvas rendering).
    pub fn pixels_data(&self) -> Vec<u8> {
        self.pixels.clone()
    }

    pub fn width(&self) -> u32 { self.width }
    pub fn height(&self) -> u32 { self.height }
    pub fn width_bk(&self) -> u32 { self.width_bk }
    pub fn height_bk(&self) -> u32 { self.height_bk }

    
    fn cleanup(&mut self) {
        match self.last_operation {
            Operation::Pixelate {..} => {
                self.last_operation = Operation::Pixelate {top_x: 0, top_y: 0, width: 0, height: 0}
            }
            Operation::Miniaturize {..} => {
                self.last_operation = Operation::Miniaturize {top_height: 0, bottom_height: 0}
            }
            _ => {}
        }
    }

    pub fn apply_change(&mut self) {
        self.pixels_bk = self.pixels.clone();
        self.width_bk = self.width;
        self.height_bk = self.height;
        self.cleanup()
    }

    pub fn discard_change(&mut self) {
        self.pixels = self.pixels_bk.clone();
        self.width = self.width_bk;
        self.height = self.height_bk;
        self.cleanup()
    }

    
   
    pub fn undo(&mut self) {

    }

}

#[cfg(all(test, not(target_arch = "wasm32")))]
mod tests {
    use super::Image;

    fn solid_pixels(w: u32, h: u32, r: u8, g: u8, b: u8) -> Vec<u8> {
        let mut buf = vec![0u8; (w * h * 4) as usize];
        for px in 0..(w * h) as usize {
            buf[px * 4] = r;
            buf[px * 4 + 1] = g;
            buf[px * 4 + 2] = b;
            buf[px * 4 + 3] = 255;
        }
        buf
    }

    #[test]
    fn new_image_stores_dimensions() {
        let img = Image::new(4, 2, solid_pixels(4, 2, 255, 128, 64));
        assert_eq!(img.width(), 4);
        assert_eq!(img.height(), 2);
        assert_eq!(img.width_bk(), 4);
        assert_eq!(img.height_bk(), 2);
    }

    #[test]
    fn pixels_data_returns_rgba_buffer() {
        let buf = solid_pixels(1, 1, 10, 20, 30);
        let img = Image::new(1, 1, buf.clone());
        assert_eq!(img.pixels_data(), buf);
    }

    #[test]
    fn apply_change_syncs_backup_buffer() {
        let mut img = Image::new(2, 2, solid_pixels(2, 2, 255, 0, 0));
        img.flip_h();
        img.apply_change();
        assert_eq!(img.pixels_data().len(), 16);
        assert_eq!(img.width_bk(), 2);
        assert_eq!(img.height_bk(), 2);
    }

    #[test]
    fn discard_change_restores_backup() {
        let original = solid_pixels(1, 1, 100, 50, 25);
        let mut img = Image::new(1, 1, original.clone());
        img.flip_h();
        img.discard_change();
        assert_eq!(img.pixels_data(), original);
    }

    #[test]
    fn tiny_1x1_image_flip_roundtrip() {
        let original = solid_pixels(1, 1, 42, 84, 126);
        let mut img = Image::new(1, 1, original.clone());
        img.flip_h();
        img.apply_change();
        assert_eq!(img.pixels_data().len(), 4);
    }

    #[test]
    fn large_image_buffer_dimensions() {
        let w = 512u32;
        let h = 512u32;
        let buf = solid_pixels(w, h, 1, 2, 3);
        let img = Image::new(w, h, buf);
        assert_eq!(img.pixels_data().len(), (w * h * 4) as usize);
    }
}
