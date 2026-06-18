extern crate wasm_bindgen;
extern crate web_sys;

use std::iter::Iterator;
use wasm_bindgen::prelude::*;
use super::Image;
use super::Operation;

/// Upper bound on squared Lab distance for bilateral range-kernel LUT indexing.
const BF_MAX_RANGE_SQ: f64 = 150_000.0;
const BF_RANGE_LUT_SIZE: usize = 16384;

macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[wasm_bindgen]
impl Image {
    pub fn pixelate(&mut self, top_x: i32, top_y: i32, p_width: u32, p_height: u32, block_size: u32, blur_type: &str) {
        let img_width = self.width;
        let img_height = self.height;

        
        let top_x = top_x.max(0).min((img_width - 1) as i32) as u32; 
        let top_y = top_y.max(0).min((img_height - 1) as i32) as u32;
        let p_width = p_width.max(1).min(img_width);
        let p_height = p_height.max(1).min(img_height);

        if top_x + p_width > img_width as u32 || top_y + p_height > img_height as u32 {
            
            return
        }

        self.restore_area(false);
        if blur_type == "gaussian" {
            self.gaussian_blur(block_size as f64, top_x as i32, top_y as i32, p_width, p_height, false);
            return
        }

        let mut x; 
        let mut y;
        
        let mut block_position = vec![(0_usize, 0_usize); (block_size * block_size) as usize];
        let mut block_avg;

        for row in (0..p_height).step_by(block_size as usize) {
            for col in (0..p_width).step_by(block_size as usize) {
                x = top_x as u32 + col;
                y = top_y as u32 + row;

                
                
                
                for i in 0..block_size {
                    for j in 0..block_size {
                        block_position[(i * block_size as u32 + j) as usize] = (
                            
                            
                            
                            (x + j).min(top_x + p_width - 1) as usize,
                            (y + i).min(top_y + p_height - 1) as usize,
                        );
                    }
                }

                for offset in 0..3 {
                    block_avg = block_position.iter().fold(0_u32, |sum, (x,y)| -> u32 {
                        self.pixels_bk[ (*y * img_width as usize + *x) * 4 + offset ] as u32 + sum
                    });
                    block_avg = (block_avg as f64 / (block_size * block_size) as f64).round() as u32;
                    for (x, y) in block_position.iter() {
                        self.pixels[ (*y * img_width as usize + *x) * 4 + offset] = block_avg as u8;
                    }
                }
            }
        }
        self.last_operation = Operation::Pixelate {top_x, top_y, width: p_width, height: p_height}
        
    }

    
    
    fn restore_area(&mut self, is_top: bool) {
        let img_width = self.width;
        let img_height = self.height;

        
        
        let last_op = self.last_operation;
        let mut restore = |x, y, w, h| {
            let mut idx: usize;
            for row in y..(y + h) {
                for col in x..(x + w) {
                    idx = (row * img_width + col) as usize;
                    self.pixels[idx * 4 + 0] = self.pixels_bk[idx * 4 + 0];
                    self.pixels[idx * 4 + 1] = self.pixels_bk[idx * 4 + 1];
                    self.pixels[idx * 4 + 2] = self.pixels_bk[idx * 4 + 2];
                }
            }
        };

        match last_op {
            Operation::Pixelate {top_x, top_y, width, height} => {
                if top_x == 0 && top_y == 0 && width == 0 && height == 0 {return}

                restore(top_x, top_y, width, height)
            }
            Operation::Miniaturize {top_height, bottom_height} => {
                let top_x = 0;
                let top_y;
                let width = img_width;
                let height;
                if is_top {
                    top_y = 0;
                    height = top_height
                } else {
                    top_y = img_height - bottom_height;
                    height = bottom_height
                }
                restore(top_x, top_y, width, height)
            }
            _ => {return;}
        }
    }

