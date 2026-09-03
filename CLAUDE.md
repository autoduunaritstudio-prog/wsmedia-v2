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

## Selaimen käyttö

Oletus: **ÄLÄ aja selainta.** Johda tulokset koodista ja laskennasta ja sano se
ääneen kun jokin arvo vaatisi elävän selaimen. Tämä koskee kaikkea tavallista
työtä — asemointia, värejä, tekstimuutoksia, komponenttien siirtoja, uusia
sääntöjä. Selaimen käynnistäminen tällaiseen maksaa minuutteja eikä tuota
mitään mitä koodi ei jo kerro.

Aja selain **VAIN** kun tehtävä on nimenomaisesti jokin näistä:

- suorituskyvyn mittaus (pudotetut kehykset, maalausaika, long taskit,
  LCP/CLS/INP)
- ajoituksen tai latauksen todentaminen (latausruutu, scroll lock,
  lazy-lataus, varaventtiilit)
- scroll-sidotun mekaniikan auditointi (scrubbaus, sticky-elementit,
  reveal-järjestelmä)
- visuaalinen regressio jonka toistuminen pitää todistaa, ei arvioida
- vian toisto joka ei toistu koodia lukemalla
- käyttäjä pyytää sitä suoraan

Kun selain ajetaan: Playwright, **tuotantobuild**
(`next build && next start`) — ei koskaan dev-palvelimesta, koska sen
suorituskyky ei kerro mitään. Throttlaus CDP:n kautta. Mittausskripti
tallennetaan niin että sen voi ajaa uudelleen samoilla parametreilla —
muuten ennen/jälkeen ei ole vertailu.

### Miten selainta ajetaan

Oletus on **HEADLESS**. Käytä `chromium.launch({ headless: true })` kaikkeen
mittaukseen. Chromen uusi headless käyttää samaa renderöijää kuin näkyvä
ikkuna, joten kehysajat, maalaus ja layout ovat vertailukelpoisia — ja se ei
varasta fokusta eikä avaa ikkunoita käyttäjän työpöydälle.

Käytä näkyvää ikkunaa (`headless: false`) **VAIN** kun käyttäjä on
nimenomaisesti pyytänyt näkevänsä ajon. Silloin käynnistä se niin ettei se
häiritse:

```js
chromium.launch({
  headless: false,
  args: [
    '--window-position=-2400,0',          // ruudun ulkopuolelle
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
  ],
})
```

Kolme viimeistä lippua ovat olennaiset: ilman niitä taustalle jäänyt ikkuna
hidastaa ajastimet ja rAF:n, jolloin mittaus on roskaa. Niiden kanssa ikkuna
ajaa täydellä nopeudella ilman fokusta.

**ÄLÄ KOSKAAN:**

- nosta selainikkunaa eteen (`bringToFront`, `focus`, `activate`)
- avaa käyttäjän omaa Chromea tai käytä hänen profiiliaan — Playwright
  käynnistää aina oman erillisen instanssinsa
- jätä selainprosesseja pyörimään: sulje browser ja context aina, myös
  virhetilanteessa (`try`/`finally`)
- jätä tuotantopalvelinta pyörimään ajon jälkeen

Sivun tila luetaan `page.evaluate()`-kutsulla. Ota screenshot vain jos ulkoasu
on itse asian kannalta olennainen, ja tallenna se tiedostoon älä palauta sitä
raportissa.

**Huom mittauksesta headlessissa:** `document.visibilityState` on aina
`'visible'` eikä taustavälilehteä voi jäljitellä. Jos testattava asia riippuu
piilotetusta dokumentista (IntersectionObserver ei toimita, ajastimet
hidastuvat), sano se suoraan äläkä väitä testanneesi sitä — korvaa se tyngällä
joka jäljittelee puuttuvaa toimitusta.

**Rajatapaus:** jos tavallisessa tehtävässä törmäät arvoon jota et voi johtaa
koodista, ÄLÄ käynnistä selainta oma-aloitteisesti. Sano mikä arvo se on ja
miksi se vaatii selaimen, ja anna käyttäjän päättää.
