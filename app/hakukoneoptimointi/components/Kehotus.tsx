/**
 * OSION PAATTAVA KEHOTUS.
 *
 * MITATTU ONGELMA: sivu on 18 736px eli 23 nakymaa, ja napit olivat
 * dokumentin kohdissa 567 (hero) ja 14 685 (hinnasto). Valiin jai
 * 14 118px eli 17,4 nakymaa ilman yhtaan nappia. Navin oma CTA on
 * visibility: hidden, koska se elaa kokoruudun valikossa, joten
 * vierittaessa ruudulla ei ollut yhtaan konversiopolkua.
 *
 * Pahinta oli se, etta tyhja vali osui tasan niihin osioihin jotka
 * rakentavat ostohalun: Palvelun sisalto, Paikallinen ja Mittarit.
 *
 * Kehotus ei ole banneri vaan osion viimeinen rivi. Se on saman
 * kuvakielen kalustoa kuin muukin sivu: ohut ylaviiva, monospace-
 * kick ja yksi lause. Nappi on aina sama, "Pyyda maksuton kartoitus",
 * koska se on pienin mahdollinen sitoumus ja sivu on jo kolmessa
 * kohdassa luvannut ettei kartoitus maksa eika sido. "Pyyda tarjous"
 * jaa hinnastoon, jossa lukija on jo valitsemassa tasoa.
 */
export default function Kehotus({ kick, children }: { kick: string; children: React.ReactNode }) {
  return (
    <div className="kehotus rv">
      <div className="kehotus-txt">
        <p className="kehotus-kick">{kick}</p>
        <p className="kehotus-lause">{children}</p>
      </div>
      <a className="btn mag" href="#tarjous">
        Pyydä maksuton kartoitus
      </a>
    </div>
  );
}