    pub fn miniaturize(&mut self, sigma: f64, height: u32, is_top: bool) {
        let top_x = 0;
        let top_y = if is_top {0} else {self.height - height};

        let img_width = self.width;
        let img_height = self.height;
        if height > img_height || height == 0 {return}

        self.restore_area(is_top);
        self.gaussian_blur(sigma, top_x as i32, top_y as i32, img_width, height, false);

        
        
        
        let gradient_height = (height as f64 * 0.20) as u32;
        let mut blur_ratio;
        let mut ratio_step= 1.0 / gradient_height as f64;
        let gradient_range;

        if is_top {
            blur_ratio = 1.0;
            gradient_range = (height - gradient_height)..height;
        } else {
            blur_ratio = 0.0;
            ratio_step *= -1.0;
            gradient_range = (self.height - height)..(self.height - height + gradient_height);
        }

        for row in gradient_range {
            blur_ratio -= ratio_step;
            for col in 0..img_width {
                let idx = (row * img_width + col) as usize;
                self.pixels[idx * 4 + 0] = (self.pixels[idx * 4 + 0] as f64 * blur_ratio + self.pixels_bk[idx * 4 + 0] as f64 * (1.0 - blur_ratio)).round() as u8;
                self.pixels[idx * 4 + 1] = (self.pixels[idx * 4 + 1] as f64 * blur_ratio + self.pixels_bk[idx * 4 + 1] as f64 * (1.0 - blur_ratio)).round() as u8;
                self.pixels[idx * 4 + 2] = (self.pixels[idx * 4 + 2] as f64 * blur_ratio + self.pixels_bk[idx * 4 + 2] as f64 * (1.0 - blur_ratio)).round() as u8;
            }
        }

        self.last_operation = match self.last_operation {
            
            Operation::Miniaturize {top_height, bottom_height} => {
                if is_top {
                    Operation::Miniaturize {top_height: height, bottom_height}
                } else {
                    Operation::Miniaturize {top_height, bottom_height: height}
                }
            }
            _ => { 
                if is_top {
                    Operation::Miniaturize {top_height: height, bottom_height: 0}
                } else {
                    Operation::Miniaturize {top_height: 0, bottom_height: height}
                }

            }
        };
    }

    
    pub fn blur(&mut self, sigma: f64) {
        let (top_x, top_y, width, height, is_standalone) = (0, 0, self.width, self.height, true);
        self.gaussian_blur(sigma, top_x, top_y, width, height, is_standalone)
    }

    
    
    
    
