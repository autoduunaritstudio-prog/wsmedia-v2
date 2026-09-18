/* HERON VIERITYSELOKUVAN RAKENNUS.
 *
 * Lahde on hero_final.mp4: 1920x1080, 25 fps, tasan 151 ruutua, 6,040 s.
 * Ruutusarja oli aiemmin sama materiaali yksittaisina kuvatiedostoina,
 * eli 151 erillista pakattua kuvaa ilman ruutujen valista pakkausta.
 *
 * MITATTU LAHTEESTA (SSIM koko 1920x1080 resoluutiossa lahdetta vastaan):
 *
 *   avif-sarja (nykyinen)   4,96 MB   0,987   (koodin oma aiempi mittaus)
 *   h264 crf 23  GOP 12     2,72 MB   0,991
 *   h264 crf 26  GOP 12     1,94 MB   0,989   <- valittu
 *   h264 crf 29  GOP 12     1,43 MB   0,986
 *   av1  crf 34  GOP 12     3,61 MB   0,995
 *
 * crf 26 on ainoa kohta jossa tiedosto on alle puolet nykyisesta JA
 * tarkkuus on nykyista parempi. AV1 havisi tassa, koska GOP 12 vie siita
 * juuri sen edun jonka vuoksi se yleensa valitaan: pitkat ruutuvalit.
 * Yksi koodekki riittaa, ja h264 on se jolle WebCodecsin tuki on laajin.
 *
 * GOP 12 EI OLE PAKKAUSVALINTA VAAN KELAUSVALINTA. Purkaja paasee mihin
 * tahansa ruutuun purkamalla enintaan 12 ruutua avainkuvasta eteenpain.
 * Isompi GOP pienentaisi tiedostoa mutta tekisi nopeasta vierityksesta
 * kalliin, ja juuri nopea vieritys on se mika tata rasittaa.
 *
 * -sc_threshold 0 estaa kohtausvaihtoa lisaamasta ylimaaraisia
 * avainkuvia, jolloin GOP on oikeasti tasan 12 eika "korkeintaan 12".
 * +faststart siirtaa moov-atomin tiedoston alkuun, jotta demuksaus voi
 * alkaa ennen kuin koko tiedosto on ladattu.
 *
 * REV tiedostonimessa: ruudut ja elokuva ovat ikuisessa valimuistissa,
 * joten sisallon muuttuessa MYOS osoitteen on muututtava.
 *
 * KAKSI SIVUA, YKSI SKRIPTI. Etusivu ja /verkkosivut kayttavat samaa
 * lahdemateriaalin kasittelya, samoja pakkausvalintoja ja samaa
 * generoitua TS-vakiota. Skriptia EI kopioida toiseksi tiedostoksi:
 * kaksi kopiota tarkoittaa etta toisen pakkausvalinta muuttuu joskus
 * ilman toista, ja juuri ne valinnat ovat tassa se mika on mitattu.
 * Sivu valitaan komentoriviargumentilla:
 *
 *   node scripts/build-hero-film.mjs            (etusivu, oletus)
 *   node scripts/build-hero-film.mjs verkkosivut
 *
 * POSTER. Verkkosivut-sivulla ei ole valmista ruutusarjaa josta ruutu 0
 * loytyisi, joten se poimitaan tassa. Muoto on webp: koneen ffmpeg
 * 4.4.2 ei tue AVIFia lainkaan. Laatu mitataan SSIM:lla lahteen ruutua
 * 0 vastaan ja tavoite on >= 0,975 - poster on <picture>-elementin
 * LCP-kuva ja se mika nakyy siihen asti kunnes elokuva on purettu,
 * joten se ei ole pikkukuva vaan sivun ensivaikutelma.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SIVUT = {
  etusivu: {
    lahde: "hero_final.mp4",
    nimi: (rev) => `film-${rev}.mp4`,
    manifesti: "public/hero/film.json",
    ts: "app/components/film-tiedot.ts",
    /* Etusivun ruutu 0 on jo olemassa sarjan kuvana (/hero/d/001.webp),
       joten sita ei poimita uudelleen. */
    poster: null,
  },
  verkkosivut: {
    lahde: "verkkosivut_hero_final.mp4",
    nimi: (rev) => `verkkosivut-film-${rev}.mp4`,
    manifesti: "public/hero/verkkosivut-film.json",
    ts: "app/components/film-tiedot-verkkosivut.ts",
    poster: "verkkosivut-001.webp",
  },
};

const SIVU = process.argv[2] ?? "etusivu";
const CFG = SIVUT[SIVU];
if (!CFG) {
  console.error(`Tuntematon sivu: ${SIVU}. Vaihtoehdot: ${Object.keys(SIVUT).join(", ")}`);
  process.exit(1);
}

