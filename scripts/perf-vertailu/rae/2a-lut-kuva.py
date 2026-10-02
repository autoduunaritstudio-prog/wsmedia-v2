"""Tekee lut.png:n: 16 riviä (alfa 1..16) x 256 saraketta (harmaa 0..255).
   RAE_DIR=<tyohakemisto> python3 2a-lut-kuva.py"""
import os, numpy as np
from PIL import Image
D = os.environ.get("RAE_DIR", os.path.join(os.path.dirname(__file__), "tyo"))
os.makedirs(D, exist_ok=True)
im = np.zeros((16, 256, 4), np.uint8)
for k in range(16):
    for c in range(256):
        im[k, c] = (c, c, c, k + 1)
Image.fromarray(im, "RGBA").save(os.path.join(D, "lut.png"))
