# Draws the app icon, splash image and favicon: three sheep heading to a lit barn on a night meadow.
# Run: python3 scripts/make-icons.py
from PIL import Image, ImageDraw, ImageFilter
import math

NIGHT = (18, 33, 58)
MEADOW = (31, 64, 54)
WOOL = (246, 241, 228)
FACE = (58, 50, 66)
LANTERN = (244, 186, 78)
BARN = (201, 74, 60)
BARN_DARK = (143, 47, 39)
WOOD = (167, 122, 76)

def sheep(d, cx, cy, r, ang):
    """Top-down sheep facing angle `ang` (radians, 0 = right)."""
    ca, sa = math.cos(ang), math.sin(ang)
    P = lambda x, y: (cx + (x * ca - y * sa) * r, cy + (x * sa + y * ca) * r)
    shadow = [(-.10, -.13), (.07, -.15), (-.20, .03), (.04, .0), (-.08, .14), (.09, .13), (-.22, -.10), (-.20, .15)]
    for x, y in shadow:
        px, py = P(x + .03, y + .06)
        d.ellipse([px - .14 * r, py - .14 * r, px + .14 * r, py + .14 * r], fill=(0, 0, 0, 38))
    for x, y in shadow:
        px, py = P(x, y)
        d.ellipse([px - .135 * r, py - .135 * r, px + .135 * r, py + .135 * r], fill=WOOL)
    for ex, ey in [(.17, -.1), (.17, .1)]:
        px, py = P(ex, ey)
        d.ellipse([px - .055 * r, py - .055 * r, px + .055 * r, py + .055 * r], fill=FACE)
    px, py = P(.24, 0)
    d.ellipse([px - .1 * r, py - .1 * r, px + .1 * r, py + .1 * r], fill=FACE)
    for ey in (-.035, .035):
        px, py = P(.28, ey)
        d.ellipse([px - .02 * r, py - .02 * r, px + .02 * r, py + .02 * r], fill=(255, 255, 255))

def scene(size, bg=True):
    S = size * 2
    im = Image.new('RGBA', (S, S), NIGHT + (255,) if bg else (0, 0, 0, 0))
    d = ImageDraw.Draw(im, 'RGBA')
    if bg:
        d.rectangle([0, 0, S, S], fill=MEADOW)
    # barn glow
    glow = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gx, gy = S * .70, S * .30
    gd.ellipse([gx - S * .26, gy - S * .26, gx + S * .26, gy + S * .26], fill=LANTERN + (90,))
    im.alpha_composite(glow.filter(ImageFilter.GaussianBlur(S * .06)))
    # barn
    b = S * .2
    d.rounded_rectangle([gx - b / 2, gy - b / 2 + S * .012, gx + b / 2, gy + b / 2 + S * .012], radius=S * .025, fill=BARN_DARK)
    d.rounded_rectangle([gx - b / 2, gy - b / 2, gx + b / 2, gy + b / 2], radius=S * .025, fill=BARN)
    w = int(S * .012)
    d.rectangle([gx - b * .3, gy - b * .3, gx + b * .3, gy + b * .3], outline=WOOL, width=w)
    d.line([gx - b * .3, gy - b * .3, gx + b * .3, gy + b * .3], fill=WOOL, width=w)
    d.line([gx + b * .3, gy - b * .3, gx - b * .3, gy + b * .3], fill=WOOL, width=w)
    # flock heading to the barn (up and right)
    ang = math.atan2(gy - S * .66, gx - S * .34)
    for cx, cy, r in [(.30, .70, .34), (.52, .62, .30), (.30, .44, .28)]:
        sheep(d, S * cx, S * cy, S * r, ang)
    return im.resize((size, size), Image.LANCZOS)

scene(1024).convert('RGB').save('assets/icon.png')
scene(1024, bg=False).save('assets/splash-icon.png')
scene(48).save('assets/favicon.png')
print('ok')
