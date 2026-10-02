"""Kahden kuvat.cjs-hakemiston pikselivertailu.
   python3 scripts/perf-vertailu/vertaa.py <ennen> <jalkeen>
   Sarakkeet: keskiero (0-255), suurin ero, % pikseleista joissa ero > 3 ja > 12."""
import sys, os, numpy as np
from PIL import Image
a, b = sys.argv[1], sys.argv[2]
worst = []
for f in sorted(os.listdir(a)):
    pa, pb = os.path.join(a, f), os.path.join(b, f)
    if not os.path.exists(pb): print(f, 'PUUTTUU'); continue
    A = np.asarray(Image.open(pa).convert('RGB')).astype(np.int16); B = np.asarray(Image.open(pb).convert('RGB')).astype(np.int16)
    if A.shape != B.shape: print(f, 'eri koko', A.shape, B.shape); continue
    d = np.abs(A - B).max(axis=2)
    worst.append((d.mean(), f, d.max(), (d > 3).mean() * 100, (d > 12).mean() * 100))
    if len(sys.argv) > 3 and d.max() > 3:
        ys, xs = np.where(d > 3); print('   ', f, 'bbox>3: x', xs.min(), xs.max(), 'y', ys.min(), ys.max())
print('kuva        keskiero  max  %>3   %>12')
for m, f, mx, p3, p12 in sorted(worst, reverse=True)[:int(os.environ.get('N', 12))]: print(f'{f}  {m:6.3f}  {mx:3d}  {p3:5.2f}  {p12:5.2f}')
print('KAIKKI: keskiero %.3f, suurin max %d, kuvia joissa >3-pikseleita yli 0.1 %%: %d / %d' % (np.mean([w[0] for w in worst]), max(w[2] for w in worst), sum(1 for w in worst if w[3] > .1), len(worst)))
