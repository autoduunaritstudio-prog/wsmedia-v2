import { seuraaPeittoa } from "./peitto";

/* JATKUVAT ANIMAATIOT TAUOLLE KUN NIITA EI NAE.

   Sivulla on animaatioita jotka pyorivat ikuisesti: valokuvien hidas
   sivuttaisliike (object-position), pystykaikujen hengitys, puhelinten
   ja lipukkeiden kellunta, kaavioiden pylvaat. Pinotussa vierityksessa
   aiemmat osiot jaavat pinnattuina seuraavan alle, joten niiden
   animaatiot jatkuivat nakymattomissa ja selain maalasi niita joka
   kehys. MITATTU 30.9.2026: valokuvaosioiden kohdalla vieritys putosi
   37 fps:iin.

   Animaatio pysaytetaan (animation-play-state: paused) kun sen osio on
   nakyman ulkopuolella TAI toisen osion peitossa, ja se jatkuu samasta
   kohdasta kun osio tulee taas nakyviin. Nakyvaa liiketta ei muuteta. */
const KOHTEET = [
  ".laatta.taysi > img",
  ".vaite.kuvallinen > img",
  ".seo-sec.kuvapohja > .pohjakuva",
  ".kaiku",
  ".km-pylvas",
  ".phone",
  ".chip-f",
];

export function tauotaPiilossa(): () => void {
  const ryhmat = new Map<HTMLElement, Element[]>();
  document.querySelectorAll(KOHTEET.join(",")).forEach((el) => {
    // Peitto luetaan osiosta, ei animoidusta elementista: moni niista on
    // pointer-events: none, jolloin osumatesti menisi sen lapi.
    const juuri = (el.closest("section, header, .laatta") as HTMLElement | null) ?? (el as HTMLElement);
    const r = ryhmat.get(juuri);
    if (r) r.push(el);
    else ryhmat.set(juuri, [el]);
  });

  const purut: (() => void)[] = [];
  const io = new IntersectionObserver(
    (es) => {
      for (const e of es) {
        const t = tila.get(e.target as HTMLElement);
        if (!t) continue;
        t.nakyy = e.isIntersecting;
        t.paivita();
      }
    },
    { rootMargin: "10% 0px" },
  );
  const tila = new Map<HTMLElement, { nakyy: boolean; peitossa: boolean; paivita: () => void }>();

  ryhmat.forEach((els, juuri) => {
    const t = {
      nakyy: true,
      peitossa: false,
      paivita: () => {
        const tauko = !t.nakyy || t.peitossa;
        for (const el of els) {
          if (tauko) el.setAttribute("data-tauko", "");
          else el.removeAttribute("data-tauko");
        }
      },
    };
    tila.set(juuri, t);
    io.observe(juuri);
    purut.push(
      seuraaPeittoa(juuri, (x) => {
        t.peitossa = x;
        t.paivita();
      }),
    );
  });

  return () => {
    io.disconnect();
    purut.forEach((f) => f());
    ryhmat.forEach((els) => els.forEach((el) => el.removeAttribute("data-tauko")));
  };
}
