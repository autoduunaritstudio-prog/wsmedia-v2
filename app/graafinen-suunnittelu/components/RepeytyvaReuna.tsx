import s from "./RepeytyvaReuna.module.css";

/**
 * REPEYTYNYT REUNA COVERIN YLAREUNASSA.
 *
 * Teippaus-heron prototyypissa repeytynyt paperireuna oli heron
 * alareunassa. Nyt se on sen pinnan reuna, joka nousee heron paalle:
 * cover repeaa auki kuin teippi. Muoto ja mitat ovat samat kuin
 * prototyypissa (sama siemenluku, sama aaltoilu), vain peilattuna
 * ylareunaan: paperisuikale ylempana, coverin oma vari sen alla.
 *
 * Reuna lasketaan kerran moduulin tasolla. Satunnaisuus tulee
 * siemenluvusta, joten palvelin ja selain tuottavat saman muodon.
 */
const N = 300;
function rnd(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}
function makeEdge(n: number, seed: number, amp: number) {
  const r = rnd(seed);
  const a: number[] = [];
  let w = 0;
  for (let i = 0; i <= n; i++) {
    w += (r() - 0.5) * amp * 0.9;
    w *= 0.93;
    a.push(w + (r() - 0.5) * amp * 0.7 + (r() < 0.08 ? (r() - 0.5) * amp * 2.2 : 0));
  }
  return a;
}
/* Korkeus 40px. Paperin ylareuna noin 20px ja coverin noin 34px
   laatikon ylareunasta, eli samat 6 + 14 px kuin prototyypissa. */
const H = 40;
function poly(edge: number[], off: number, amp: number) {
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) pts.push(`${((i / N) * 100).toFixed(2)}% ${(H - (off + edge[i] * amp)).toFixed(1)}px`);
  pts.push("100% 100%", "0% 100%");
  return `polygon(${pts.join(",")})`;
}
const PAPERI = poly(makeEdge(N, 11, 0.75), 20, 7);
const PINTA = poly(makeEdge(N, 29, 0.5), 6, 8);

export default function RepeytyvaReuna() {
  return (
    <div className={s.reuna} aria-hidden="true">
      <div className={s.paperi} style={{ clipPath: PAPERI }} />
      <div className={s.pinta} style={{ clipPath: PINTA }} />
    </div>
  );
}
