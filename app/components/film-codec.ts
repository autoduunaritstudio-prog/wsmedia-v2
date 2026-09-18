import { pura, type Nayte } from "./film-mp4";

/* VIERITYSELOKUVAN PURKUMOOTTORI.
 *
 * Yksi mp4 haetaan kerran, ja ruudut puretaan paikallisesti WebCodecsilla
 * sita mukaa kun niita tarvitaan. Verkko ei ole silmukassa lainkaan.
 *
 * MIKSI EI KEHYSSARJAA. Sarja oli 151 erillista kuvaa, 4,96 MB, ja
 * jokainen normaali vieritys kuluttaa noin 50 ruutua sekunnissa - verkko
 * ei ehdi, joten sarja oli pakko ladata ennakkoon kokonaan. Sama
 * materiaali yhtena mp4:na on 1,94 MB ja SSIM lahdetta vastaan on
 * PAREMPI (0,989 vs 0,987), koska ruutujen valinen pakkaus tekee tyon
 * jota erilliset kuvat eivat voi tehda.
 *
 * MIKSI EI <video> + currentTime. Selain ei lupaa kehystarkkuutta vaan
 * hakee lahimpaan avainkuvaan. Vierityksessa se nakyy nykimisena.
 *
 * KOLME ASIAA JOTKA RATKAISEVAT TOIMIVUUDEN:
 *
 * 1. AIKALEIMAKARTTA, EI LASKURI. x264 kayttaa B-kehyksia, joten
 *    purkaja palauttaa ruudut eri jarjestyksessa kuin ne syotetaan.
 *    Ruutu tunnistetaan aikaleimasta, ei ulostulojen laskurista.
 *
 * 2. UUDELLEENASEMOINTI MOLEMPIIN SUUNTIIN. Pelkka taaksepain-haara
 *    riittaa hitaaseen vieritykseen. Kun kohde karkaa satoja ruutuja
 *    eteen, syotto etenee yksi ruutu kerrallaan ja siivous heittaa
 *    valikehykset pois heti - kangas jaa viimeiseen piirrettyyn kuvaan
 *    ja ottaa kiinni vasta kun vieritys pysahtyy.
 *
 * 3. TAAKSEPAIN-EHTO EI SAA OLLA HERKKA. Ehto "syotto > kohde + EDELLA"
 *    tayttyy vakiovauhtisessa vierityksessa jatkuvasti, koska syotto on
 *    silloin tasan kohde + EDELLA. UUDELLEEN-marginaali ja tarkistus
 *    siita onko ruutu jo purettuna estavat turhan asemoinnin.
 *
 * Purkajaa ei tarvitse resetoida kummassakaan tapauksessa: se ottaa
 * avainkuvan vastaan milloin tahansa ja synkronoituu siita.
 */

/** Montako ruutua pidetaan purettuna kohteen edella ja takana. */
const EDELLA = 16;
const TAKANA = 8;
/** B-kehysten uudelleenjarjestyssyvyys. Marginaali taaksepain-ehdolle. */
const UUDELLEEN = 4;
/** Purkujonon katto. Isompi ei nopeuta, vain kasvattaa muistia. */
const JONO_KATTO = 12;

export type FilmTiedot = {
  src: string;
  frames: number;
  width: number;
  height: number;
};

export class Film {
  static tuettu() {
    return typeof window !== "undefined" && typeof (window as unknown as { VideoDecoder?: unknown }).VideoDecoder === "function";
  }

  /** Ruutuja esitysjarjestyksessa. */
  n = 0;
  width = 0;
  height = 0;
  valmis = false;

  private naytteet: Nayte[] = [];
  private data: ArrayBuffer | null = null;
  /** esitysindeksi -> purkuindeksi */
  private esitys: number[] = [];
  /** aikaleima -> esitysindeksi */
  private ctsIndeksi = new Map<number, number>();
  /** avainkuvat: d = purkujarjestys, p = esitysjarjestys */
  private avainkuvat: { d: number; p: number }[] = [];
  private kehykset = new Map<number, VideoFrame>();
  private dec: VideoDecoder | null = null;
  private syotto = -1;
  private jonossa = 0;
  private kohde = 0;
  private lopetettu = false;

