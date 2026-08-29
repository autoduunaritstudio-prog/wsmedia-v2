#!/usr/bin/env python3
"""Faviconien generointi public/Logo/wsmedia-mark.svg:sta.

Kertakayttoinen tyokalu. EI package.jsonin scripts-lohkossa: tama ei ole
osa buildia vaan ajetaan kasin jos merkki tai parametrit muuttuvat.

    python3 scripts/gen-favicons.py

Kirjoittaa: public/favicon-16x16.png, -32x32.png, -48x48.png ja
public/favicon.ico. EI koske apple-touch-iconiin, icon-192/512:een,
site.webmanifestiin eika app/layout.tsx:aan.

--------------------------------------------------------------------------
PARAMETRIT - naita ei saa mistaan muualta, joten ne on dokumentoitu tassa.

  lahde            public/Logo/wsmedia-mark.svg (viewBox 1659.293862 x
                   795.969869). fill="currentColor" korvataan arvolla
                   #000000: rasteroija ei ratkaise currentColoria, joten
                   ilman korvausta merkki jaisi piirtymatta.

  rasteroija       ImageMagick 6.9.1 (convert). Ei uutta riippuvuutta
                   package.jsoniin.

  RADIUS  0.238    Pyoristetyn pohjan sade osuutena koosta. Mitattu
                   sovittamalla ympyrankaari VANHAN 48px ikonin
                   alfakanavaan (jaannosvirhe 1,87 px^2); arvoa ei ollut
                   dokumentoitu missaan, koska ikonit oli tehty kasin.

  MARK_W  0.96     Merkin leveys osuutena nelion leveydesta. Vaatimus oli
                   vahintaan 0,94; 0,96 ylittaa sen mutta jattaa merkin ja
                   pyoristetyn reunan valiin ilmaa.

  SUPERSAMPLE 16   Rasterointi kohdekokoon nahden (256/512/768 px).

  UNSHARP          "0x0.6+1.2+0" pienennyksen JALKEEN. Pelkka
                   ylinaytteistys ei riita 16px:ssa: merkin vinoviivat ovat
                   siella alle pikselin levyisia ja jaavat harmaiksi vaikka
                   geometria on oikein - mitattuna lum<60 pysyi 22:ssa eli
                   tasan ennallaan. Unsharp palauttaa viivatiheyden
                   (16px lum<60 22 -> 39) koskematta geometriaan,
                   mittasuhteisiin tai variin.

  ICO              Ruudut 16/32/48 PNG-PAKATTUINA. Sailio kootaan tassa
                   kasin, koska ImageMagick 6 kirjoittaa ico:hon
                   pakkaamattomat BMP-ruudut (15086 tavua). PNG-ruudut
                   upotetaan tavu tavulta samoista tiedostoista jotka
                   yllaoleva putki juuri kirjoitti, joten ico:n ja
                   erillisten PNG:iden pikselisisalto on maaritelmallisesti
                   identtinen.
--------------------------------------------------------------------------
"""
import os, re, struct, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "public", "Logo", "wsmedia-mark.svg")
OUT = os.path.join(ROOT, "public")
TMP = "/tmp/wsfav"

MARK_W = 0.96
RADIUS = 0.238
SUPERSAMPLE = 16
UNSHARP = "0x0.6+1.2+0"
SIZES = [16, 32, 48]

def svg_source():
    s = open(SRC, encoding="utf-8").read()
    vb = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', s)
    w, h = float(vb.group(1)), float(vb.group(2))
    inner = s[s.index("<g "):s.rindex("</g>") + 4]
    # currentColor ei ratkea rasteroijassa -> kiinnitetaan musta
    inner = inner.replace('fill="currentColor"', 'fill="#000000"')
    return w, h, inner

def build(size, w, h, inner):
    k = (MARK_W * size) / w
    tx = (size - MARK_W * size) / 2
    ty = (size - h * k) / 2
    r = RADIUS * size
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" '
        f'viewBox="0 0 {size} {size}">'
        f'<rect x="0" y="0" width="{size}" height="{size}" rx="{r}" ry="{r}" fill="#ffffff"/>'
        f'<g transform="translate({tx},{ty}) scale({k})">{inner}</g>'
        f"</svg>"
    )

def main():
    os.makedirs(TMP, exist_ok=True)
    w, h, inner = svg_source()
    made = []
    for s in SIZES:
        big = s * SUPERSAMPLE
        svg = os.path.join(TMP, f"f{s}.svg")
        open(svg, "w", encoding="utf-8").write(build(big, w, h, inner))
        png = os.path.join(OUT, f"favicon-{s}x{s}.png")
        subprocess.run(
            ["convert", "-background", "none", "-density", "384", svg,
             "-resize", f"{s}x{s}", "-unsharp", UNSHARP, "-strip", "PNG32:" + png],
            check=True)
        made.append(png)
        print(f"  {png}  (rasteroitu {big}x{big}, {SUPERSAMPLE}x)")
    ico = os.path.join(OUT, "favicon.ico")
    write_ico(ico, made)
    print(f"  {ico}  ({len(SIZES)} PNG-ruutua: {', '.join(str(s) for s in SIZES)}, "
          f"{os.path.getsize(ico)} tavua)")


def write_ico(path, pngs):
    """Kokoaa ICO-sailion PNG-ruuduista.

    Ruudut upotetaan sellaisenaan, tavu tavulta - ico:n pikselisisalto on
    siis sama kuin erillisten PNG-tiedostojen. ICONDIRENTRYn leveys ja
    korkeus ovat yhden tavun kenttia, joissa 0 tarkoittaa 256:ta; kaytetyt
    koot 16/32/48 mahtuvat sellaisenaan.
    """
    blobs = [open(p, "rb").read() for p in pngs]
    n = len(blobs)
    off = 6 + 16 * n
    hdr = struct.pack("<HHH", 0, 1, n)
    entries, data = b"", b""
    for p, b in zip(pngs, blobs):
        s = int(re.search(r"favicon-(\d+)x", p).group(1))
        entries += struct.pack("<BBBBHHII", s, s, 0, 0, 1, 32, len(b), off)
        off += len(b)
        data += b
    open(path, "wb").write(hdr + entries + data)

if __name__ == "__main__":
    main()
