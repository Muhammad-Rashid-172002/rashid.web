"""
Turn raw phone screenshots into clean, store-style screens for the portfolio mockups.

For every screenshot of a phone project it:
  1. removes the device's own status bar (notification icons, VoLTE, data speed…)
  2. removes the black Android navigation bar at the bottom, if present
  3. adds a clean status bar ("9:41", signal, Wi-Fi, battery) coloured to match the screen
and writes <name>-store.webp next to the original. Originals are never modified.

Usage (needs Pillow):  python3 scripts/polish-screenshots.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent / "public" / "image" / "projects"

# folder -> (source extension, strip existing status bar?, strip Android nav bar?)
PROJECTS = {
    "AI Fitness Calorie Tracking App": (".jpeg", True, True),
    "skillLink": (".png", True, False),
    "IETLS": (".png", False, False),
    "stacked": (".png", True, False),
}
# Files where auto-detection misreads the status bar: crop height as a fraction of width.
STATUS_OVERRIDES = {"live_tracking.png": 0.095}
MAX_WIDTH = 1000
FONT_PATH = "/System/Library/Fonts/SFNS.ttf"


def lum(px):
    r, g, b = px[:3]
    return 0.299 * r + 0.587 * g + 0.114 * b


def row_busy(img, y, ref):
    """Count pixels on row y that clearly differ from the reference background colour."""
    w = img.width
    step = max(1, w // 300)
    return sum(1 for x in range(0, w, step) if abs(lum(img.getpixel((x, y))) - ref) > 45)


def status_bar_bottom(img):
    """Find where the device status bar ends: the first band of icons near the top, then its gap."""
    w = img.width
    limit = int(w * 0.14)
    ref = lum(img.getpixel((w // 2, 2)))
    busy = [row_busy(img, y, ref) > 1 for y in range(limit)]
    try:
        start = busy.index(True)
    except ValueError:
        return int(w * 0.06)
    end = start
    while end < limit - 3 and any(busy[end:end + 3]):
        end += 1
    if end - start > w * 0.09:  # icons merged into app content: fall back to a typical height
        return int(w * 0.075)
    # cut in the middle of the gap that follows the icons (keeps breathing room above content)
    gap_end = end
    while gap_end < limit and not busy[gap_end]:
        gap_end += 1
    return min(end + (gap_end - end) // 2, end + int(w * 0.02))


def nav_bar_top(img):
    """Find the top of a solid-black Android navigation bar, or return the full height."""
    h, w = img.height, img.width
    y = h - 1
    step = max(1, w // 200)
    while y > h * 0.85:
        dark = sum(1 for x in range(0, w, step) if lum(img.getpixel((x, y))) < 10)
        # icons on the bar (square / circle / triangle) cover up to ~20% of a row
        if dark / len(range(0, w, step)) < 0.72:
            break
        y -= 1
    return y + 1 if (h - y) > h * 0.025 else h


def draw_status_bar(strip, w):
    d = ImageDraw.Draw(strip)
    h = strip.height
    avg = strip.resize((1, 1)).getpixel((0, 0))
    fg = (255, 255, 255) if lum(avg) < 150 else (17, 17, 20)
    bg = avg[:3]
    cy = int(h * 0.56)

    font = ImageFont.truetype(FONT_PATH, int(w * 0.045))
    try:
        font.set_variation_by_name("Semibold")
    except Exception:
        pass
    d.text((int(w * 0.1), cy), "9:41", fill=fg, font=font, anchor="lm")

    # battery
    bw, bh = int(w * 0.068), int(w * 0.032)
    bx = w - int(w * 0.075) - bw
    d.rounded_rectangle([bx, cy - bh // 2, bx + bw, cy + bh // 2], radius=bh // 3, outline=fg, width=max(1, w // 400))
    pad = max(2, w // 300)
    d.rounded_rectangle([bx + pad, cy - bh // 2 + pad, bx + int(bw * 0.8), cy + bh // 2 - pad], radius=bh // 5, fill=fg)
    d.rounded_rectangle([bx + bw + pad // 2, cy - bh // 6, bx + bw + pad * 2, cy + bh // 6], radius=1, fill=fg)

    # wifi (concentric wedges)
    wx = bx - int(w * 0.055)
    wy = cy + int(w * 0.013)
    r = int(w * 0.026)
    for i, rr in enumerate([r, int(r * 0.78), int(r * 0.56), int(r * 0.34)]):
        colour = fg if i % 2 == 0 else bg
        d.pieslice([wx - rr, wy - rr, wx + rr, wy + rr], 225, 315, fill=colour)
    d.pieslice([wx - int(r * .2), wy - int(r * .2), wx + int(r * .2), wy + int(r * .2)], 225, 315, fill=fg)

    # signal bars
    sx = wx - int(w * 0.095)
    bar_w = int(w * 0.0085)
    gap = int(w * 0.0045)
    for i in range(4):
        bar_h = int(w * 0.009 * (i + 1.4))
        x0 = sx + i * (bar_w + gap)
        d.rounded_rectangle([x0, cy + int(w * 0.014) - bar_h, x0 + bar_w, cy + int(w * 0.014)], radius=1, fill=fg)


def polish(src: Path, strip_status: bool, strip_nav: bool) -> Path:
    img = Image.open(src).convert("RGB")
    if img.width > MAX_WIDTH:
        img = img.resize((MAX_WIDTH, round(img.height * MAX_WIDTH / img.width)), Image.LANCZOS)
    w = img.width
    if src.name in STATUS_OVERRIDES:
        top = int(w * STATUS_OVERRIDES[src.name])
    else:
        top = status_bar_bottom(img) if strip_status else 0
    bottom = nav_bar_top(img) if strip_nav else img.height
    body = img.crop((0, top, w, bottom))

    strip_h = int(w * 0.12)
    first_row = body.crop((0, 0, w, 1))
    step = max(1, w // 200)
    values = [lum(first_row.getpixel((x, 0))) for x in range(0, w, step)]
    smooth = max(abs(a - b) for a, b in zip(values, values[1:])) < 10
    if smooth:
        # Plain or gradient background: stretch the first row upwards so it continues seamlessly.
        strip = first_row.resize((w, strip_h))
    else:
        # Screenshot starts mid-content: use the dominant colour of the top rows instead of stripes.
        colours = body.crop((0, 0, w, 6)).getcolors(w * 6) or []
        strip = Image.new("RGB", (w, strip_h), max(colours)[1] if colours else (0, 0, 0))
    draw_status_bar(strip, w)

    out = Image.new("RGB", (w, strip_h + body.height))
    out.paste(strip, (0, 0))
    out.paste(body, (0, strip_h))
    dest = src.with_name(f"{src.stem}-store.webp")
    out.save(dest, "WEBP", quality=84, method=6)
    print(f"{src.parent.name}/{src.name}: cut top {top}px, bottom {img.height - bottom}px -> {dest.name} {out.size}")
    return dest


if __name__ == "__main__":
    for folder, (ext, strip_status, strip_nav) in PROJECTS.items():
        for src in sorted((ROOT / folder).glob(f"*{ext}")):
            if src.stem.endswith("-store"):
                continue
            with Image.open(src) as probe:
                if probe.width > probe.height:  # landscape artwork, not a phone screen
                    continue
            polish(src, strip_status, strip_nav)
