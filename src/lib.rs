extern crate cfg_if;
extern crate wasm_bindgen;

mod utils;
pub mod image;

use cfg_if::cfg_if;

cfg_if! {
    
    
    if #[cfg(feature = "wee_alloc")] {
        extern crate wee_alloc;
        #[global_allocator]
        static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
    }
}
