"""
Generate App Store–style promo images for FitMind AI from the cleaned screenshots.

Each poster: branded dark-green background, badge, two-line headline (second line in a green
gradient), subtitle, the screen inside a rendered iPhone that bleeds off the bottom, and a
zoomed "callout" of the key UI element floating over the phone.

Input : public/image/projects/AI Fitness Calorie Tracking App/<n>-store.webp
        (made by scripts/polish-screenshots.py)
Output: public/image/projects/AI Fitness Calorie Tracking App/showcase/NN-<slug>.webp

Usage (needs Pillow):  python3 scripts/make-fitmind-showcase.py
"""
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent / "public" / "image" / "projects" / "AI Fitness Calorie Tracking App"
OUT = ROOT / "showcase"
FONT = "/System/Library/Fonts/SFNS.ttf"

W, H = 1290, 2796            # App Store 6.7" portrait
EXPORT_W = 1080              # web export size (keeps files small)
GREEN = (34, 197, 94)
GREEN_2 = (110, 231, 183)

# file, slug, headline line 1, headline line 2 (accent), subtitle, callout box (in -store px) or None, callout side
POSTERS = [
    ("1", "dashboard", "Your day,", "perfectly balanced.", "Calories, macros and energy status on one smart dashboard.", (30, 870, 672, 1125), "right"),
    ("5", "ai-scanner", "Snap a meal.", "AI does the rest.", "Point your camera and FitMind logs calories in seconds.", (40, 322, 662, 836), "left"),
    ("6", "food-recognition", "Real-time", "food recognition.", "Gemini-powered vision detects every item on your plate.", None, "right"),
    ("7", "macros", "Every macro,", "decoded.", "Protein, carbs and fat with instant AI feedback on each meal.", (50, 660, 652, 950), "left"),
    ("2", "ai-coach", "An AI coach", "that knows you.", "Personalised meal suggestions and weekly feedback.", (34, 400, 650, 640), "right"),
    ("3", "weekly-progress", "Progress you can", "actually see.", "A weekly health score and weight trends at a glance.", (30, 340, 670, 700), "left"),
    ("4", "goal-weight", "Hit your", "goal weight.", "Every kilo toward your target, plus body-fat trends.", (30, 322, 672, 756), "right"),
    ("9", "on-track", "Always know", "you're on track.", "Smart goal dates and weekly calorie insights.", (60, 322, 652, 578), "left"),
]


def font(size, weight="Bold"):
    f = ImageFont.truetype(FONT, size)
    f.set_variation_by_name(weight)
    return f


def rounded_mask(size, radius):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius=radius, fill=255)
    return m


