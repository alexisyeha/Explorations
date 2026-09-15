import sys
from PIL import Image, ImageOps, ImageDraw, ImageFont, ImageChops

def process(src, dst, threshold=120):
    src_img = Image.open(src).convert("RGBA")
    alpha_channel = src_img.getchannel("A")
    lo, hi = alpha_channel.getextrema()
    opaque_mask = alpha_channel.point(lambda a: 255 if a > 128 else 0)
    opaque_fraction = sum(opaque_mask.getdata()) / 255 / (src_img.width * src_img.height)

    if hi - lo <= 20:
        # Fully opaque flat photo (e.g. white paper background) — derive
        # alpha from luminance across the whole frame.
        flat = src_img.convert("RGB")
        grey = ImageOps.autocontrast(ImageOps.grayscale(flat))
        alpha = grey.point(lambda p: 255 if p < threshold else 0)
    elif opaque_fraction > 0.35:
        # Alpha only marks a cutout region (e.g. a whole card rectangle) —
        # still need luminance thresholding *within* that region to isolate ink.
        flat = Image.new("RGB", src_img.size, (255, 255, 255))
        flat.paste(src_img, mask=alpha_channel)
        grey = ImageOps.autocontrast(ImageOps.grayscale(flat))
        alpha = grey.point(lambda p: 255 if p < threshold else 0)
        alpha = ImageChops.multiply(alpha, opaque_mask)
    else:
        # Alpha already isolates ink strokes (small opaque fraction) — keep as-is.
        alpha = opaque_mask

    black = Image.new("RGBA", src_img.size, (17, 17, 15, 0))
    black.putalpha(alpha)
    black.save(dst)
    print(f"{src} -> {dst} (threshold={threshold}, opaque_fraction={opaque_fraction:.2f})")

def render_digital_sans(dst, text, size=(900, 500), font_size=160):
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.truetype("/System/Library/Fonts/AppleSDGothicNeo.ttc", font_size, index=4)
    bbox = draw.textbbox((0, 0), text, font=font)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    pos = ((size[0] - w) / 2 - bbox[0], (size[1] - h) / 2 - bbox[1])
    draw.text(pos, text, font=font, fill=(17, 17, 15, 255))
    canvas.save(dst)
    print(f"generated -> {dst}")

if __name__ == "__main__":
    jobs = [
        ("assets/card4.png", "processed/card_baechu.png", 100),    # 배추씨만 — casual handwritten marker
        ("assets/cad2.png", "processed/card_sigolbapsang.png", 150),  # 시골밥상 — bold signage
        ("assets/card5.png", "processed/card_idiosyncratic.png", 100),  # loose personal cursive
        ("assets/card3.png", "processed/card_bluepen.png", 110),   # blue pen notebook cursive
    ]
    for src, dst, t in jobs:
        process(src, dst, t)
    render_digital_sans("processed/card_digital.png", "저장되었습니다")