const REV = "v1";
const LAHDE = CFG.lahde;
const ULOS_DIR = "public/hero";
const NIMI = CFG.nimi(REV);
const CRF = 26;
const GOP = 12;
/* POSTERIN LAATU. 80 on alaraja: sisalto on tummaa ja tumman alueen
   porrastuminen nakyy webpissa ensimmaisena. Arvoa nostetaan kunnes
   SSIM >= 0,975. */
const POSTER_Q = [80, 86, 92];
const POSTER_SSIM = 0.975;

const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ["ignore", "pipe", "inherit"] }).toString();

const probe = JSON.parse(
  sh("ffprobe", [
    "-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,height,r_frame_rate,nb_frames",
    "-of", "json", LAHDE,
  ]),
).streams[0];

const [num, den] = probe.r_frame_rate.split("/").map(Number);
const fps = num / den;
const ruutuja = Number(probe.nb_frames);

mkdirSync(ULOS_DIR, { recursive: true });
sh("ffmpeg", [
  "-v", "error", "-y", "-i", LAHDE,
  "-c:v", "libx264", "-crf", String(CRF), "-preset", "slow",
  "-g", String(GOP), "-keyint_min", String(GOP), "-sc_threshold", "0",
  "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an",
  `${ULOS_DIR}/${NIMI}`,
]);

const koko = statSync(`${ULOS_DIR}/${NIMI}`).size;
const manifest = {
  rev: REV,
  src: `/hero/${NIMI}`,
  frames: ruutuja,
  fps,
  width: Number(probe.width),
  height: Number(probe.height),
  gop: GOP,
  bytes: koko,
};
writeFileSync(CFG.manifesti, JSON.stringify(manifest, null, 2) + "\n");

/* POSTER: LAHTEEN RUUTU 0.
   Poimitaan lahteesta eika pakatusta elokuvasta, koska poster on se
   mika nakyy ennen kuin elokuva on purettu - sen ei kuulu peria
   elokuvan pakkaushavioita. Laatu nostetaan portaittain kunnes SSIM
   tayttaa rajan, eika arvata kerralla. */
if (CFG.poster) {
  /* Valiaikaistiedostot jarjestelman tmp-hakemistoon, ei repoon: repoon
     kirjoitettu apufile jaa versionhallinnan nakoetaisyydelle ja sita
     joutuu siivoamaan kasin. */
  const ref = join(tmpdir(), "wsx-hero-ruutu0.png");
  sh("ffmpeg", ["-v", "error", "-y", "-i", LAHDE, "-frames:v", "1", "-f", "image2", ref]);
  let valittu = null;
  for (const q of POSTER_Q) {
    sh("ffmpeg", ["-v", "error", "-y", "-i", ref, "-quality", String(q), `${ULOS_DIR}/${CFG.poster}`]);
    /* ffmpegin ssim-suodin kirjoittaa yhteenvedon stderriin, joten se
       luetaan tiedostoon eika putkesta. */
    const log = join(tmpdir(), "wsx-hero-ssim.txt");
    sh("ffmpeg", [
      "-v", "error", "-y",
      "-i", `${ULOS_DIR}/${CFG.poster}`, "-i", ref,
      "-lavfi", `ssim=stats_file=${log}`, "-f", "null", "-",
    ]);
    const arvo = Number(readFileSync(log, "utf8").match(/All:([\d.]+)/)?.[1] ?? 0);
    valittu = { q, ssim: arvo };
    if (arvo >= POSTER_SSIM) break;
  }
  const pkoko = statSync(`${ULOS_DIR}/${CFG.poster}`).size;
  console.log(
    `${CFG.poster}: laatu ${valittu.q}, SSIM ${valittu.ssim.toFixed(4)} ` +
      `(raja ${POSTER_SSIM}), ${(pkoko / 1024).toFixed(0)} kt`,
  );
  if (valittu.ssim < POSTER_SSIM) {
    console.error("VAROITUS: poster jai laaturajan alle.");
  }
}

/* SAMA TIETO MYOS TS-VAKIONA. Komponentti tarvitsee osoitteen ja
   ruutumaaran kaannosaikana, eika niita saa kirjoittaa kasin kahteen
   paikkaan: REV nousee ja toinen jaa jalkeen. Tiedosto on generoitu,
   joten sita ei muokata kasin. */
writeFileSync(
  CFG.ts,
  `/* GENEROITU: scripts/build-hero-film.mjs ${SIVU}. Ala muokkaa kasin. */\n` +
    `export const FILM = {\n` +
    `  src: ${JSON.stringify(manifest.src)},\n` +
    `  frames: ${manifest.frames},\n` +
    `  width: ${manifest.width},\n` +
    `  height: ${manifest.height},\n` +
    `} as const;\n`,
);

console.log(
  `${NIMI}: ${ruutuja} ruutua, ${probe.width}x${probe.height}, ${fps} fps, ` +
    `${(koko / 1024 / 1024).toFixed(2)} MB, GOP ${GOP}`,
);
