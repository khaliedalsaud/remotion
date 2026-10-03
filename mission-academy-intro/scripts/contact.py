"""Tile frames into a labelled contact sheet: contact.py out.png a.png b.png ..."""
import re
import sys

from PIL import Image, ImageDraw

out, files = sys.argv[1], sys.argv[2:]
W, H, cols = 640, 360, 3
rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (W * cols, (H + 24) * rows), 'white')
draw = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    x, y = (i % cols) * W, (i // cols) * (H + 24)
    sheet.paste(Image.open(f).convert('RGB').resize((W, H)), (x, y + 24))
    m = re.search(r'-(\d+)\.png$', f)
    draw.text((x + 8, y + 6), f'frame {m.group(1) if m else f}', fill='black')
sheet.save(out)
