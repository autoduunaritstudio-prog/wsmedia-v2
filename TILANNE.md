# WS Media -sivusto, tilanne 1.10.2026

Tämä tiedosto on siirtomuistio uuteen chattiin. Repo: `wsmedia-v2`, paikallinen polku `/Users/tuomas/Desktop/wsmedia-v2`, dev-palvelin `localhost:3000`.

---

## 1. Pysyvät säännöt, älä riko näitä

- **Älä oleta mitään suunnittelupäätöstä ilman koodista tai laskennasta todentamista.** Mittaa elävästä DOMista (computed styles, rectit, pikselinäytteet, kontrastit) ennen ja jälkeen.
- **Git-commitit osoitteella `autoduunaritstudio@gmail.com`.** `kosjak93@gmail.com` ei ole GitHub-tilillä, ja sillä tehty commit estää Vercel-deployn.
- **Staging aina nimetyillä poluilla** (`git add <polku>`), ei koskaan `git add -A`.
- **Ei ajatusviivoja (—) teksteihin.** Käytä pilkkua tai muotoile lause toisin.
- **Ei commiteja omapäisesti.** Tuomas kertoo milloin commitataan.
- **Push tehdään Tuomaksen koneelta.** Sandboxissa ei ole credential helperiä eikä `gh`:ta.
- **Ei keksittyjä asiakastodisteita** ennen kuin oikeita on.
- **Indeksointi ja orgaaninen näkyvyys ovat jatkuva prioriteetti.**
- **Ylälogoon ja valikkopainikkeeseen ei kosketa.**
- **Nykyistä live-wsmedia.fi:tä ei käytetä lähteenä eikä referenssinä.**
- Lyhyet vastaukset, vähän välivaiheiden raportointia.
- Claude Code -promtit omana koodilohkonaan.

### Sandboxin rajoitukset

- `git` ei pysty poistamaan tiedostoja. Jos `.git/index.lock` jää, siirrä se: `mv .git/index.lock _to_delete/`.
- Indeksin kiertotie commitille: `cp .git/index $HOME/wsx.index; export GIT_INDEX_FILE=$HOME/wsx.index`, aja `git add`/`git commit`, siirrä lock-tiedostot `_to_delete/`-kansioon, `cp $HOME/wsx.index .git/index`.
- `npm run build` ei toimi sandboxissa (EPERM unlink `.next`). `npx tsc --noEmit` toimii.
- Dev-palvelin ei näy `device_bash`-shellistä (`curl localhost:3000` ei vastaa), mutta **selainpaneeli näkee sen**. Aseta ikkunan koko ennen mittauksia: ilman sitä `innerWidth` on 0 ja kaikki mitat ovat roskaa.

---

## 2. Kuvakielen säännöt, joita kaikki neljä palvelusivua noudattavat

Sivut: `/verkkosivut`, `/lyhytvideot`, `/hakukoneoptimointi`, `/graafinen-suunnittelu`.

### Tausta

- **Yksi sivutason `<NetBackdrop merkit={false} />`** koko sivulle. Ei osiokohtaisia kerroksia: ne alkavat ja loppuvat osion mukana, jolloin kuviointi katkeaa jokaisella rajalla.
- **Osiot ovat läpinäkyviä.** Ei `data-tone`, ei `.valo`, ei `.ruudukko`, ei omaa `background`-väriä. Poikkeus: `.kuvapohja` ja `.lava`, joilla on oma valokuva.
- **Peittävät vaiheet saavat umpinaisen pohjan `Jakso`-kaaren kautta**, eivät itse.
- **Coverin ja sivutason kerroksen voimakkuus on sama luku.** Jaettu sääntö antaa coverille `.46` ja sivutasolle `.62`. Jos ne jäävät eri arvoihin, raja niiden välillä näkyy vaakasuorana nauhana. Sama koskee vinjetin geometriaa ja loppuväriä.
- Pohjaväri: verkkosivut `#111823`, muut kolme `#0b0f14`.

### Ketju ja rytmi

Yksi peittoketju herosta CTA:han. Sisäkkäiset `.pino`-kaaret, ei sisaruksia: kun sticky kerran tarttuu, se pysyy kiinni kaarensa loppuun asti.

Rytmi on **raskas vaihe, hengähdys, raskas vaihe**. `Jakso` on yksi vaihe, eli kaksi osiota samassa kaaressa lasketaan yhdeksi. Lyhyt osio yksin kahden hengähdyksen välissä lukee vahingolta.

Hännässä (hinnoittelu, kenelle, UKK, CTA) kaikki osiot ovat **yhden `Jakso`-kaaren sisällä**, jolloin kuviota ei katkea niiden välissä.

