"""Generates a subtle, tileable paper-grain texture (near-white, for multiply)."""
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

rng = np.random.default_rng(7)
size = 512
fine = rng.normal(0, 1, (size, size))
fibers = ndimage.gaussian_filter(rng.normal(0, 1, (size, size)), sigma=(0.6, 3.5), mode='wrap')
blotch = ndimage.gaussian_filter(rng.normal(0, 1, (size, size)), sigma=40, mode='wrap')
tex = 0.55 * fine / fine.std() + 0.9 * fibers / fibers.std() + 0.6 * blotch / blotch.std()
tex = (tex - tex.min()) / (tex.max() - tex.min())
img = (255 - tex * 26).clip(0, 255).astype(np.uint8)
out = Path(__file__).resolve().parent.parent / 'public/textures/paper.png'
Image.fromarray(img, 'L').save(out)
print('paper texture', out)
