"""Turn the supplied logo JPG into a transparent PNG without redrawing it.

Only the white background (and the light halftone dots that sit outside the
mark) are removed. Pixel colors inside the mark are un-premultiplied from the
original JPEG, so the mark keeps its exact shape and colors.
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

root = Path(__file__).resolve().parent.parent
src = Image.open(root / 'public/brand/logo-source.jpg').convert('RGB')
im = np.asarray(src).astype(np.float64)
R, G, B = im[..., 0], im[..., 1], im[..., 2]

# The mark is saturated blue; the background and dots are neutral.
mark = (B - R) > 40
labels, count = ndimage.label(mark)
sizes = ndimage.sum(mark, labels, range(1, count + 1))
keep = np.argsort(sizes)[::-1][:3] + 1
mask = np.isin(labels, keep)
mask = ndimage.binary_dilation(mask, iterations=3)

# Composite model: pixel = a * color + (1 - a) * white. Both brand blues have
# red ~0, so the red channel gives alpha directly.
alpha = np.clip((255.0 - R) / 255.0, 0, 1) * mask
safe = np.maximum(alpha, 1e-3)[..., None]
color = np.clip((im - (1 - alpha[..., None]) * 255.0) / safe, 0, 255)

bars = []
for i in keep:
    ys, xs = ndimage.find_objects((labels == i).astype(int))[0]
    core = ndimage.binary_erosion(labels == i, iterations=4)
    c = im[core].mean(axis=0)
    bars.append({'x0': xs.start, 'x1': xs.stop, 'y0': ys.start, 'y1': ys.stop,
                 'color': '#%02X%02X%02X' % tuple(int(round(v)) for v in c)})
bars.sort(key=lambda b: b['x0'])

pad = 4
x0 = min(b['x0'] for b in bars) - pad
x1 = max(b['x1'] for b in bars) + pad
y0 = min(b['y0'] for b in bars) - pad
y1 = max(b['y1'] for b in bars) + pad

rgba = np.dstack([color, alpha * 255.0]).astype(np.uint8)[y0:y1, x0:x1]
out = Image.fromarray(rgba, 'RGBA')
out.save(root / 'public/brand/logo-mark.png')
# 3x Lanczos upscale (premultiplied) for crisp display above native size.
big = out.convert('RGBa').resize((out.width * 3, out.height * 3), Image.LANCZOS).convert('RGBA')
big.save(root / 'public/brand/logo-mark@3x.png')

w, h = x1 - x0, y1 - y0
meta = {
    'width': w,
    'height': h,
    'bars': [
        {'left': (b['x0'] - x0) / w, 'right': (b['x1'] - x0) / w,
         'top': (b['y0'] - y0) / h, 'bottom': (b['y1'] - y0) / h,
         'color': b['color']}
        for b in bars
    ],
}
(root / 'src/config/logo.generated.json').write_text(json.dumps(meta, indent=2) + '\n')
print(json.dumps(meta, indent=2))