    pub fn gaussian_blur(&mut self, sigma: f64, top_x: i32, top_y: i32, width: u32, height: u32, is_standalone: bool) {
        let mut top_x = top_x.max(0).min(self.width_bk as i32);
        let mut top_y = top_y.max(0).min(self.height_bk as i32);
        let width = width.min(self.width_bk);
        let height = height.min(self.height_bk);

        if top_x as u32 + width > self.width_bk {
            top_x = (self.width_bk - width) as i32
        }
        if top_y as u32 + height > self.height_bk {
            top_y = (self.height_bk - height) as i32
        }

        let img_width = self.width;

        let whole_img_blur = width == self.width && height == self.height;
        let pixel_bytes = (width * height * 4) as usize;
        self.ensure_blur_scratch(pixel_bytes);

        let num_pass = 3;
        let box_size = self.box_for_gaussian(sigma, num_pass);

        if whole_img_blur {
            let bk = self.pixels_bk.as_slice();
            for idx in 0..num_pass {
                let r = box_size[idx as usize] / 2;
                if idx % 2 == 0 {
                    Self::box_blur_h(bk, &mut self.blur_scratch_a[..pixel_bytes], width, height, r);
                    Self::box_blur_v(
                        &self.blur_scratch_a[..pixel_bytes],
                        &mut self.blur_scratch_b[..pixel_bytes],
                        width,
                        height,
                        r,
                    );
                } else {
                    Self::box_blur_h(
                        &self.blur_scratch_b[..pixel_bytes],
                        &mut self.blur_scratch_a[..pixel_bytes],
                        width,
                        height,
                        r,
                    );
                    Self::box_blur_v(
                        &self.blur_scratch_a[..pixel_bytes],
                        &mut self.blur_scratch_b[..pixel_bytes],
                        width,
                        height,
                        r,
                    );
                }
            }
            let final_buf = if (num_pass - 1) % 2 == 0 {
                &self.blur_scratch_b[..pixel_bytes]
            } else {
                &self.blur_scratch_a[..pixel_bytes]
            };
            if self.pixels.len() == pixel_bytes {
                self.pixels.copy_from_slice(final_buf);
            } else {
                self.pixels = final_buf.to_vec();
            }
        } else {
            let mut src: Vec<u8> = Vec::with_capacity(pixel_bytes);
            for r in 0..height {
                let start_idx = ((top_y as u32 + r) * img_width + top_x as u32) as usize;
                let end_idx = start_idx + width as usize;
                let row = &self.pixels_bk[(start_idx * 4)..(end_idx * 4)];
                src.extend_from_slice(row);
            }

            let mut tgt: Vec<u8> = vec![0_u8; pixel_bytes];
            for idx in 0..num_pass {
                let r = box_size[idx as usize] / 2;
                Self::box_blur_h(&src, &mut tgt, width, height, r);
                Self::box_blur_v(&tgt, &mut src, width, height, r);
            }

            for row in 0..height {
                for col in 0..width {
                    let idx_img = ((top_y as u32 + row) * img_width + (top_x as u32 + col)) as usize;
                    let idx_box = (row * width + col) as usize;
                    self.pixels[idx_img * 4 + 0] = src[idx_box * 4 + 0];
                    self.pixels[idx_img * 4 + 1] = src[idx_box * 4 + 1];
                    self.pixels[idx_img * 4 + 2] = src[idx_box * 4 + 2];
                }
            }
        }

        
        if is_standalone {
            self.last_operation = Operation::GaussianBlur
        }
    }

    
    fn box_blur_v(src: &[u8], tgt: &mut [u8], width: u32, height: u32, radius: u32) {
        let channel_count = (src.len() as f64 / (width * height) as f64) as u32;
        let channel_count = if channel_count >= 3 { 4 } else { 1 };
        let mut r = radius;
        if r % 2 == 0 {
            r += 1;
        }
        let kernel_size = r * 2 + 1;
        let r_i = r as i32;
        let h_i = height as i32;
        let norm = kernel_size;
        let avg = 1.0 / norm as f64;

        for col in 0..width {
            let mut sum = vec![0_u32; channel_count as usize];

            for k in 0..kernel_size {
                let sr = (0i32 - r_i + k as i32).clamp(0, h_i - 1) as u32;
                let idx = (sr * width + col) as usize;
                for c in 0..channel_count {
                    sum[c as usize] += src[idx * channel_count as usize + c as usize] as u32;
                }
            }
            for c in 0..channel_count {
                let idx = col as usize;
                tgt[idx * channel_count as usize + c as usize] =
                    (sum[c as usize] as f64 * avg).min(255.0).round() as u8;
            }

            for row in 1..height {
                let remove_row = ((row as i32 - 1) - r_i).clamp(0, h_i - 1) as u32;
                let add_row = ((row as i32) + r_i).clamp(0, h_i - 1) as u32;
                let rem_idx = (remove_row * width + col) as usize;
                let add_idx = (add_row * width + col) as usize;
                for c in 0..channel_count {
                    let ci = c as usize;
                    sum[ci] = sum[ci]
                        .saturating_sub(src[rem_idx * channel_count as usize + ci] as u32)
                        .saturating_add(src[add_idx * channel_count as usize + ci] as u32);
                }
                let out_idx = (row * width + col) as usize;
                for c in 0..channel_count {
                    tgt[out_idx * channel_count as usize + c as usize] =
                        (sum[c as usize] as f64 * avg).min(255.0).round() as u8;
                }
            }
        }
    }

