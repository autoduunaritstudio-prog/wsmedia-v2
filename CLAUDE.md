# wsmedia.fi v2 — työohjeet

## prefers-reduced-motion: ohituksen on voitettava laukaisin

Media query **ei lisää spesifisyyttä**. Ohituksen valitsimen on siis oltava
vähintään yhtä spesifinen kuin animaation laukaisimen, tai `!important`.

Ansa syntyy kun ohitus kirjoitetaan sille luokalle jossa liike
konseptuaalisesti asuu, mutta `animation` on jälkeläisellä ja laukaisin on
muotoa `.esivanhempi.tila .jälkeläinen`. Näin kävi `.gsurf-wheel`ille
(`.gsurf-wheel` 0,1,0 hävisi laukaisimelle `.gsurf-van.rv.on .gsurf-wheel`
0,4,0) ja `.rv.on .spark polyline`lle. Muista että `.on`, `.lights-on` ja
muut ajonaikaiset luokat lisätään myös tässä tilassa, ellei komponentti
nimenomaan portita observeria `reduce`-lipulla — `.gsurf-light` välttyi
ansalta juuri siksi, `.gsurf-wheel` ei.

**Tarkista myös lopputila.** Pelkkä `animation: none` jättää elementin
ALKUTILAAN. `.spark polyline` alkaa `stroke-dashoffset: 300` eli
näkymättömänä, joten ohituksen on asetettava myös `stroke-dashoffset: 0`.

## Median pakkausresepti

Video: h264, `yuv420p`, ei ääniraitaa (`-an`), `+faststart`, **crf 32**,
skaalaus `flags=lanczos`.

Posterit ja kuvasarjat: WebP. Laatu valitaan **mittaamalla** SSIM
häviötöntä referenssiä vastaan, tavoite **≥ 0,975**.

Laatua ei todenneta tiedostokoosta vaan VP8-bittivirran
kvantisointivektoreista (`webpinfo -bitstream_info`). Kokovertailu johtaa
harhaan, koska skaalain vaikuttaa kokoon: se antoi q70:n silloin kun
bittivirta osoitti q72:n.
