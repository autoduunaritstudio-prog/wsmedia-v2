/* PIENI MP4-PURKAJA VAIN TATA TIEDOSTOA VARTEN.
 *
 * MIKSI EI mp4box.js. Se on yleiskayttoinen ja osaa kaiken, ja maksaa
 * siita noin 200 kt pakattuna. Tassa luetaan yhta tiedostoa, jonka
 * MEIDAN OMA rakennusskripti tuottaa tasan yhdella ffmpeg-komennolla:
 * yksi videoraita, avc1, ei fragmentteja. Silloin tarvittavat laatikot
 * ovat tiedossa etukateen ja niiden lukeminen on noin sata rivia.
 *
 * Luettavat laatikot:
 *   mdhd  aikayksikko
 *   stsd > avc1 > avcC   purkajan konfiguraatio
 *   stts  naytteen kesto (dts)
 *   ctts  esitysajan poikkeama (cts), olemassa vain B-kehysten kanssa
 *   stss  avainkuvat
 *   stsz  naytteen koko
 *   stsc  nayte -> lohko
 *   stco / co64  lohkon sijainti tiedostossa
 *
 * Jos rakennusskriptin komento muuttuu niin etta tiedostoon tulee
 * fragmentteja (moof) tai useampi raita, tama lakkaa toimimasta
 * aanettomasti. Siksi lataa() heittaa jos moovia tai avcC:ta ei loydy:
 * parempi nakya heti kuin piirtaa tyhjaa.
 */

export type Nayte = {
  /** tavusijainti tiedostossa */
  off: number;
  koko: number;
  /** esitysaika aikayksikoissa */
  cts: number;
  /** avainkuva */
  sync: boolean;
};

export type Purettu = {
  naytteet: Nayte[];
  /** avc1.PPCCLL */
  codec: string;
  description: Uint8Array;
  timescale: number;
  width: number;
  height: number;
};

type Laatikko = { tyyppi: string; alku: number; loppu: number; sisalto: number };

function* laatikot(d: DataView, alku: number, loppu: number): Generator<Laatikko> {
  let p = alku;
  while (p + 8 <= loppu) {
    let koko = d.getUint32(p);
    const tyyppi = String.fromCharCode(d.getUint8(p + 4), d.getUint8(p + 5), d.getUint8(p + 6), d.getUint8(p + 7));
    let sisalto = p + 8;
    if (koko === 1) {
      // 64-bittinen koko. Number riittaa: tiedosto on megatavuja.
      koko = Number(d.getBigUint64(p + 8));
      sisalto = p + 16;
    } else if (koko === 0) {
      koko = loppu - p;
    }
    if (koko < 8) return;
    yield { tyyppi, alku: p, loppu: Math.min(p + koko, loppu), sisalto };
    p += koko;
  }
}

function etsi(d: DataView, alku: number, loppu: number, polku: string[]): Laatikko | null {
  for (const b of laatikot(d, alku, loppu)) {
    if (b.tyyppi !== polku[0]) continue;
    if (polku.length === 1) return b;
    return etsi(d, b.sisalto, b.loppu, polku.slice(1));
  }
  return null;
}

/** stsd ja avc1 ovat "full box" + laskuri, joten sisalto alkaa myohemmin. */
function etsiAvc1(d: DataView, stsd: Laatikko): Laatikko | null {
  // stsd: 1 tavu versio + 3 tavua liput + 4 tavua entry_count
  for (const b of laatikot(d, stsd.sisalto + 8, stsd.loppu)) {
    if (b.tyyppi === "avc1" || b.tyyppi === "avc3") return b;
  }
  return null;
}

