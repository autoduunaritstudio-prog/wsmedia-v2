"use client";

import { useState } from "react";

import { CONTACT } from "./site-data";

/**
 * SOITA-NAPPI KAHDESSA VAIHEESSA.
 *
 * Ensimmainen painallus paljastaa numeron, toinen soittaa. Syy on etta
 * pelkka "Soita" ei kerro mihin numeroon ollaan soittamassa, ja
 * tyopoydalla tel: ei valttamatta avaa mitaan - siella numero on ainoa
 * hyodyllinen lopputulos. Molemmilla laitteilla ensimmainen painallus
 * siis antaa jotain.
 *
 * ELEMENTTI VAIHTUU, EI VAIN TEKSTI: ennen paljastusta tama on <button>,
 * koska se ei navigoi minnekaan, ja paljastuksen jalkeen <a href="tel:">,
 * jolloin kayttaja saa linkin oikeat oikeudet - pitkan painalluksen
 * valikon, kopioinnin ja avauksen uudessa valilehdessa.
 *
 * autoFocus paljastuksen jalkeen pitaisi fokuksen napissa, mutta se myos
 * vierittaisi sivua joillakin selaimilla; koska nappi on jo fokuksessa
 * kun sita on juuri painettu, ja React sailyttaa fokuksen samassa
 * kohdassa puuta olevalle elementille, sita ei tarvita.
 */
export default function CallButton({ className = "" }: { className?: string }) {
  const [shown, setShown] = useState(false);

  if (!shown) {
    return (
      <button
        type="button"
        className={`btn alt proc-call ${className}`.trim()}
        onClick={() => setShown(true)}
      >
        Soita
      </button>
    );
  }

  return (
    <a className={`btn alt proc-call is-shown ${className}`.trim()} href={CONTACT.phoneHref}>
      <b>{CONTACT.phone}</b>
    </a>
  );
}