    fn box_blur_h(src: &[u8], tgt: &mut [u8], width: u32, height: u32, radius: u32) {
        let channel_count = (src.len() as f64 / (width * height) as f64) as u32;
        let channel_count = if channel_count >= 3 { 4 } else { 1 };
        let mut r = radius;
        if r % 2 == 0 {
            r += 1;
        }
        let kernel_size = r * 2 + 1;
        let r_i = r as i32;
        let w_i = width as i32;
        let norm = kernel_size;
        let avg = 1.0 / norm as f64;

        for row in 0..height {
            let row_off = (row * width) as usize;
            let mut sum = vec![0_u32; channel_count as usize];

            for k in 0..kernel_size {
                let sc = (0i32 - r_i + k as i32).clamp(0, w_i - 1) as u32;
                let idx = row_off + sc as usize;
                for c in 0..channel_count {
                    sum[c as usize] += src[idx * channel_count as usize + c as usize] as u32;
                }
            }
            for c in 0..channel_count {
                tgt[row_off * channel_count as usize + c as usize] =
                    (sum[c as usize] as f64 * avg).min(255.0).round() as u8;
            }

            for col in 1..width {
                let remove_col = ((col as i32 - 1) - r_i).clamp(0, w_i - 1) as u32;
                let add_col = ((col as i32) + r_i).clamp(0, w_i - 1) as u32;
                let rem_idx = row_off + remove_col as usize;
                let add_idx = row_off + add_col as usize;
                for c in 0..channel_count {
                    let ci = c as usize;
                    sum[ci] = sum[ci]
                        .saturating_sub(src[rem_idx * channel_count as usize + ci] as u32)
                        .saturating_add(src[add_idx * channel_count as usize + ci] as u32);
                }
                let out_idx = row_off + col as usize;
                for c in 0..channel_count {
                    tgt[out_idx * channel_count as usize + c as usize] =
                        (sum[c as usize] as f64 * avg).min(255.0).round() as u8;
                }
            }
        }
    }