export function pura(puskuri: ArrayBuffer): Purettu {
  const d = new DataView(puskuri);
  const moov = etsi(d, 0, puskuri.byteLength, ["moov"]);
  if (!moov) throw new Error("mp4: moov puuttuu (fragmentoitu tiedosto?)");
  const stbl = etsi(d, moov.sisalto, moov.loppu, ["trak", "mdia", "minf", "stbl"]);
  const mdhd = etsi(d, moov.sisalto, moov.loppu, ["trak", "mdia", "mdhd"]);
  if (!stbl || !mdhd) throw new Error("mp4: stbl tai mdhd puuttuu");

  const mdhdVer = d.getUint8(mdhd.sisalto);
  const timescale = mdhdVer === 1 ? d.getUint32(mdhd.sisalto + 20) : d.getUint32(mdhd.sisalto + 12);

  const stsd = etsi(d, stbl.sisalto, stbl.loppu, ["stsd"]);
  const avc1 = stsd ? etsiAvc1(d, stsd) : null;
  if (!avc1) throw new Error("mp4: avc1 puuttuu");
  // avc1: 78 tavua VisualSampleEntrya ennen alilaatikoita
  const width = d.getUint16(avc1.sisalto + 24);
  const height = d.getUint16(avc1.sisalto + 26);
  let avcC: Laatikko | null = null;
  for (const b of laatikot(d, avc1.sisalto + 78, avc1.loppu)) {
    if (b.tyyppi === "avcC") avcC = b;
  }
  if (!avcC) throw new Error("mp4: avcC puuttuu");
  const description = new Uint8Array(puskuri, avcC.sisalto, avcC.loppu - avcC.sisalto);
  const hex = (n: number) => n.toString(16).padStart(2, "0");
  const codec = `avc1.${hex(description[1])}${hex(description[2])}${hex(description[3])}`;

  const taulu = (nimi: string) => etsi(d, stbl.sisalto, stbl.loppu, [nimi]);

  // stsz
  const stsz = taulu("stsz");
  if (!stsz) throw new Error("mp4: stsz puuttuu");
  const vakioKoko = d.getUint32(stsz.sisalto + 4);
  const maara = d.getUint32(stsz.sisalto + 8);
  const koot = new Uint32Array(maara);
  for (let i = 0; i < maara; i++) {
    koot[i] = vakioKoko || d.getUint32(stsz.sisalto + 12 + i * 4);
  }

  // stts -> dts
  const stts = taulu("stts");
  if (!stts) throw new Error("mp4: stts puuttuu");
  const sttsN = d.getUint32(stts.sisalto + 4);
  const dts = new Float64Array(maara);
  {
    let i = 0;
    let t = 0;
    for (let e = 0; e < sttsN; e++) {
      const n = d.getUint32(stts.sisalto + 8 + e * 8);
      const kesto = d.getUint32(stts.sisalto + 12 + e * 8);
      for (let k = 0; k < n && i < maara; k++, i++) {
        dts[i] = t;
        t += kesto;
      }
    }
  }

  // ctts -> cts. Puuttuu jos B-kehyksia ei ole.
  const cts = Float64Array.from(dts);
  const ctts = taulu("ctts");
  if (ctts) {
    const ver = d.getUint8(ctts.sisalto);
    const n = d.getUint32(ctts.sisalto + 4);
    let i = 0;
    for (let e = 0; e < n; e++) {
      const cnt = d.getUint32(ctts.sisalto + 8 + e * 8);
      // versio 1: etumerkillinen poikkeama
      const off = ver === 1 ? d.getInt32(ctts.sisalto + 12 + e * 8) : d.getUint32(ctts.sisalto + 12 + e * 8);
      for (let k = 0; k < cnt && i < maara; k++, i++) cts[i] = dts[i] + off;
    }
  }

  // stss -> avainkuvat. Puuttuminen tarkoittaa etta KAIKKI ovat avaimia.
  const sync = new Uint8Array(maara);
  const stss = taulu("stss");
  if (stss) {
    const n = d.getUint32(stss.sisalto + 4);
    for (let e = 0; e < n; e++) {
      const idx = d.getUint32(stss.sisalto + 8 + e * 4) - 1;
      if (idx >= 0 && idx < maara) sync[idx] = 1;
    }
  } else {
    sync.fill(1);
  }

  // stsc + stco -> tavusijainnit
  const stsc = taulu("stsc");
  const stco = taulu("stco");
  const co64 = taulu("co64");
  if (!stsc || (!stco && !co64)) throw new Error("mp4: stsc tai stco puuttuu");
  const lohkoja = stco ? d.getUint32(stco.sisalto + 4) : d.getUint32(co64!.sisalto + 4);
  const lohkoOff = (k: number) =>
    stco ? d.getUint32(stco.sisalto + 8 + k * 4) : Number(d.getBigUint64(co64!.sisalto + 8 + k * 8));

  const stscN = d.getUint32(stsc.sisalto + 4);
  const off = new Float64Array(maara);
  {
    let nayte = 0;
    for (let e = 0; e < stscN && nayte < maara; e++) {
      const eka = d.getUint32(stsc.sisalto + 8 + e * 12) - 1;
      const perLohko = d.getUint32(stsc.sisalto + 12 + e * 12);
      const viim = e + 1 < stscN ? d.getUint32(stsc.sisalto + 8 + (e + 1) * 12) - 1 : lohkoja;
      for (let k = eka; k < viim && nayte < maara; k++) {
        let p = lohkoOff(k);
        for (let j = 0; j < perLohko && nayte < maara; j++, nayte++) {
          off[nayte] = p;
          p += koot[nayte];
        }
      }
    }
  }

  /* NAYTTEET ESITYSJARJESTYKSEEN. Purkujarjestys ei ole esitysjarjestys
     B-kehysten kanssa, ja kaikki sivun logiikka puhuu ruutunumeroista
     eli esitysjarjestyksesta. Syotto tapahtuu silti purkujarjestyksessa,
     joten talletetaan molemmat. */
  const purkuJarj: Nayte[] = [];
  for (let i = 0; i < maara; i++) {
    purkuJarj.push({ off: off[i], koko: koot[i], cts: cts[i], sync: sync[i] === 1 });
  }
  return { naytteet: purkuJarj, codec, description, timescale, width, height };
}
