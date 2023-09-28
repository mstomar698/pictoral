import * as wasm from './image_editor_bg.wasm';

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = new Uint8Array();

function getUint8Memory0() {
    if (cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachedFloat64Memory0 = new Float64Array();

function getFloat64Memory0() {
    if (cachedFloat64Memory0.byteLength === 0) {
        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64Memory0;
}

function passArrayF64ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 8);
    getFloat64Memory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let cachedInt32Memory0 = new Int32Array();

function getInt32Memory0() {
    if (cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}
/**
*/
export class Image {

    static __wrap(ptr) {
        const obj = Object.create(Image.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_image_free(ptr);
    }
    /**
    * @param {number} w
    * @param {number} h
    * @param {Uint8Array} buf
    * @returns {Image}
    */
    static new(w, h, buf) {
        const ptr0 = passArray8ToWasm0(buf, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.image_new(w, h, ptr0, len0);
        return Image.__wrap(ret);
    }
    /**
    * @param {number} w
    * @param {number} h
    * @param {Uint8Array} buf
    */
    reuse(w, h, buf) {
        const ptr0 = passArray8ToWasm0(buf, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.image_reuse(this.ptr, w, h, ptr0, len0);
    }
    /**
    * @returns {number}
    */
    pixels() {
        const ret = wasm.image_pixels(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    width() {
        const ret = wasm.image_width(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    height() {
        const ret = wasm.image_height(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    width_bk() {
        const ret = wasm.image_width_bk(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    height_bk() {
        const ret = wasm.image_height_bk(this.ptr);
        return ret >>> 0;
    }
    /**
    */
    apply_change() {
        wasm.image_apply_change(this.ptr);
    }
    /**
    */
    discard_change() {
        wasm.image_discard_change(this.ptr);
    }
    /**
    */
    undo() {
        wasm.image_undo(this.ptr);
    }
    /**
    */
    rgb_to_hsi() {
        wasm.image_rgb_to_hsi(this.ptr);
    }
    /**
    * @param {number} h_amt
    * @param {number} s_amt
    * @param {number} t_amt
    * @param {boolean} grayscaled
    * @param {boolean} inverted
    */
    adjust_hsi(h_amt, s_amt, t_amt, grayscaled, inverted) {
        wasm.image_adjust_hsi(this.ptr, h_amt, s_amt, t_amt, grayscaled, inverted);
    }
    /**
    * @param {Float64Array} hue
    * @param {Float64Array} saturation
    * @param {Float64Array} intensity
    * @param {number} t_amt
    */
    hsi_to_rgb(hue, saturation, intensity, t_amt) {
        const ptr0 = passArrayF64ToWasm0(hue, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(saturation, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayF64ToWasm0(intensity, wasm.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        wasm.image_hsi_to_rgb(this.ptr, ptr0, len0, ptr1, len1, ptr2, len2, t_amt);
    }
    /**
    * @param {number} gain
    * @param {number} bias
    */
    manual_adjust_intensity(gain, bias) {
        wasm.image_manual_adjust_intensity(this.ptr, gain, bias);
    }
    /**
    */
    auto_adjust_intensity() {
        wasm.image_auto_adjust_intensity(this.ptr);
    }
    /**
    */
    clear_hsi() {
        wasm.image_clear_hsi(this.ptr);
    }
    /**
    * @param {number} top_x
    * @param {number} top_y
    * @param {number} width
    * @param {number} height
    */
    crop(top_x, top_y, width, height) {
        wasm.image_crop(this.ptr, top_x, top_y, width, height);
    }
    /**
    * @param {boolean} clockwise
    */
    rotate(clockwise) {
        wasm.image_rotate(this.ptr, clockwise);
    }
    /**
    */
    rotate_by() {
        wasm.image_rotate_by(this.ptr);
    }
    /**
    */
    flip_v() {
        wasm.image_flip_v(this.ptr);
    }
    /**
    */
    flip_h() {
        wasm.image_flip_h(this.ptr);
    }
    /**
    * @param {number} factor
    */
    scale(factor) {
        wasm.image_scale(this.ptr, factor);
    }
    /**
    * @param {number} top_x
    * @param {number} top_y
    * @param {number} p_width
    * @param {number} p_height
    * @param {number} block_size
    * @param {string} blur_type
    */
    pixelate(top_x, top_y, p_width, p_height, block_size, blur_type) {
        const ptr0 = passStringToWasm0(blur_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.image_pixelate(this.ptr, top_x, top_y, p_width, p_height, block_size, ptr0, len0);
    }
    /**
    * @param {number} sigma
    * @param {number} height
    * @param {boolean} is_top
    */
    miniaturize(sigma, height, is_top) {
        wasm.image_miniaturize(this.ptr, sigma, height, is_top);
    }
    /**
    * @param {number} sigma
    */
    blur(sigma) {
        wasm.image_blur(this.ptr, sigma);
    }
    /**
    * @param {number} sigma
    * @param {number} top_x
    * @param {number} top_y
    * @param {number} width
    * @param {number} height
    * @param {boolean} is_standalone
    */
    gaussian_blur(sigma, top_x, top_y, width, height, is_standalone) {
        wasm.image_gaussian_blur(this.ptr, sigma, top_x, top_y, width, height, is_standalone);
    }
    /**
    * @param {number} radius
    * @param {number} sigma_r
    * @param {number} iter_count
    * @param {boolean} incr
    */
    bilateral_filter(radius, sigma_r, iter_count, incr) {
        wasm.image_bilateral_filter(this.ptr, radius, sigma_r, iter_count, incr);
    }
}

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

export function __wbg_new_693216e109162396() {
    const ret = new Error();
    return addHeapObject(ret);
};

export function __wbg_stack_0ddaca5d1abfb52f(arg0, arg1) {
    const ret = getObject(arg1).stack;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbg_error_09919627ac0992f5(arg0, arg1) {
    try {
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(arg0, arg1);
    }
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