  /**
   * @param onEtenema 0..1, todellinen osuus tavuista. Latauspalkki
   *   seuraa tata eika ajastinta: ajastimeen perustuva palkki valehtelee
   *   juuri silla yhteydella jolla se eniten merkitsee.
   */
  async lataa(tiedot: FilmTiedot, onEtenema?: (p: number) => void, signal?: AbortSignal) {
    const vast = await fetch(tiedot.src, { signal });
    if (!vast.ok) throw new Error(`film: ${vast.status}`);
    const yht = Number(vast.headers.get("content-length") || 0);
    let buf: ArrayBuffer;
    if (vast.body && yht > 0) {
      const lukija = vast.body.getReader();
      const palat: Uint8Array[] = [];
      let saatu = 0;
      for (;;) {
        const { done, value } = await lukija.read();
        if (done) break;
        if (value) {
          palat.push(value);
          saatu += value.byteLength;
          onEtenema?.(Math.min(saatu / yht, 1));
        }
        if (this.lopetettu) {
          void lukija.cancel();
          return;
        }
      }
      const koottu = new Uint8Array(saatu);
      let k = 0;
      for (const pala of palat) {
        koottu.set(pala, k);
        k += pala.byteLength;
      }
      buf = koottu.buffer;
    } else {
      buf = await vast.arrayBuffer();
      onEtenema?.(1);
    }
    if (this.lopetettu) return;
    const p = pura(buf);
    this.data = buf;
    this.naytteet = p.naytteet;
    this.n = p.naytteet.length;
    this.width = p.width;
    this.height = p.height;

    // Esitysjarjestys aikaleimasta. Vakaa lajittelu ei ole tarpeen:
    // aikaleimat ovat yksikasitteisia yhdessa raidassa.
    const jarj = p.naytteet.map((s, d) => ({ d, cts: s.cts })).sort((a, b) => a.cts - b.cts);
    this.esitys = jarj.map((x) => x.d);
    jarj.forEach((x, pIdx) => this.ctsIndeksi.set(x.cts, pIdx));
    this.avainkuvat = [];
    jarj.forEach((x, pIdx) => {
      if (p.naytteet[x.d].sync) this.avainkuvat.push({ d: x.d, p: pIdx });
    });
    this.avainkuvat.sort((a, b) => a.p - b.p);

    const dec = new VideoDecoder({
      output: (kehys) => {
        const i = this.ctsIndeksi.get(kehys.timestamp);
        this.jonossa = Math.max(0, this.jonossa - 1);
        if (i === undefined || this.lopetettu) {
          kehys.close();
          return;
        }
        const vanha = this.kehykset.get(i);
        if (vanha) vanha.close();
        this.kehykset.set(i, kehys);
      },
      error: () => {
        /* Purkuvirhe ei saa kaataa sivua: kangas jaa viimeiseen
           piirrettyyn ruutuun ja seuraava avainkuva korjaa tilanteen. */
      },
    });
    dec.configure({
      codec: p.codec,
      description: p.description,
      codedWidth: p.width,
      codedHeight: p.height,
      optimizeForLatency: true,
    });
    this.dec = dec;
    this.valmis = true;
    // Ensimmainen ruutu heti, jotta kangas ei ole musta.
    this.aseta(0);
    this.tayta();
  }

  /** Kohderuutu esitysjarjestyksessa. Kutsutaan joka rAF-ruudussa. */
  aseta(i: number) {
    this.kohde = Math.min(Math.max(Math.round(i), 0), Math.max(this.n - 1, 0));
  }

  hae(i: number) {
    return this.kehykset.get(i) ?? null;
  }

  /** Lahin purettu ruutu. Ilman tata kangas valahtaisi tyhjaksi. */
  lahin(i: number) {
    if (this.kehykset.has(i)) return i;
    for (let d = 1; d <= EDELLA + TAKANA + UUDELLEEN; d++) {
      if (this.kehykset.has(i - d)) return i - d;
      if (this.kehykset.has(i + d)) return i + d;
    }
    return -1;
  }

  /** Avainkuvan purkuindeksi esitysindeksia p varten. */
  private avain(p: number) {
    let paras = 0;
    for (const k of this.avainkuvat) {
      if (k.p <= p) paras = k.d;
      else break;
    }
    return paras;
  }

  tayta() {
    const dec = this.dec;
    if (!dec || !this.data || dec.state !== "configured") return;
    const kohde = this.kohde;
    const loppuP = Math.min(this.n - 1, kohde + EDELLA);
    const loppuD = this.esitys[loppuP] ?? this.naytteet.length - 1;

    if (this.syotto < 0) {
      this.syotto = this.avain(kohde);
      this.jonossa = 0;
    } else if (this.syotto > this.esitys[kohde] + UUDELLEEN && !this.kehykset.has(kohde)) {
      // HYPPY TAAKSEPAIN
      const alku = this.avain(kohde);
      if (alku < this.syotto) this.syotto = alku;
    } else if (this.syotto + EDELLA < this.esitys[kohde]) {
      // HYPPY ETEENPAIN. Ilman tata nopea vieritys jaatyy.
      this.syotto = this.avain(kohde);
      this.jonossa = 0;
    }

    const raja = Math.max(loppuD, this.esitys[kohde] ?? 0);
    while (this.syotto <= raja && this.jonossa < JONO_KATTO && this.syotto < this.naytteet.length) {
      const s = this.naytteet[this.syotto];
      const pIdx = this.ctsIndeksi.get(s.cts);
      // Jo purettu ruutu ohitetaan vain jos se on ikkunan sisalla:
      // avainkuvan jalkeiset on syotettava vaikka ne olisivat muistissa,
      // muuten purkaja ei saa referenssikehyksia.
      dec.decode(
        new EncodedVideoChunk({
          type: s.sync ? "key" : "delta",
          timestamp: s.cts,
          data: new Uint8Array(this.data, s.off, s.koko),
        }),
      );
      void pIdx;
      this.jonossa++;
      this.syotto++;
    }
  }

  /** Ikkunan ulkopuoliset ruudut vapautetaan. VideoFrame on GPU-muistia. */
  siivoa() {
    if (this.kehykset.size <= EDELLA + TAKANA + 4) return;
    const a = this.kohde - TAKANA;
    const b = this.kohde + EDELLA;
    for (const [i, kehys] of this.kehykset) {
      if (i < a || i > b) {
        kehys.close();
        this.kehykset.delete(i);
      }
    }
  }

  vapauta() {
    this.lopetettu = true;
    for (const k of this.kehykset.values()) k.close();
    this.kehykset.clear();
    if (this.dec && this.dec.state !== "closed") this.dec.close();
    this.dec = null;
    this.data = null;
  }
}