    fn box_for_gaussian(&self, sigma: f64, n: u32) -> Vec<u32> {
        
        let w_ideal = ((12.0 * sigma * sigma / n as f64) + 1.0).sqrt();
        let mut wl: f64 = w_ideal.floor();

        if wl as u32 % 2 == 0 {
            wl -= 1.0;
        };
        let wu = wl + 2.0;

        let m_ideal = (12.0 * sigma * sigma - n as f64 * wl * wl - 4.0 * n as f64 * wl - 3.0 * n as f64) /
            (-4.0 * wl - 4.0);
        let m = m_ideal.round();

        let mut sizes:Vec<u32> = Vec::with_capacity(n as usize);
        for i in 0..n {
            if i < m as u32 {
                sizes.push(wl as u32);
            } else {
                sizes.push(wu as u32);
            }
        }
        sizes
    }

  
    fn median_filter(&mut self, radius: u32) {
        let radius = if radius % 2 == 0 {radius + 1} else {radius};
        if radius > self.height / 2 || radius > self.width / 2 { 
            log!("radius must at least larger than half of image width and height");
            return
        }

        let kernel_width = 2 * radius + 1;
        let img_width = self.width;
        let img_height = self.height;
        let mut histogram = vec![vec![0_u32; 256]; 3];
        
        for row in (-1 * radius as i32)..(radius as i32 + 1) {
            for col in (-1 * radius as i32)..(radius as i32 + 1) {
                let idx = (row.max(0) * kernel_width as i32 + col.max(0)) as usize;
                let r = self.pixels_bk[idx * 4 + 0] as usize;
                let g = self.pixels_bk[idx * 4 + 1] as usize;
                let b = self.pixels_bk[idx * 4 + 2] as usize;
                histogram[0][r] += 1;
                histogram[1][g] += 1;
                histogram[2][b] += 1;
            }
        }

        
        
        
        let mut update_hist_h = |row: i32, col: i32, histogram: &mut Vec<Vec<u32>>, pixels: &[u8]| {
            let radius = radius as i32;
            let (mut r, mut g, mut b);
            let mut idx;
            for i in 0..kernel_width {
                let row_to_add = (row - radius + i as i32).max(0).min(img_height as i32 - 1) as u32;
                let col_to_add = (col + radius + 1).min(img_width as i32 - 1) as u32; 
                idx = (row_to_add * img_width + col_to_add) as usize;
                r = pixels[idx * 4 + 0] as usize;
                g = pixels[idx * 4 + 1] as usize;
                b = pixels[idx * 4 + 2] as usize;
                histogram[0][r] += 1;
                histogram[1][g] += 1;
                histogram[2][b] += 1;

                
                
                let col_to_remove = (col - radius).max(0) as u32;
                idx = (row_to_add * img_width + col_to_remove) as usize;
                r = pixels[idx * 4 + 0] as usize;
                g = pixels[idx * 4 + 1] as usize;
                b = pixels[idx * 4 + 2] as usize;
                histogram[0][r] = if histogram[0][r] == 0 {0} else {histogram[0][r] - 1};
                histogram[1][g] = if histogram[1][g] == 0 {0} else {histogram[1][g] - 1};
                histogram[2][b] = if histogram[2][b] == 0 {0} else {histogram[2][b] - 1};
            }
        };

        let update_hist_v = |row: i32, col: i32, v_dir: i32, histogram: &mut Vec<Vec<u32>>, pixels: &[u8]| {
            let radius = radius as i32;
            let row_to_add = (row + radius * v_dir + 1 * v_dir).max(0).min((img_height - 1) as i32) as u32;
            let row_to_remove = (row - radius * v_dir).max(0).min((img_height - 1) as i32) as u32;
            let (mut r, mut g, mut b);
            let mut idx;
            for i in 0..kernel_width {
                let col_to_add = (col - radius + i as i32).max(0).min(img_width as i32 - 1) as u32;
                idx = (row_to_add * img_width + col_to_add) as usize;

                r = pixels[idx * 4 + 0] as usize;
                g = pixels[idx * 4 + 1] as usize;
                b = pixels[idx * 4 + 2] as usize;
                histogram[0][r] += 1;
                histogram[1][g] += 1;
                histogram[2][b] += 1;

                
                
                idx = (row_to_remove * img_width + col_to_add) as usize;
                r = pixels[idx * 4 + 0] as usize;
                g = pixels[idx * 4 + 1] as usize;
                b = pixels[idx * 4 + 2] as usize;
                histogram[0][r] = if histogram[0][r] == 0 {0} else {histogram[0][r] - 1};
                histogram[1][g] = if histogram[1][g] == 0 {0} else {histogram[1][g] - 1};
                histogram[2][b] = if histogram[2][b] == 0 {0} else {histogram[2][b] - 1};
            }
        };

        let mut v_dir = 1; 
        let mut turned = true;
        
        
        
        for col in 0..img_width {
            let (mut top_down, mut bottom_up) = (0..img_height, (0..img_height).rev());
            let row_range = if v_dir == 1 { &mut top_down } else { &mut bottom_up as &mut dyn Iterator<Item = _> };
            for row in row_range {
                let idx = (row * img_width + col) as usize;
                let mut median= 0;
                for (color_channel, hist) in histogram.iter().enumerate() {
                    let mut running_sum = 0;
                    
                    
                    
                    
                    let limit = histogram[color_channel].iter().sum::<u32>() / 2;
                    for i in 0..256 {
                        running_sum += hist[i];
                        if running_sum > limit {
                            median = i;
                            break
                        }
                    }
                    self.pixels[idx * 4 + color_channel] = median as u8;
                }

                if row % (img_height - 1) != 0 { 
                    update_hist_v(row as i32, col as i32, v_dir, &mut histogram, &self.pixels_bk)
                } else {
                    if turned {
                        update_hist_v(row as i32, col as i32, v_dir, &mut histogram, &self.pixels_bk);
                        turned = false;
                    } else { 
                        update_hist_h(row as i32, col as i32, &mut histogram, &self.pixels_bk)   ;
                        turned = true;
                    }
                }
            }
            v_dir = -1 * v_dir;
        }
    }