Ehto joka rikkoutuu äänettömästi: yhdelläkään esivanhemmalla ei saa olla `overflow: hidden` tai `clip`.

### Pystykaiut

Osion nimi sivun reunassa ylisuurena ääriviivasanana, `<Kaiku sana="NIMI" puoli="vas|oik" kohta="keski|ylos" />`.

- Vasen ja oikea **vuorottelevat**.
- Hinnoittelussa ei kaikua.
- Vasen on käännetty (`rotate(180deg)`), oikea luetaan ylhäältä alas.
- Fontti on Helvetica Neue, ei sivuston oma. Syy: muiden fonttien glyfeissä diagonaali on erillinen päällekkäinen kontuuri, jolloin ääriviivat menevät kulmissa päällekkäin. Testattu viidellä fontilla ja kolmella painolla.
- `line-height: 1`, ei pienempi. Pystykirjoituksessa line-height on rivin LEVEYS, ja `.76` toi sivulle 17 px vaakavieritystä.
- Koko lasketaan kirjainmäärästä (`--kirjaimet`), ja animaation kesto myös, jolloin sanat eivät liiku yhtenä rivistönä.
- Voimassa vain yli 1200 px leveydellä.

### Hero

- Verkkosivut, lyhytvideot ja graafinen suunnittelu: **pinnattu hero + peittävä cover**, jonka yläreunassa `<Logos />`. Hero ja cover ovat saman `.stickysub`-kaaren lapsia.
- **Hakukoneoptimointi on poikkeus**: sen hero jää sellaisenaan, ei sticky-cover-sääntöä. Tämä on Tuomaksen päätös.

### Typografia

Yhteiset koot ovat `globals.css`:ssä `:is(.page-verkkosivut, .page-lyhytvideot, .page-hakukoneoptimointi, .page-graafinen-suunnittelu)` -valitsimien takana. **Jos lisäät viidennen sivun, se lisätään näihin valitsimiin.** Niitä on 47 kappaletta.

---

## 3. Toistuvat virhelähteet

1. **Hiljainen kaskadi.** Myöhempi sääntö ei voita, jos aiemmalla on isompi tarkkuus. Esimerkkejä jotka ovat oikeasti kaataneet asioita: `.wsx .laatta.taysi .laatta-lause` (4 luokkaa) voitti 3 luokan säännön; `:is(...) .netbd:not(.netbd-cover)` voitti `.page-verkkosivut .netbd`:n; id-valitsin `#sisalto` voitti pinon sticky-säännön. **Laske tarkkuus, älä arvaa.**
2. **Väärän kerroksen mittaaminen.** Sauma voi olla väri, opacity, geometria tai arkkitehtuuri. Neljä epäonnistunutta korjausta meni väriin ja opacityyn, kun vika oli siinä että kerroksia oli kaksi.
3. **Verifiointisokeus.** Jos selaimen välilehti on peitossa, `document.hidden` on true, rAF ei aja ja canvas-kerrokset ovat kuvakaappauksissa tyhjiä. Älä väitä saumaa korjatuksi tyhjän canvasin perusteella.
4. **Oireen korjaaminen rakenteen sijaan.**

---

## 4. Mitä on tehty

Kaikki on commitattu ja pushattu. `main` on samassa kohdassa kuin `origin/main`, työpuu on puhdas lukuun ottamatta kolmea seuraamatonta tiedostoa (`kaynnista-dev.command`, `kaynnista-prod.command`, `public/_perf.html`), jotka jätettiin tarkoituksella pois.

| Commit | Sisältö |
| --- | --- |
| `dd822ec` | Väliaikainen tulossa-sivu wsmedia.fi-hostille |
| `5f7e873` | Lyhytvideot: tekstit, hinnat ja suorituskyky; SEO ja graafinen kuvakieleen |
| `9fb77b8` | Lyhytvideot: peitetyt pinon vaiheet piiloon, ei läpikuultoa |
| `a5850ad` | Lyhytvideot: Safarin vieritys sujuvaksi |
| `69f3107` | Lyhytvideot: tarjousosion välkyntä ja Safarin katoava palkki |
| `c553d85` | Lyhytvideot: sulavat B-roll-tekstit, tiiviimmät välit, palkki napista |
| `1ceb344` | Verkkosivut: tekstit hakusanojen mukaan, nopeus ja samat korjaukset kuin lyhytvideoilla |
| `2086ab1` | Pehmeä vieritys: Lenis ja koristeiden oma pehmennys |

### Hakukoneoptimointi-sivu kuvakieleen

