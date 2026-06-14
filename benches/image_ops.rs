use criterion::{black_box, criterion_group, criterion_main, BenchmarkId, Criterion};
use image_editor::image::Image;

fn solid_pixels(width: u32, height: u32) -> Vec<u8> {
    vec![128u8; (width * height * 4) as usize]
}

fn bench_gaussian_blur(c: &mut Criterion) {
    let mut group = c.benchmark_group("gaussian_blur");
    for size in [128u32, 256, 512] {
        group.bench_with_input(BenchmarkId::from_parameter(size), &size, |b, &size| {
            b.iter(|| {
                let mut img = Image::new(size, size, solid_pixels(size, size));
                img.gaussian_blur(2.0, 0, 0, size, size, true);
                black_box(img.pixels_data().len());
            });
        });
    }
    group.finish();
}

fn bench_scale(c: &mut Criterion) {
    let mut group = c.benchmark_group("scale");
    for size in [256u32, 512, 1024] {
        group.bench_with_input(BenchmarkId::from_parameter(size), &size, |b, &size| {
            b.iter(|| {
                let mut img = Image::new(size, size, solid_pixels(size, size));
                img.scale(0.5);
                black_box((img.width(), img.height()));
            });
        });
    }
    group.finish();
}

criterion_group!(benches, bench_gaussian_blur, bench_scale);
criterion_main!(benches);
