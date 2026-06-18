//! Browser WASM integration tests — run via `wasm-pack test --headless --chrome`.

use crate::image::Image;
use wasm_bindgen_test::*;

wasm_bindgen_test_configure!(run_in_browser);

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

#[wasm_bindgen_test]
fn wasm_new_image_stores_dimensions() {
    let img = Image::new(4, 2, solid_pixels(4, 2, 255, 128, 64));
    assert_eq!(img.width(), 4);
    assert_eq!(img.height(), 2);
    assert_eq!(img.pixels_data().len(), 32);
}

#[wasm_bindgen_test]
fn wasm_flip_and_discard_restores_pixels() {
    let original = solid_pixels(2, 1, 10, 20, 30);
    let mut img = Image::new(2, 1, original.clone());
    img.flip_h();
    img.discard_change();
    assert_eq!(img.pixels_data(), original);
}

#[wasm_bindgen_test]
fn wasm_gaussian_blur_smoke() {
    let mut img = Image::new(8, 8, solid_pixels(8, 8, 200, 100, 50));
    img.gaussian_blur(1.0, 0, 0, 8, 8, true);
    assert_eq!(img.pixels_data().len(), 256);
    assert_eq!(img.pixels_data()[0], 200);
    assert_eq!(img.pixels_data()[1], 100);
    assert_eq!(img.pixels_data()[2], 50);
}

#[wasm_bindgen_test]
fn wasm_scale_preserves_buffer_size_at_unity() {
    let buf = solid_pixels(4, 4, 1, 2, 3);
    let mut img = Image::new(4, 4, buf.clone());
    img.scale(1.0);
    assert_eq!(img.width(), 4);
    assert_eq!(img.height(), 4);
    assert_eq!(img.pixels_data(), buf);
}

#[wasm_bindgen_test]
fn wasm_bilateral_filter_smoke() {
    let mut buf = solid_pixels(8, 8, 200, 100, 50);
    buf[0] = 0;
    buf[1] = 0;
    buf[2] = 0;
    let mut img = Image::new(8, 8, buf);
    img.bilateral_filter(3, 5.0, 1, false);
    assert_eq!(img.pixels_data().len(), 256);
}

#[wasm_bindgen_test]
fn wasm_tiny_1x1_image_operations() {
    let buf = solid_pixels(1, 1, 255, 0, 0);
    let mut img = Image::new(1, 1, buf);
    img.flip_h();
    img.apply_change();
    assert_eq!(img.width(), 1);
    assert_eq!(img.pixels_data().len(), 4);
}
