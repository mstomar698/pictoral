// Setting Binaries
extern crate wasm_bindgen;
extern crate console_error_panic_hook;

// Using Binaries
use wasm_bindgen::prelude::*;
use std::ops::Mul;
use std::ops::Add;
use std::default::Default;

// Sharing through other scripts
mod transform_tool;

// For Super::Operation used in transform_tool.rs
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
    // Other
    width_bk: u32,
    height_bk: u32,
    pixels_bk: Vec<u8>,
    // Operations
    last_operation: Operation,
    // Color
    hsi: Vec<Vec<f64>>,
    lab: Vec<f64>, //for bilateral filter coloring
    // dct: (Vec<f64>, Vec<f64>), // for JPEG only
}

#[wasm_bindgen]
impl Image {
    pub fn new(w: u32, h: u32, buf: Vec<u8>) -> Image {  // Image object
        console_error_panic_hook::set_once();
        Image {
            width: w,
            height: h,
            pixels: buf.clone(),
            // Other
            pixels_bk: buf,
            width_bk: w,
            height_bk: h,
            // Operations
            last_operation: Operation::NoOp,
            // Color
            hsi: vec![vec![], vec![], vec![]],
            lab: vec![0_f64; 0],
            // dct: Self::initialize_dct(),
        }
    }

    pub fn reuse(&mut self, w: u32, h: u32, buf: Vec<u8>) {
        self.pixels = buf.clone();
        self.width = w;
        self.height = h;
        // Other
        self.pixels_bk = buf;
        self.width_bk = w;
        self.height_bk = h;
    }

    pub fn pixels(&self) -> *const u8 { self.pixels.as_ptr() }
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