    pub fn bilateral_filter(&mut self, radius: u32, sigma_r: f64, iter_count: u32, incr: bool) {
        let pixel_bytes = (self.width * self.height * 4) as usize;
        self.ensure_bf_scratch(pixel_bytes);
        if self.lab.len() != pixel_bytes {
            self.lab.resize(pixel_bytes, 0.0);
        }

        if incr {
            self.bf_scratch_a[..pixel_bytes].copy_from_slice(&self.pixels);
        } else {
            self.bf_scratch_a[..pixel_bytes].copy_from_slice(&self.pixels_bk);
        }

        let spatial_kernel = Self::build_spatial_kernel(radius);
        self.ensure_range_lut(sigma_r);

        for _ in 0..iter_count {
            {
                let lab = &mut self.lab;
                let src = &self.bf_scratch_a[..pixel_bytes];
                Self::fill_lab_from_rgb(lab, self.width, self.height, src);
            }
            Self::iterative_bf(
                &self.lab,
                &self.bf_scratch_a[..pixel_bytes],
                &mut self.bf_scratch_b[..pixel_bytes],
                self.width,
                self.height,
                radius,
                &spatial_kernel,
                &self.bf_range_lut,
            );
            std::mem::swap(&mut self.bf_scratch_a, &mut self.bf_scratch_b);
        }

        let final_buf = if iter_count % 2 == 0 {
            &self.bf_scratch_b[..pixel_bytes]
        } else {
            &self.bf_scratch_a[..pixel_bytes]
        };
        if self.pixels.len() == pixel_bytes {
            self.pixels.copy_from_slice(final_buf);
        } else {
            self.pixels = final_buf.to_vec();
        }
        self.last_operation = Operation::BilateralFilter;
    }

    fn ensure_range_lut(&mut self, sigma_r: f64) {
        if self.bf_range_lut.is_empty() || (self.bf_range_sigma - sigma_r).abs() > f64::EPSILON {
            self.bf_range_lut = Self::build_range_lut(sigma_r);
            self.bf_range_sigma = sigma_r;
        }
    }

    fn build_range_lut(sigma_r: f64) -> Vec<f64> {
        let inv = -0.5 / (sigma_r * sigma_r);
        (0..BF_RANGE_LUT_SIZE)
            .map(|i| {
                let sq = (i as f64 / (BF_RANGE_LUT_SIZE - 1) as f64) * BF_MAX_RANGE_SQ;
                (inv * sq).exp()
            })
            .collect()
    }

    fn range_weight_lut(lut: &[f64], range_sq: f64) -> f64 {
        if range_sq <= 0.0 {
            return lut[0];
        }
        if range_sq >= BF_MAX_RANGE_SQ {
            return lut[BF_RANGE_LUT_SIZE - 1];
        }
        let t = range_sq / BF_MAX_RANGE_SQ;
        let f = t * (BF_RANGE_LUT_SIZE - 1) as f64;
        let i = f.floor() as usize;
        let frac = f - i as f64;
        let j = (i + 1).min(BF_RANGE_LUT_SIZE - 1);
        lut[i] * (1.0 - frac) + lut[j] * frac
    }

    fn build_spatial_kernel(radius: u32) -> Vec<f64> {
        let sigma_d = radius as f64 / 2.0;
        let inv_2sigma2 = -0.5 / (sigma_d * sigma_d);
        let kernel_size = 2 * radius as usize + 1;
        let mut kernel = Vec::with_capacity(kernel_size * kernel_size);
        for row in 0..kernel_size {
            for col in 0..kernel_size {
                let x = row as i32 - radius as i32;
                let y = col as i32 - radius as i32;
                let sq = (x * x + y * y) as f64;
                kernel.push((inv_2sigma2 * sq).exp());
            }
        }
        kernel
    }

