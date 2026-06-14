use cfg_if::cfg_if;

#[cfg(all(test, not(target_arch = "wasm32")))]
mod tests {
    #[test]
    fn panic_hook_is_callable() {
        super::set_panic_hook();
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
