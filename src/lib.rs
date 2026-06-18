extern crate cfg_if;
extern crate wasm_bindgen;

mod utils;
pub mod image;

#[cfg(all(test, target_arch = "wasm32"))]
mod wasm_integration_tests;
