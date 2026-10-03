"""Decode a rendered MP4 into labelled 3×3 contact sheets (every Nth frame)
plus side-by-side sheets of the frames on each side of every scene cut.
    python3 scripts/review-sheets.py out/mission-academy-intro.mp4 [step]
"""
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw

video = sys.argv[1]
step = int(sys.argv[2]) if len(sys.argv) > 2 else 10
out = Path('out/review')
out.mkdir(parents=True, exist_ok=True)
for f in out.glob('*.png'):
    f.unlink()

SCENES = [('s1', 0, 150), ('s2', 150, 210), ('s3', 360, 360), ('s4', 720, 300),
          ('s5', 1020, 270), ('s6', 1290, 240), ('s7', 1530, 150), ('s8', 1680, 120)]
W, H = 640, 360


def grab(frames):
    expr = '+'.join(f'eq(n\\,{f})' for f in frames)
    tmp = out / 'tmp'
    tmp.mkdir(exist_ok=True)
    for p in tmp.glob('*.png'):
        p.unlink()
    subprocess.run(['ffmpeg', '-v', 'error', '-i', video, '-vf', f"select='{expr}'", '-vsync', '0',
                    str(tmp / 'g_%04d.png')], check=True)
    return [Image.open(p).convert('RGB') for p in sorted(tmp.glob('g_*.png'))]


def sheet(name, frames, imgs, cols=3):
    rows = (len(imgs) + cols - 1) // cols
    s = Image.new('RGB', (W * cols, (H + 22) * rows), 'white')
    d = ImageDraw.Draw(s)
    for i, (f, im) in enumerate(zip(frames, imgs)):
        x, y = (i % cols) * W, (i // cols) * (H + 22)
        s.paste(im.resize((W, H)), (x, y + 22))
        sc = next(n for n, a, l in SCENES if a <= f < a + l)
        d.text((x + 6, y + 5), f'frame {f}  ({f / 30:.2f}s)  {sc} local {f - dict((n, a) for n, a, _ in SCENES)[sc]}', fill='black')
    s.save(out / name)


for name, start, length in SCENES:
    frames = list(range(start, start + length, step)) + [start + length - 1]
    frames = sorted(set(frames))
    for k in range(0, len(frames), 9):
        chunk = frames[k:k + 9]
        sheet(f'{name}-{k // 9 + 1:02d}.png', chunk, grab(chunk))

cuts = [a for _, a, _ in SCENES[1:]]
pairs = [f for c in cuts for f in (c - 1, c)]
sheet('cuts.png', pairs, grab(pairs), cols=2)
print('\n'.join(sorted(p.name for p in out.glob('*.png'))))