Sivulla ei ollut sivutason verkostokerrosta lainkaan ja osioilla oli neljä eri pohjaa (`data-tone="ink"` #060a0e, `.valo` vaalea, `.ruudukko`, sivun oma). Nyt yksi kerros, läpinäkyvät osiot, yksi peittoketju ja pystykaiut NÄKYVYYS, SISÄLTÖ, PAIKALLINEN, 12 KK, LUVUT, KENELLE, FAQ. Häntä (hinnoittelu, kenelle, UKK, CTA) yhdessä `Jakso`-kaaressa. Hero jätettiin rauhaan.

### Graafinen suunnittelu -sivu kuvakieleen

Oli viimeinen vaaleassa ilmeessä, kolmetoista peräkkäistä osiota ilman peittoa. Nyt `.wsx`, sivutason verkosto, rae, pinnattu hero + cover, yksi peittoketju. Jaksot: Miksi + Palvelut, Prosessi + Aineistot, Materiaalit + Toiminta-alue, häntä Hinta, Kenelle, UKK, Taustaa, Tarjous. Kolme hengähdystä. Kaikki omat kortit korvattu jaetuilla palikoilla. Käsin kirjoitettu lomake vaihtui `BudgetForm`-komponenttiin. Blogi-osio ja Loppu-lohko poistettiin.

Pintanäyttämön juuriluokka `.stage` piti nimetä `.gs-nayttamo`:ksi: `.stage` on varattu lyhytvideoiden puhelinviuhkalle (`.stickysub .stage` asettaa 470 px korkeuden ja laitteiden paikat).

### Tekstikorjaukset kaikilla neljällä sivulla

- Tarjouksen otsikko oli sanatarkasti sama kuin sitä edeltävä hengähdys (SEO).
- "Kartoitus ja alustava auditointi ovat maksuttomia" kahdesti vierekkäin (SEO).
- "Kukaan ei voi luvata päivämäärää" kahdesti (SEO).
- "kartoituksessa" kolmesti samassa osiossa (SEO ja lyhytvideot).
- "Odotat takuuta sijasta yksi" korjattu muotoon "Odotat takuuta ykkössijasta" (SEO).
- Tarjouksen askel lupasi rinnakkain "24 h" ja "arkipäivän sisällä" (SEO ja lyhytvideot).
- UKK:n hintakysymys oli sama kuin osion H2 (SEO ja graafinen).
- "Tarvitseeko minulla olla" korjattu (verkkosivut ja graafinen).
- "Et tarvitse mitään valmiiksi" kolmesti (verkkosivut).
- UKK-vastauksessa oli HTML-linkkejä merkkijonon sisällä, joten sivulla luki kirjaimellisesti `<a href="/verkkosivut">verkkosivut</a>` (graafinen).
- Murupolku osoitti osoitteeseen `wsmedia.fi/palvelut`, jota ei ole. Korjattu `wsmedia.fi/#palvelut` **kaikilla neljällä sivulla**.
- Ajatusviivat pois graafisen suunnittelun sivulta, myös OG-kuvauksesta ja JSON-LD:stä.

---

## 4b. Rullahiiren pehmennys, 1.10.2026

**Oire:** Mac-ohjauslevyllä ja Magic Mousella kaikki toimii sulavasti, tavallisella napsautushiirellä vieritys on terävä ja animaatiot katoavat.

**Syy:** ohjauslevy tuottaa pikselitarkkoja tapahtumia, kymmeniä pieniä askelia sekunnissa. Rullahiiren yksi napsautus siirtää sivua kertaheitolla noin sata pikseliä. Koko kuvakieli on sidottu vierityksen arvoon, joten väliasentoja ei piirretä kertaakaan.

**Korjaus on kaksiosainen.**

**1. Lenis, `app/components/Pehmeavieritys.tsx`.** Pehmentää itse sivun liikkeen. Vertailukohta oli hoyrymedia.fi, joka käyttää samaa kirjastoa, ja asetukset on otettu sieltä: `lerp: 0.1`, `wheelMultiplier: 0.7`, `gestureOrientation: "vertical"`. Lisäksi `anchors: true` ja `autoRaf: true`. Mountattu `app/layout.tsx`:ään.

Lenis ajaa oikeaa window-vieritystä, ei transformia, joten `position: sticky`, selaimen oma haku ja koko `.pino`-arkkitehtuuri toimivat muuttumattomina. **Tämä on ehto jota ei saa rikkoa:** jos Lenis joskus vaihdetaan transform-tilaan tai johonkin muuhun kirjastoon, sticky-pinot hajoavat.

Kosketus jää natiiviksi (`syncTouch` oletusarvossaan epätosi). `prefers-reduced-motion` estää käynnistyksen kokonaan.

**Lukko.** Lenis poistettiin aikanaan siksi, että heron latausruudun `html.hero-locked { overflow: hidden }` ei pysäytä skriptattua vieritystä, ja Lenis ajoi `window.scrollTo`:ta lukon ohi. Nyt lukko havaitaan MutationObserverilla luokista `hero-locked` ja `lukossa`, ja Lenis pysäytetään sen ajaksi.

CSS globals.css:n lopussa: `html.lenis-smooth { scroll-behavior: auto !important }` (muuten selaimen oma ankkuripehmennys ja Lenis animoivat samaa liikettä päällekkäin ja lopputulos nykii), `html.lenis.lenis-stopped { overflow: clip }` ja `[data-lenis-prevent]`.

**2. Koristeiden pehmennys, `app/components/SiteEffects.tsx`.** `scP` seuraa todellista vierityskohtaa eksponentiaalisesti, ja `viive = sc - scP` lisätään rect-lukemiin. Pehmennetyt: parallaksi, `--rvp`, `--piirto`, `--valo`, `--kiinni`, korttien kääntö, metallikuvion ajuri, etenemäpalkki. Pehmentämättä: navin piilotus. `PEHMENNYS_TAU` on 0,035 s, koska Lenis tekee jo päätyön; tämä suodattaa jäännöksen ja on se mikä jää jäljelle jos Lenis ei ole käytössä.

**Säätönupit:** `lerp` Pehmeavieritys.tsx:ssä (pienempi = pehmeämpi ja hitaampi), `wheelMultiplier` (pienempi = lyhyempi askel per napsautus), `PEHMENNYS_TAU` SiteEffects.tsx:ssä.

**Todennettu ja hyväksytty 1.10.2026.** Tuomas testasi rullahiirellä ja ohjauslevyllä, build menee läpi, commitattu (`2086ab1`) ja pushattu.

`package.json` ja `package-lock.json` muuttuivat, `lenis ^1.3.26`.

---

## 4c. Graafinen suunnittelu: tekstit, hinnat ja visuaali, 1.10.2026 (ei commitattu)

- Tekstit hakusanojen mukaan (Keyword Planner + kilpailijat), uudet hinnat: logo 490, ilme 1 490, auton mainosteippaus 490, ikkunateippaus 290, painotuotteen suunnittelu 190 (painatus tarjouksen mukaan), valomainos tarjouksen mukaan. Sama luku korteissa, UKK:ssa, laskurissa ja JSON-LD:ssä.
- Pohja #172132 (verkkosivut #111823, lyhytvideot #0b0f14). Portaikko jatkuu SEO-sivulle ja etusivulle.
- Hengähdykset: vaite + kuva, täysi laatta, vaite + kuva. Kuvat public/graafinen-suunnittelu/ (ilme, pakettiauto, luonnokset).
- Graafinen lisätty verkkosivujen ja lyhytvideoiden yhteisiin sääntöihin: osio-valo, B-roll-tekstien pehmennys, palkki napista, 72 px välit, prosessin solmut ja viisi saraketta, kenelle-palstat, footer, .mark, napin hehku.
- Push tehdään kun kaikki palvelusivut ovat valmiit (Tuomaksen päätös).

## 5. Seuraavat askeleet

Mitään pakollista ei ole kesken. Alla olevat ovat avoimia päätöksiä ja siivousta, tärkein ensin.

### 0. Edge: palvelusivut raskaita ja CTA-palkki välkkyy (avoin, 1.10.2026)

Julkaistulla sivulla (wsmedia-v2.vercel.app) kaikki palvelusivut pyörivät Edgessä raskaasti ja CTA-palkki välkkyy. Chromessa ja Safarissa kaikki toimii. Epäily: Edgen "Enhance your security on the web" (Balanced) ajaa JavaScriptin ilman JIT:iä harvoin käydyillä sivuilla. Tuomas ei löytänyt asetusta suomenkielisestä Edgestä, tarkistus kesken: osoiterivin "Added security" -merkintä tai Asetukset > Privacy, search, and services > Security. Jos syy varmistuu, kevennetään vieritysskriptit (SiteEffects, teippaus-heron canvas) niin että ne toimivat myös ilman JIT:iä. Muuten mitataan Edgellä Tuomaksen koneella.

Graafisen suunnittelun sivun muutokset 1.10. iltapäivältä ovat paikallisia committeja, push vasta kun palvelusivut ovat valmiit.

### 1. (Tehty) Lyhytvideoiden hinnat

Sivulla näkyy yhä `[HINTA]` ja `[X]` -paikanpitäjiä (`app/lyhytvideot/components/sections2.tsx`, yhdeksän kohtaa), mutta **rakenteisessa datassa on jo oikeat hinnat** (`app/lyhytvideot/structured-data.ts`: 1500 ja 2200 euroa). Google saa siis hinnat joita sivulla ei näy. Tämä on sekä asiavirhe että riski rikkinäisestä rikastetusta hakutuloksesta.

Kun hinnat lisätään, molemmat tiedostot päivitetään **yhdessä**, ja luvut tarkistetaan täsmäämään.

### 2. Kaupunkisivut

`/hakukoneoptimointi/espoo` ja yhdeksän muuta ovat linkkejä 404:ään. Graafisella sivulla vastaavat muutettiin tekstiksi. Päätä: rakennetaanko kaupunkisivut vai muutetaanko SEO-sivunkin linkit tekstiksi.

### 3. Kuvat graafiselle sivulle

Kansio `public/graafinen-suunnittelu` on tyhjä, joten kolme hengähdystä ovat ilman valokuvaa. Kuvapaikat ovat valmiina sivun `page.tsx`:ssä: lisää `kuva="/graafinen-suunnittelu/<nimi>.webp"` kolmeen `<Vaite>`-elementtiin.

### 4. Ajatusviivat lopuilta sivuilta

Vielä jäljellä: `toihin-meille`, `tietosuoja` sekä komponentit `Results.tsx`, `Booking.tsx` ja `Refs.tsx`.

### 5. Pohjaväri

Lyhytvideot, SEO ja graafinen ovat `#0b0f14`, verkkosivut `#111823`. Päätä yhtenäistetäänkö.

### Kuollutta koodia

Ei minkään sivun käytössä. Tarkistettu 1.10.2026:

- `app/components/HeroBrowserStage.tsx`
- `app/verkkosivut/components/Rakentuu.tsx` ja `.rakentuu` / `.rk-*` -säännöt globals.css:ssä
- `app/verkkosivut/sections.tsx`, `app/verkkosivut/sections2.tsx`
- `app/hakukoneoptimointi/sections.tsx`, `app/hakukoneoptimointi/sections2.tsx`
- Vanha `.page-graafinen-suunnittelu` CSS-lohko globals.css:ssä, noin 110 riviä: `.bcard`, `.bento`, `.bt-item`, `.hline`, `.hsteps`, `.hbox`, `.files`, `.frow`, `.twopanel`, `.pan`, `.closer`, `.hsplit`, `.bridge`

Elävät vastineet ovat `app/verkkosivut/components/` ja `app/hakukoneoptimointi/components/` -kansioissa, eli juuritason `sections*.tsx` ovat vanhoja kopioita.

### Tiedossa olevat, koskemattomat

- 19 px vaakavieritys `/lyhytvideot`-sivulla 1230 px leveydellä, heron `.chip-f`-lipukkeesta. Oli olemassa jo ennen tätä työtä.
- Seuraamattomat `kaynnista-dev.command`, `kaynnista-prod.command` ja `public/_perf.html`. Päätä commitataanko vai `.gitignore`en.

---

## 6. Tekninen pohja

Next.js 16.3.3 (Turbopack), React 19, App Router, Tailwind v4, TypeScript, ei `src/`-kansiota.

Keskeiset tiedostot:

- `app/globals.css`, noin 14 700 riviä, sisältää kaiken. Suomenkieliset kommentit selittävät jokaisen mitatun päätöksen.
- `app/components/NetBackdrop.tsx`, deterministinen jaettu pistekenttä. Kiinteä kerros ajaa aina (`shouldRun()` palauttaa `true`), rAF saa absoluutit sekunnit.
- `app/components/Jakso.tsx`, kaksi tai useampi osio yhden kerroksen alle. `omaPohja={false}` ketjun ensimmäiselle kaarelle.
- `app/components/Maasto.tsx`, `Laatta`, `Juova`, `Kaiku`, `Vaite`, `Pystykisko`.
- `app/components/BudgetForm.tsx`, jaettu tarjouslomake.
- `app/components/film-codec.ts`, WebCodecs-vierityselokuva. GOP 12, `-sc_threshold 0`, `+faststart`, REV tiedostonimessä.
- `scripts/build-hero-film.mjs`, parametroitu kahdelle sivulle, konfiguraatiotaulu `SIVUT`.

Vierityksen muuttujat: `--piirto` (offsetTop-ketju, immuuni stickylle), `--valo` (0..1 per osion ohitus), `--kiinni`, `--rvp`.
