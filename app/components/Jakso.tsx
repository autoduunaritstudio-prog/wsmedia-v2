import type { ReactNode } from "react";

import NetBackdrop from "./NetBackdrop";

/**
 * KAHDEN OSION YHTEINEN TAUSTA.
 *
 * Peittava osio tarvitsee umpinaisen pohjan, ja jokaisella omalla
 * NetBackdropilla on oma satunnainen pistekentta. Kaksi perakkaista
 * osiota omilla kerroksillaan nayttivat siksi silta etta kuviointi
 * katkeaa niiden valissa ja ne irtoavat toisistaan.
 *
 * Kaare ottaa pohjan ja kuvion itselleen, ja osiot sen sisalla ovat
 * lapinakyvia: yksi kentta, yksi katkeamaton kuvio kahden osion yli.
 *
 * Kaare on myos RYTMIVALINE. Pinossa jokainen lapsi on oma
 * peittovaiheensa, joten lyhyt osio yksin kahden hengahdyksen valissa
 * lukee vahingolta. Kaksi osiota samassa kaareessa on yksi vaihe, ja
 * silloin hengahdysten valit pysyvat samanmittaisina.
 *
 * Jaettu komponentti, koska sama kaare on nyt kahdella alasivulla:
 * kopio olisi eronnut alkuperaisesta ensimmaisessa korjauksessa.
 */
export default function Jakso({ children, merkit }: { children: ReactNode; merkit?: boolean }) {
  return (
    <div className="jakso-pari">
      {/* Merkit jatkuvat jakson yli: kaare on yksi, joten molemmat osiot
          jakavat saman kerroksen eivatka merkit katkea niiden valissa. */}
      <NetBackdrop mount="cover" merkit={merkit} />
      {children}
    </div>
  );
}
