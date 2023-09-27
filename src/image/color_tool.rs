extern crate wasm_bindgen;
extern crate web_sys;

use wasm_bindgen::prelude::*;
use super::Image;
use super::Operation;

macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[wasm_bindgen]
impl Image {
    pub fn rgb_to_hsi(&mut self) { 
        let width = self.width as usize;
        let height = self.height as usize;
        let size = width * height;
        self.hsi = vec![vec![0_f64; size], vec![0_f64; size], vec![0_f64; size]];

        let two_pi = 2.0 * std::f64::consts::PI;
        let (mut r, mut g, mut b, mut hue);

        for idx in 0..size {
            
            
            
            r = self.pixels_bk[idx * 4 + 0] as f64 / 255.0;
            g = self.pixels_bk[idx * 4 + 1] as f64 / 255.0;
            b = self.pixels_bk[idx * 4 + 2] as f64 / 255.0;

            hue = (0.5 * ((r-g) + (r-b)) / (((r-g) * (r-g) + (r-b) * (g-b)).sqrt() + 0.001)).acos(); 
            if b > g {
                hue = two_pi - hue
            }

            self.hsi[0][idx] = hue;
            self.hsi[1][idx] = 1.0 - 3.0 / (r + g + b) * r.min(g).min(b); 
            self.hsi[2][idx] = (r + g + b) / 3.0 
        }
    }

    
    
    
    
    pub fn adjust_hsi(&mut self, h_amt: f64, s_amt: f64, t_amt: i32, grayscaled: bool, inverted: bool) {
        let width = self.width as usize;
        let height = self.height as usize;
        let two_pi = 2.0 * std::f64::consts::PI;

        let mut hue = vec![0_f64;0];
        
        let new_hue = |h: f64| -> f64 {
            if inverted {
                (two_pi - h + h_amt).min(two_pi).max(0.0)
            } else {
                (h + h_amt).min(two_pi).max(0.0)
            }
        };

        let hue_ref = if h_amt != 0.0 || inverted {
            hue = self.hsi[0].clone();
            for h in hue.iter_mut() {
                *h = new_hue(*h)
            }
            &hue
        } else {
            
            
            
            
            
            
            
            &hue
            
        };

        let mut saturation = vec![0_f64;0];
        let saturation_ref = if grayscaled { 
            saturation = vec![0_f64; width * height];
            &saturation
        } else if s_amt != 0.0 {
            saturation = self.hsi[1].clone();
            for s in saturation.iter_mut() {
                *s = (*s + s_amt).min(1.0).max(0.0);
            }
            &saturation
        } else {
            &saturation
        };

        let intensity_ref = &vec![0_f64;0];
        self.hsi_to_rgb(hue_ref, saturation_ref, intensity_ref, t_amt);
        self.last_operation = Operation::AdjustColor
    }

    
    
    
    pub fn hsi_to_rgb(&mut self, hue: &[f64], saturation: &[f64], intensity: &[f64], t_amt: i32) {
        let width = self.width as usize;
        let height = self.height as usize;

        let (mut h, mut s, mut i, mut x, mut y, mut z);
        let t_amt = t_amt as f64 / 255 as f64;
        let two_third_pi = 2.0 / 3.0 * std::f64::consts::PI;
        let four_third_pi = 2.0 * two_third_pi;

        let get_y= |i: f64, s: f64, h: f64| -> f64 { i * (1.0 + s * h.cos() / (((std::f64::consts::PI / 3.0) - h).cos())) };
        let get_z = |i: f64, x: f64, y: f64| -> f64 {3.0 * i - (x + y)};

        let hue = if hue.len() == 0 { &self.hsi[0] } else { hue };
        let saturation = if saturation.len() == 0 { &self.hsi[1] } else { saturation };
        let intensity = if intensity.len() == 0 { &self.hsi[2] } else { intensity };

        let denormalize = |v: f64| -> u8 {
            let v = (v * 255.0).round();
            if v >= 255.0 { 255 } else { v as u8 }
        };

        for idx in 0..width * height {
            h = hue[idx];
            s = saturation[idx];
            i = intensity[idx]; 

            x = i * (1.0 - s);

            if h >= four_third_pi { 
                h -= four_third_pi;
                y = get_y(i,s,h);
                z = get_z(i,x,y);

                self.pixels[idx * 4 + 0] = denormalize(z + t_amt);
                self.pixels[idx * 4 + 1] = denormalize(x);
                self.pixels[idx * 4 + 2] = denormalize(y - t_amt);
            } else if h >= two_third_pi { 
                h -= two_third_pi;
                y = get_y(i,s,h);
                z = get_z(i,x,y);

                self.pixels[idx * 4 + 0] = denormalize(x + t_amt);
                self.pixels[idx * 4 + 1] = denormalize(y);
                self.pixels[idx * 4 + 2] = denormalize(z - t_amt)
            } else { 
                y = get_y(i,s,h);
                z = get_z(i,x,y);
                self.pixels[idx * 4 + 0] = denormalize(y + t_amt);
                self.pixels[idx * 4 + 1] = denormalize(z);
                self.pixels[idx * 4 + 2] = denormalize(x - t_amt);
            }
        }
    }

    
    
    pub fn manual_adjust_intensity(&mut self, gain: f64, bias: f64) {
        let new_intensity = |v: &f64| -> f64 {
            let new_v = *v * gain + bias;
            new_v.min(1.0).max(0.0)
        };
        let intensity = self.hsi[2]
            .iter().map(new_intensity).collect::<Vec<_>>();
        let hue_ref = &vec![0_f64;0];
        let saturation_ref = &vec![0_f64;0];
        self.hsi_to_rgb(hue_ref, saturation_ref, &intensity, 0);
        self.last_operation = Operation::AdjustColor
    }

    pub fn auto_adjust_intensity(&mut self) {
        let mut intensity = self.hsi[2] 
            .iter()
            .map(|i| -> f64 {
                let v = (i * 255.0).round();
                if v > 255.0 {255.0} else {v}
            }).collect::<Vec<_>>();

        let mut intensity_dist = vec![0_f64; 256];
        let size = intensity.len();
        for idx in 0..size {
            intensity_dist[ intensity[idx] as usize ] += 1.0;
        }

        for i in intensity_dist.iter_mut() { 
            *i /= size as f64
        }

        let mut running_sum = 0.0;
        for idx in 1..256 { 
            running_sum = (intensity_dist[idx] + intensity_dist[idx - 1]).min(1.0);
            intensity_dist[idx] = running_sum
        }

        
        
        for i in intensity.iter_mut() {
            *i = intensity_dist[*i as usize]
        }
        

        let hue_ref = &vec![0_f64;0];
        let saturation_ref = &vec![0_f64;0];
        self.hsi_to_rgb(hue_ref, saturation_ref, &intensity, 0);
        self.last_operation = Operation::AdjustColor
    }

    
    
    
    pub fn clear_hsi(&mut self) {
        self.hsi = vec![vec![], vec![], vec![]];
    }

}