    fn iterative_bf(
        lab: &[f64],
        src: &[u8],
        tgt: &mut [u8],
        img_width: u32,
        img_height: u32,
        radius: u32,
        spatial_kernel: &[f64],
        range_lut: &[f64],
    ) {
        let kernel_size = 2 * radius as usize + 1;
        let h_max = img_height as i32 - 1;
        let w_max = img_width as i32 - 1;

        for row in 0..img_height {
            for col in 0..img_width {
                let center_idx = (row * img_width + col) as usize;
                let l1 = lab[center_idx * 4];
                let a1 = lab[center_idx * 4 + 1];
                let b1 = lab[center_idx * 4 + 2];

                let mut weight = 0.0;
                let mut new_r = 0.0;
                let mut new_g = 0.0;
                let mut new_b = 0.0;

                for i in 0..kernel_size {
                    for j in 0..kernel_size {
                        let r = (row as i32 - radius as i32 + i as i32)
                            .clamp(0, h_max) as usize;
                        let c = (col as i32 - radius as i32 + j as i32)
                            .clamp(0, w_max) as usize;
                        let idx = r * img_width as usize + c;

                        let l2 = lab[idx * 4];
                        let a2 = lab[idx * 4 + 1];
                        let b2 = lab[idx * 4 + 2];
                        let dl = l1 - l2;
                        let da = a1 - a2;
                        let db = b1 - b2;
                        let range_sq = dl * dl + da * da + db * db;

                        let composite_weight =
                            spatial_kernel[i * kernel_size + j] * Self::range_weight_lut(range_lut, range_sq);

                        new_r += src[idx * 4] as f64 * composite_weight;
                        new_g += src[idx * 4 + 1] as f64 * composite_weight;
                        new_b += src[idx * 4 + 2] as f64 * composite_weight;
                        weight += composite_weight;
                    }
                }
                tgt[center_idx * 4] = (new_r / weight) as u8;
                tgt[center_idx * 4 + 1] = (new_g / weight) as u8;
                tgt[center_idx * 4 + 2] = (new_b / weight) as u8;
            }
        }
    }

    
    
    
    fn fill_lab_from_rgb(lab: &mut [f64], width: u32, _height: u32, rgb: &[u8]) {
        let (mut r, mut g, mut b, mut x, mut y, mut z, mut xr, mut yr, mut zr);
        let xr_ref = 95.047;
        let yr_ref = 100.0;
        let zr_ref = 108.883;

        for idx in 0..(width * _height) {
            r = rgb[idx as usize * 4 + 0] as f64 / 255.0;
            g = rgb[idx as usize * 4 + 1] as f64 / 255.0;
            b = rgb[idx as usize * 4 + 2] as f64 / 255.0;

            if r > 0.04045 {
                r = ((r + 0.055) / 1.055).powf(2.4);
            } else {
                r /= 12.92;
            }

            if g > 0.04045 {
                g = ((g + 0.055) / 1.055).powf(2.4);
            } else {
                g /= 12.92;
            }

            if b > 0.04045 {
                b = ((b + 0.055) / 1.055).powf(2.4);
            } else {
                b /= 12.92;
            }

            r *= 100.0;
            g *= 100.0;
            b *= 100.0;

            x = 0.4124 * r + 0.3576 * g + 0.1805 * b;
            y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            z = 0.0193 * r + 0.1192 * g + 0.9505 * b;

            xr = x / xr_ref;
            yr = y / yr_ref;
            zr = z / zr_ref;

            if xr > 0.008856 {
                xr = xr.powf(1.0 / 3.0);
            } else {
                xr = (7.787 * xr) + 16.0 / 116.0;
            }

            if yr > 0.008856 {
                yr = yr.powf(1.0 / 3.0);
            } else {
                yr = (7.787 * yr) + 16.0 / 116.0;
            }

            if zr > 0.008856 {
                zr = zr.powf(1.0 / 3.0);
            } else {
                zr = (7.787 * zr) + 16.0 / 116.0;
            }

            lab[idx as usize * 4 + 0] = (116.0 * yr) - 16.0;
            lab[idx as usize * 4 + 1] = 500.0 * (xr - yr);
            lab[idx as usize * 4 + 2] = 200.0 * (yr - zr);
        }
    }

}
