"""Generates the game's sheep sound effects (synthesized; no third-party audio).
Run: python3 scripts/make-sounds.py  -> assets/sounds/*.wav (22.05 kHz mono 16-bit)

A bleat is a buzzy voice (sawtooth-like pulse) with the fast "warble" that makes it sound like a
sheep (amplitude and pitch shaking ~25 times a second), shaped by three vowel formants ("meh").
  start  one short, bright "meh!"            the flock sets off
  win    three happy bleats and a sheep bell the whole flock is in the barn
  fail   one long, falling "meeeh"           some sheep can never reach the barn
  bump   a soft hoof thud and a tiny "mh"    a sheep walks into a fence
"""
import os
import wave

import numpy as np
from scipy.signal import butter, lfilter

SR = 22050
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'sounds')
rng = np.random.default_rng(7)


def envelope(n, attack=0.03, release=0.12):
    e = np.ones(n)
    a = min(n, int(attack * SR))
    r = min(n, int(release * SR))
    e[:a] = np.linspace(0, 1, a) ** 1.5
    e[n - r:] *= np.linspace(1, 0, r) ** 1.5
    return e


def formant(x, f, q):
    bw = f / q
    b, a = butter(2, [max(60, f - bw / 2) / (SR / 2), min(SR / 2 - 100, f + bw / 2) / (SR / 2)], btype='band')
    return lfilter(b, a, x)


def bleat(dur, f_start, f_end, warble=26.0, depth=0.55, vowel=(650, 1750, 2600), breath=0.04):
    n = int(dur * SR)
    t = np.arange(n) / SR
    glide = f_start + (f_end - f_start) * (t / dur) ** 0.8
    wob = 1 + 0.035 * np.sin(2 * np.pi * warble * t + rng.uniform(0, 6))
    jitter = 1 + 0.01 * np.cumsum(rng.normal(0, 1, n)) / np.sqrt(np.arange(1, n + 1))
    f = glide * wob * jitter
    phase = 2 * np.pi * np.cumsum(f) / SR
    src = sum(np.sin(k * phase) / k ** 0.9 for k in range(1, 14))
    src += breath * rng.normal(0, 1, n)
    trem = 1 - depth * (0.5 + 0.5 * np.sin(2 * np.pi * warble * t))
    voiced = src * trem
    out = formant(voiced, vowel[0], 5) * 1.0 + formant(voiced, vowel[1], 8) * 0.6 + formant(voiced, vowel[2], 10) * 0.3
    # "m" at the start: muffled for the first few hundredths of a second
    m = np.clip(t / 0.06, 0, 1)
    out = out * (0.35 + 0.65 * m)
    return out * envelope(n)


def bell(dur, f0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    partials = [(1.0, 1.0, 3.5), (2.76, 0.45, 5), (5.4, 0.25, 7), (8.9, 0.12, 9)]
    s = sum(a * np.sin(2 * np.pi * f0 * r * t) * np.exp(-d * t) for r, a, d in partials)
    return s * envelope(n, 0.002, 0.05)


def thud(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    body = np.sin(2 * np.pi * (140 * np.exp(-t * 9)) * t) * np.exp(-t * 22)
    tap = lfilter(*butter(2, 900 / (SR / 2)), rng.normal(0, 1, n)) * np.exp(-t * 60) * 0.5
    return (body + tap) * envelope(n, 0.002, 0.03)


def mix(parts):
    n = max(len(p) + int(o * SR) for p, o in parts)
    out = np.zeros(n)
    for p, o in parts:
        i = int(o * SR)
        out[i:i + len(p)] += p
    return out


def write(name, x, peak):
    x = x / max(1e-9, np.max(np.abs(x))) * peak
    with wave.open(os.path.join(OUT, name), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())


write('start.wav', bleat(0.42, 540, 600, warble=27, vowel=(700, 1850, 2700)), 0.2)
write('win.wav', mix([
    (bleat(0.5, 470, 520), 0.0),
    (bleat(0.45, 600, 660, warble=29, vowel=(720, 1900, 2750)), 0.22),
    (bleat(0.55, 720, 780, warble=31, vowel=(760, 2000, 2850)), 0.45),
    (bell(1.1, 1180) * 0.35, 0.3),
    (bell(0.9, 1180) * 0.25, 0.75),
]), 0.26)
write('fail.wav', bleat(0.95, 470, 320, warble=21, depth=0.65, vowel=(600, 1600, 2500)), 0.2)
write('bump.wav', mix([(thud(0.18), 0.0), (bleat(0.16, 620, 560, warble=30, depth=0.4) * 0.45, 0.05)]), 0.22)
print('ok')
