"""Synthesises the intro soundtrack (stdlib only). 120 BPM, 18 s. Run from film/."""
import array, math, random, wave

SR = 44100
N = SR * 18
buf = [0.0] * N
random.seed(4)


def add(t, dur, fn, g=1.0):
    s = int(t * SR)
    for i in range(int(dur * SR)):
        if 0 <= s + i < N:
            buf[s + i] += g * fn(i / SR)


def kick(t, g=.8):
    add(t, .35, lambda x: math.sin(2 * math.pi * (45 * x + 9 * (1 - math.exp(-x * 28)))) * math.exp(-x * 9), g)


def tick(t, g=.12):
    add(t, .04, lambda x: random.uniform(-1, 1) * math.exp(-x * 140), g)


def boom(t, g=.9):
    add(t, 2.2, lambda x: (math.sin(2 * math.pi * 38 * x) + .4 * math.sin(2 * math.pi * 76 * x)) * math.exp(-x * 2)
        + random.uniform(-.4, .4) * math.exp(-x * 14), g * .6)


def pad(t, d, fs, g):
    for f in fs:
        add(t, d, lambda x, f=f: (math.sin(2 * math.pi * f * x) + .35 * math.sin(2 * math.pi * f * 2.003 * x))
            * min(1, x / .4) * min(1, max(0, (d - x) / .5)), g)


def bass(t, f, g=.22):
    add(t, .24, lambda x: math.tanh(2.2 * math.sin(2 * math.pi * f * x)) * math.exp(-x * 6), g)


t = 0  # SCROLL: ticks accelerate into silence
while t < 2.45:
    tick(t, .2)
    t += max(.045, .16 - .05 * t)
add(0, 2.5, lambda x: random.uniform(-1, 1) * (x / 2.5) ** 3, .11)
boom(2.5)  # STOP
boom(4.0, .7)  # SCALE
for i in range(22):
    b = 4 + i * .5
    kick(b)
    tick(b + .25, .2)
    tick(b + .375, .1)
    r = [55, 55, 65.4, 49][int((b - 4) // 2) % 4]
    bass(b + .25, r)
    bass(b + .375, r * 2, .12)
for i, ch in enumerate([(220, 261.6, 329.6), (220, 277.2, 329.6), (261.6, 329.6, 392), (196, 246.9, 293.7)] * 2):
    if 4 + i * 2 < 15:
        pad(4 + i * 2, 2.2, ch, .03)
boom(15, .9)
pad(15, 3, (110, 220, 277.2, 329.6, 440), .05)

m = max(abs(x) for x in buf)
with wave.open('public/music.wav', 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(array.array('h', [int(math.tanh(x / m * 1.3) * 27000) for x in buf]).tobytes())
