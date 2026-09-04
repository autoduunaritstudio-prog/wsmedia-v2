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

**AINA HEADLESS.** Nakyva ikkuna vain jos kayttaja nimenomaan pyytaa
nahda ajon.

```js
chromium.launch({
  headless: true,
  args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'],
})
```

**GPU-liput ovat pakolliset, eivat koriste.** Playwrightin oletus-headless
on "chromium headless shell", joka rasteroi SwiftShaderilla eli
ohjelmistolla. Se vaaristaa kaiken rasterointiin liittyvan mittauksen.
Mitattu tallä koneella, WebGL RENDERER:

| kaynnistys | renderoija |
|---|---|
| `headless: true` ilman lippuja | SwiftShader (ohjelmisto) |
| `headless: true` + GPU-liput | **Apple M1 Pro, Metal** |
| `channel: 'chromium'` + headless | Apple M1 Pro, Metal |
| `headless: false` | Apple M1 Pro, Metal |

Mittaustulos on lipuilla sama kuin nakyvalla ikkunalla: kehysvalin
mediaani 8,3 ms ja p95 9,3 ms molemmilla, kun ohjelmistorasteroinnilla
mediaani oli 16,7 ms. **Nakyvaa ikkunaa ei siis tarvita mihinkaan.**

Kaikki mittausskriptit kayttavat yhteista `scripts/_browser.mjs`:aa,
joka hoitaa liput ja binaarin tarkistuksen. Ala kirjoita
launch-optioita uudestaan skriptikohtaisesti.

**YKSI KAYNNISTYS PER TEHTAVA.** macOS aktivoi sovelluksen sen
kaynnistyessa, joten `--window-position` ei estanyt ikkunaa tulemasta
eteen silloin kun nakyvaa ikkunaa viela kaytettiin. Vaikka headless
poistaa ongelman, sama saanto pysyy: variantit ja toistot ajetaan
saman selaininstanssin sisalla omina konteksteinaan, ei omina
selaimina. Ala kaynnista selainta valitarkistuksiin - keraa kaikki
mitattava yhteen ajoon.

**ALA KOSKAAN:**

- nosta selainikkunaa eteen (`bringToFront`, `focus`, `activate`)
- avaa kayttajan omaa Chromea tai kayta hanen profiiliaan - Playwright
  kaynnistaa aina oman erillisen instanssinsa
- jata selainprosesseja pyorimaan: sulje browser aina `try`/`finally`
- jata tuotantopalvelinta pyorimaan ajon jalkeen

Sivun tila luetaan `page.evaluate()`-kutsulla. Ota screenshot vain jos
ulkoasu on itse asian kannalta olennainen, ja tallenna se tiedostoon
ala palauta sita raportissa.

**Huom mittauksesta headlessissa:** `document.visibilityState` on aina
`'visible'` eika taustavalilehtea voi jaljitella. Jos testattava asia
riippuu piilotetusta dokumentista, sano se suoraan alaka vaita
testanneesi sita - korvaa se tyngalla joka jaljittelee puuttuvaa
toimitusta.

**Huom kehysajoista:** ne EIVAT toistu kayttajan ikkunakoolla
(1728x992 dpr 2). Sama ajo kolmesti antoi pahimmaksi kehykseksi 49,5 /
316,7 / 541,5 ms. Validoi muutokset kerrosmaaralla ja kerrosmuistilla,
jotka toistuvat. Jos raportoit kehysaikoja, aja vahintaan 10 kertaa ja
kerro hajonta.

**Rajatapaus:** jos tavallisessa tehtävässä törmäät arvoon jota et voi johtaa
koodista, ÄLÄ käynnistä selainta oma-aloitteisesti. Sano mikä arvo se on ja
miksi se vaatii selaimen, ja anna käyttäjän päättää.

## prefers-reduced-motion

Asetus koskee ei-välttämätöntä **liikettä**. Se ei koske asettelua, mittausta
eikä geometriaa.

**ÄLÄ KOSKAAN** gataa reduced-motionin taakse:

- `position: sticky` tai muuta pinnausta — pinnaus on asettelua, ei liikettä
- elementtien mittausfunktioita jotka kirjoittavat CSS-muuttujia
  (`measureRef`, `measureHero`, `measureMetal` tms.)
- spacereita, `min-height`ejä tai muuta tilanvarausta
- scroll-sidottua geometriaa: sticky-topit, cover-fadet, scrimit
- **scroll-scrubbausta.** Se etenee käyttäjän oman vierityksen mukaan ja
  pysähtyy kun hän pysähtyy — se ei ole automaattista liikettä.
  Vertailukohta: `ydr-autohuolto.vercel.app` tekee tämän oikein, se muuttaa
  vain `idle = 0` ja `follow = 1` eli poistaa ajelehduksen ja pehmennyksen
  mutta jättää scrubin.

**SAMMUTA** vain se mikä liikkuu itsestään ajan funktiona: sisääntulo-
animaatiot, `@keyframes`-loopit, karusellit, count-up-laskurit,
hiiriparallaksit, hover-käännöt, automaattinen pehmennys (Lenis-tyyppinen),
autoplay-videot.

**RAUTAINEN SÄÄNTÖ:** jos sammutat efektin, sammuta myös sen geometria.
Spacer ilman sisältöä on huonompi lopputulos kuin efekti — myös sille
käyttäjälle joka asetuksen laittoi päälle. Joko molemmat jäävät tai
molemmat lähtevät.

CSS-puolella pakota **lopputila**, älä pelkkää `animation: none` — se jättää
elementin alkutilaan (`opacity: 0`, `translateY`, `scale`). Kirjoita
`opacity: 1` ja `transform: none` eksplisiittisesti.

JS haarautuu reduced-motionin mukaan **vain** silloin kun CSS ei pysty
pysäyttämään asiaa (rAF-silmukat, ajastimet). Kaikki muu hoidetaan CSS:ssä.

**VERIFIOINTI:** elementtikohtainen tarkastelu, ei kuvan keskihajonta.
Keskihajontamittari ei löydä ruutua jossa on navi ja yksi tekstirivi — se
antoi 0 tyhjää ruutua myös silloin kun hero oli pinnaamatta ja 2222 px oli
tyhjää. Tarkista mikä elementti on näkymän keskellä eri scrollY-kohdissa ja
vertaa normaalitilaan.
