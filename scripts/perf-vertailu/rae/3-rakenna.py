"""Rakentaa rae-kuvat (1x ja 2x) kalibrointikuvista.

Jokaiselle pikselille haetaan vari ja alfa, joka tavallisella paallepiirrolla
antaa pohjavarin paalla TASAN saman tuloksen kuin alkuperainen soft-light-rae.
lut.npy on 2-lut.cjs:n mittaus siita, minka arvon Chrome tuottaa kullakin
(alfa, vari) -parilla taman pohjavarin paalla.

  RAE_DIR=<tyohakemisto> python3 3-rakenna.py <pohjavari heksana, esim. 0b0f14>
Tulos: rae-<pohja>-1x.png ja -2x.png, kopioidaan kansioon public/rae/.
"""
import os, sys, numpy as np
from PIL import Image
D = os.environ.get("RAE_DIR", os.path.join(os.path.dirname(__file__), "tyo"))
nimi = sys.argv[1] if len(sys.argv) > 1 else "0b0f14"
Bg = np.array([int(nimi[i:i + 2], 16) for i in (0, 2, 4)])
O = np.asarray(Image.open(os.path.join(D, "lut-out.png")).convert("RGB")).astype(int)

def keski(k, ch, dl):
    cs = np.where(O[k - 1, :, ch] == Bg[ch] + dl)[0]
    return None if len(cs) == 0 else int((cs.min() + cs.max()) // 2)

for dpr in (1, 2):
    A = np.asarray(Image.open(os.path.join(D, f"alkup-{dpr}x.png")).convert("RGB")).astype(int)
    P = np.asarray(Image.open(os.path.join(D, f"pohja-{dpr}x.png")).convert("RGB")).astype(int)
    T = 180 * dpr
    d = (A - P)[:T, :T]
    assert d.min() >= 0, "rae tummentaa pohjaa: tata ei voi toistaa vaalentavalla kuvalla"
    out = np.zeros((T, T, 4), np.uint8)
    for cmb in {tuple(c) for c in d.reshape(-1, 3)}:
        if max(cmb) == 0:
            continue
        for k in range(1, 17):
            cs = [keski(k, ch, cmb[ch]) for ch in range(3)]
            if all(c is not None for c in cs):
                out[(d == np.array(cmb)).all(axis=2)] = (cs[0], cs[1], cs[2], k)
                break
        else:
            raise SystemExit(f"ei ratkaisua yhdistelmalle {cmb}")
    # Haviton paletti: vareja on alle kymmenen.
    cols = np.unique(out.reshape(-1, 4), axis=0)
    idx = np.zeros(out.shape[:2], np.uint8)
    for i, c in enumerate(cols):
        idx[(out == c).all(axis=2)] = i
    p = Image.fromarray(idx, "P")
    p.putpalette([int(v) for c in cols for v in c[:3]])
    kohde = os.path.join(D, f"rae-{nimi}-{dpr}x.png")
    p.save(kohde, optimize=True, transparency=bytes(int(c[3]) for c in cols))
    print(kohde, os.path.getsize(kohde), "tavua,", len(cols), "varia")
