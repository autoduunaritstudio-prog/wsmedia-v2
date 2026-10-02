# Perf-vertailu

Skriptit, joilla lyhytvideot-sivun vieritys mitattiin ja kevennettiin 1.–2.10.2026.
Vertailukohta on `hoyrymedia.fi/lyhytvideot`.

## Mittausympäristö

Luvut on mitattu pilvikoneessa, jossa **ei ole näytönohjainta**. Chrome kokoaa ja
rasteroi sivun prosessorilla, joten jokainen koko ruudun kokoinen läpinäkyvä kerros
maksaa noin 4–5 ms kehyksessä. Tämä on tarkoituksella huonoin tapaus: se näyttää
saman työn, jonka heikko näytönohjain joutuu tekemään. Macilla luvut ovat
korkeammat, eivätkä ne ole vertailukelpoisia tämän taulukon kanssa.

Näkymä 1366 × 768, vieritys 60 × 240 px rullahiirellä, evästeilmoitus kuitattu.

## Ajo

```
npm run build && npx next start -p 3000
node scripts/perf-vertailu/vertailu.cjs          # fps 1x, 4x ja 6x, oma sivu ja Höyry
node scripts/perf-vertailu/kuvat.cjs /tmp/ennen   # vertailukuvat ennen muutosta
node scripts/perf-vertailu/kuvat.cjs /tmp/jalkeen # ja sen jälkeen
python3 scripts/perf-vertailu/vertaa.py /tmp/ennen /tmp/jalkeen
```

`CHROME=/polku/chrome` valitsee oikean Chromen. Playwrightin omassa Chromiumissa ei
ole H.264:ää, joten sivun mp4-videot eivät pyöri siinä ja mittaus jää liian kevyeksi.

`koonti.cjs` ja `paasaie.cjs` näyttävät, mihin kehyksen aika menee: ensimmäinen
kokoonpanossa (vain ilman näytönohjainta), toinen pääsäikeessä.

## Rae

`rae/` tekee `public/rae/`-kuvat. Kuva on laskettu alkuperäisestä soft-light-rakeesta
sivun pohjavärin päällä, joten jokaisella pohjavärillä on oma kuvansa:

```
node rae/1-kalibroi.cjs '#0b0f14'   # alkuperäinen rae pohjavärin päällä, 1x ja 2x
python3 rae/2a-lut-kuva.py           # testikuva: alfat 1–16, harmaat 0–255
node rae/2b-lut.cjs '#0b0f14'       # mitä Chrome tuottaa kullakin alfalla ja värillä
python3 rae/3-rakenna.py 0b0f14     # kuvat
node rae/4-tarkista.cjs '#0b0f14'   # uusi kuva pohjavärin päällä, vertaa alkuperäiseen
```

Vaiheet 1 ja 4 tarvitsevat tuotantopalvelimen portissa 3000 ja sivun, jolla
alkuperäinen `.rae` (soft-light) on vielä voimassa.
