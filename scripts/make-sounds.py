"""Generates the game's sound effects (soft, short, synthesized; no third-party audio).
Run: python3 scripts/make-sounds.py  -> assets/sounds/*.wav (22.05 kHz mono 16-bit)"""
import math, random, struct, wave, os

SR = 22050
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'sounds')

def env(i, n, a=0.01, r=0.08):
    t = i / SR; d = n / SR
    e = min(1.0, t / a) if a > 0 else 1.0
    if d - t < r: e *= max(0.0, (d - t) / r)
    return e

def write(name, samples, peak=0.32):
    m = max(1e-9, max(abs(s) for s in samples))
    k = peak / m
    with wave.open(os.path.join(OUT, name), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(b''.join(struct.pack('<h', int(max(-1, min(1, s * k)) * 32767)) for s in samples))

def tone(freq_fn, dur, shape=lambda p: math.sin(p), a=0.01, r=0.08, amp_fn=lambda t: 1.0):
    n = int(dur * SR); out = []; ph = 0.0
    for i in range(n):
        t = i / SR
        ph += 2 * math.pi * freq_fn(t) / SR
        out.append(shape(ph) * env(i, n, a, r) * amp_fn(t))
    return out

def mix(*parts):
    n = max(len(p) + o for p, o in parts); out = [0.0] * n
    for p, o in parts:
        for i, s in enumerate(p): out[o + i] += s
    return out

soft = lambda p: math.sin(p) + 0.18 * math.sin(2 * p) + 0.06 * math.sin(3 * p)
bell = lambda p: math.sin(p) + 0.35 * math.sin(2.01 * p) + 0.12 * math.sin(3.98 * p)
at = lambda s: int(s * SR)

# Robot starts: two gentle rising notes, "bi-dup".
start = mix(
    (tone(lambda t: 523 + 40 * t, 0.11, soft, 0.005, 0.05), 0),
    (tone(lambda t: 784 + 60 * t, 0.16, soft, 0.005, 0.10), at(0.09)),
)
write('start.wav', start, 0.17)

# Battery reached: shimmering charge-up sweep, then a bright arpeggio chime.
sweep = tone(lambda t: 260 + 700 * (t / 0.7) ** 1.6, 0.7, soft, 0.05, 0.12,
             lambda t: 0.55 + 0.45 * math.sin(2 * math.pi * (14 + 30 * t) * t))
notes = [1047, 1319, 1568, 2093]
chime = mix(*[(tone(lambda t, f=f: f, 0.55 if k < 3 else 0.9, bell, 0.004, 0.45 if k < 3 else 0.8,
                    lambda t: math.exp(-4.5 * t)), at(0.62 + 0.09 * k)) for k, f in enumerate(notes)])
write('win.wav', mix((sweep, 0), (chime, 0)), 0.26)

# Program ended without the battery: power winding down, then two tired low blips.
down = tone(lambda t: 520 * math.exp(-2.4 * t) + 70, 0.75, soft, 0.01, 0.25,
            lambda t: 0.7 + 0.3 * math.sin(2 * math.pi * (9 - 7 * t) * t))
blips = mix((tone(lambda t: 196, 0.12, soft, 0.005, 0.08), 0), (tone(lambda t: 147, 0.2, soft, 0.005, 0.15), at(0.18)))
write('fail.wav', mix((down, 0), (blips, at(0.78))), 0.2)

# Bump into a wall or the edge: a soft low thud with a tiny click.
random.seed(7)
thud = tone(lambda t: 150 * math.exp(-9 * t) + 55, 0.24, math.sin, 0.002, 0.16, lambda t: math.exp(-11 * t))
click = [random.uniform(-1, 1) * math.exp(-i / (SR * 0.006)) * 0.25 for i in range(at(0.03))]
write('bump.wav', mix((thud, 0), (click, 0)), 0.24)
print('ok', sorted(os.listdir(OUT)))
