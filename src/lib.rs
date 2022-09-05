// Adding Binaries Here //
extern crate cfg_if;
extern crate wasm_bindgen;

// Main JS connection link
pub mod image;
// Using Binaries Here //
use cfg_if::cfg_if;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
  a + b
}
#[test]
pub fn add_test() {
    assert_eq!(1 + 1, add(1, 1));
}

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn big_computation() {
    alert("Image-Editor");
}

#[wasm_bindgen]
pub fn welcome(name: &str) {
   alert(&format!("Hello {}, from Rust!", name));
}

// Setting Independent functions Here //
cfg_if! {
    if #[cfg(feature = "wee_alloc")] {
      extern crate wee_alloc;
      #[global_allocator]
      static ALLOC: wee_alloc::WeeAlloc = weealloc::WeAlloc::INIT;
    }
  }
  
  cfg_if! {
    if #[cfg(feature = "console_error_panic_hook")] {
        extern crate console_error_panic_hook;
        pub use self::console_error_panic_hook::set_once as set_panic_hook;
    } else {
        #[inline]
        pub fn set_panic_hook() {}
    }
  }
  
  macro_rules! log {
    ( $( $t:tt )* ) => {
      web_sys::console::log_1(&format!( $( $t )* ).into());
    }
  }
  