def background():
    bg = Image.new("RGB", (W, H), (5, 12, 9))
    # vertical gradient
    grad = Image.linear_gradient("L").resize((W, H))
    top = Image.new("RGB", (W, H), (8, 22, 15))
    bottom = Image.new("RGB", (W, H), (3, 6, 8))
    bg = Image.composite(bottom, top, grad)
    # glows
    glow = Image.new("RGB", (W, H), (0, 0, 0))
    d = ImageDraw.Draw(glow)
    d.ellipse([W // 2 - 620, 1250, W // 2 + 620, 2650], fill=(20, 110, 55))
    d.ellipse([W - 420, -200, W + 380, 600], fill=(10, 70, 80))
    glow = glow.filter(ImageFilter.GaussianBlur(220))
    bg = ImageChops.add(bg, glow)
    # faint dot grid
    dots = ImageDraw.Draw(bg)
    for y in range(40, H, 56):
        for x in range(40, W, 56):
            dots.point((x, y), fill=(28, 48, 38))
    return bg


def gradient_text(text, fnt, colors):
    bbox = fnt.getbbox(text)
    w, h = bbox[2], bbox[3] + 10
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).text((0, 0), text, font=fnt, fill=255)
    grad = Image.linear_gradient("L").rotate(90, expand=True).resize((w, h))
    fill = Image.composite(Image.new("RGB", (w, h), colors[1]), Image.new("RGB", (w, h), colors[0]), grad)
    layer = Image.new("RGBA", (w, h))
    layer.paste(fill, (0, 0), mask)
    return layer


def wrap(draw, text, fnt, max_w):
    words, lines, cur = text.split(), [], ""
    for word in words:
        test = f"{cur} {word}".strip()
        if draw.textlength(test, font=fnt) <= max_w:
            cur = test
        else:
            lines.append(cur)
            cur = word
    lines.append(cur)
    return lines


def phone(screen):
    pw, ph = 860, int(860 * 19.5 / 9)
    pad, radius = 24, 150
    body = Image.new("RGBA", (pw, ph), (0, 0, 0, 0))
    grad = Image.linear_gradient("L").rotate(45, expand=True).resize((pw, ph))
    metal = Image.composite(Image.new("RGB", (pw, ph), (12, 13, 16)), Image.new("RGB", (pw, ph), (58, 62, 70)), grad)
    body.paste(metal, (0, 0), rounded_mask((pw, ph), radius))
    d = ImageDraw.Draw(body)
    d.rounded_rectangle([3, 3, pw - 4, ph - 4], radius=radius - 3, outline=(90, 95, 105), width=2)
    d.rounded_rectangle([12, 12, pw - 13, ph - 13], radius=radius - 12, fill=(3, 4, 6))
    sw, sh = pw - pad * 2, ph - pad * 2
    scr = screen.convert("RGB")
    scale = sw / scr.width
    scr = scr.resize((sw, int(scr.height * scale)), Image.LANCZOS)
    if scr.height < sh:  # extend with the bottom colour so the screen is always full
        ext = Image.new("RGB", (sw, sh), scr.getpixel((sw // 2, scr.height - 1)))
        ext.paste(scr, (0, 0))
        scr = ext
    scr = scr.crop((0, 0, sw, sh))
    body.paste(scr, (pad, pad), rounded_mask((sw, sh), radius - pad))
    # dynamic island
    d.rounded_rectangle([pw // 2 - 115, pad + 26, pw // 2 + 115, pad + 90], radius=32, fill=(0, 0, 0))
    return body, scale, pad


def shadow(size, radius, blur, color=(0, 0, 0, 170), spread=0):
    w, h = size
    s = Image.new("RGBA", (w + blur * 4, h + blur * 4), (0, 0, 0, 0))
    ImageDraw.Draw(s).rounded_rectangle([blur * 2 - spread, blur * 2 - spread, blur * 2 + w + spread, blur * 2 + h + spread], radius=radius, fill=color)
    return s.filter(ImageFilter.GaussianBlur(blur))


def make(file, slug, l1, l2, sub, box, side, index):
    screen = Image.open(ROOT / f"{file}-store.webp").convert("RGB")
    canvas = background().convert("RGBA")
    d = ImageDraw.Draw(canvas)

    # badge
    bf = font(34, "Semibold")
    label = "FITMIND AI"
    tw = d.textlength(label, font=bf) + 6 * len(label)
    bx0 = W // 2 - (tw + 110) // 2
    d.rounded_rectangle([bx0, 150, bx0 + tw + 110, 226], radius=38, fill=(16, 52, 32), outline=(40, 120, 70), width=2)
    d.ellipse([bx0 + 34, 178, bx0 + 54, 198], fill=GREEN)
    x = bx0 + 76
    for ch in label:
        d.text((x, 188), ch, font=bf, fill=GREEN_2, anchor="lm")
        x += d.textlength(ch, font=bf) + 6

    # headline
    hf = font(118, "Bold")
    d.text((W // 2, 360), l1, font=hf, fill=(245, 247, 246), anchor="mm")
    accent = gradient_text(l2, hf, (GREEN_2, GREEN))
    canvas.alpha_composite(accent, (W // 2 - accent.width // 2, 420))

    # subtitle
    sf = font(46, "Regular")
    for i, line in enumerate(wrap(d, sub, sf, 1020)):
        d.text((W // 2, 640 + i * 64), line, font=sf, fill=(160, 170, 165), anchor="mm")

    # phone
    ph_img, scale, pad = phone(screen)
    px, py = (W - ph_img.width) // 2, 860
    glow = shadow(ph_img.size, 150, 90, color=(34, 197, 94, 70), spread=10)
    canvas.alpha_composite(glow, (px - 180, py - 180 + 60))
    sh = shadow(ph_img.size, 150, 60, color=(0, 0, 0, 200))
    canvas.alpha_composite(sh, (px - 120, py - 120 + 50))
    canvas.alpha_composite(ph_img, (px, py))

    # callout: the key UI element, enlarged and floating over the phone edge
    if box:
        crop = screen.crop(box)
        cs = scale * 1.16
        cw, ch_ = int(crop.width * cs), int(crop.height * cs)
        crop = crop.resize((cw, ch_), Image.LANCZOS)
        radius = 44
        card = Image.new("RGBA", (cw + 8, ch_ + 8), (0, 0, 0, 0))
        cd = ImageDraw.Draw(card)
        cd.rounded_rectangle([0, 0, cw + 7, ch_ + 7], radius=radius + 4, fill=(60, 180, 110, 255))
        card.paste(crop, (4, 4), rounded_mask((cw, ch_), radius))
        tilt = -3 if side == "left" else 3
        card = card.rotate(tilt, resample=Image.BICUBIC, expand=True)
        cy = py + pad + int(box[1] * scale) - int((ch_ - (box[3] - box[1]) * scale) / 2)
        cy = max(py + 140, min(cy, H - card.height - 140))
        cx = (W - card.width) // 2 + (-70 if side == "left" else 70)
        csh = shadow(card.size, radius, 50, color=(0, 0, 0, 190))
        canvas.alpha_composite(csh, (cx - 100, cy - 100 + 40))
        canvas.alpha_composite(card, (cx, cy))

    OUT.mkdir(exist_ok=True)
    out = canvas.convert("RGB").resize((EXPORT_W, int(H * EXPORT_W / W)), Image.LANCZOS)
    dest = OUT / f"{index:02d}-{slug}.webp"
    out.save(dest, "WEBP", quality=86, method=6)
    print(dest.name, out.size, f"{dest.stat().st_size // 1024} KB")


if __name__ == "__main__":
    for i, spec in enumerate(POSTERS, start=1):
        make(*spec, index=i)
