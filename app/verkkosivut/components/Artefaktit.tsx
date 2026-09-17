import { TREE, VS_ROWS } from "./sisalto";

/**
 * VERKKOSIVUSIVUN ARTEFAKTIT.
 *
 * Sama saanto kuin SEO-sivulla: artefakti ei ole kuva asiasta vaan se
 * asia. Jos artefaktin voisi siirtaa toisen otsikon alle, se on
 * koriste. Nama kolme eivat siirry mihinkaan:
 *
 *   Puu       sivuston oma rakenne osoitteina ja niiden hakusanoina
 *   Vertailu  mitatut latausajat kahdesta toteutustavasta
 *   Ikkuna    selainkehys jonka sisalla sivu on
 *
 * Ikkunakieli on sama kuin SEO-sivulla (.art-palkki, .art-pisteet),
 * koska kyse on samasta sivustosta: kaksi eri ikkunaa kahdella
 * alasivulla lukisi kahtena eri tuotteena.
 */

/** Sivuston rakenne osoitteina. Jokainen rivi on yksi sivu ja se haku
 *  jolla se pyrkii nakymaan, eli tasan se mita sivurakenne tarkoittaa. */
export function Puu() {
  return (
    <figure className="art art-puu">
      <div className="art-palkki">
        <span className="art-pisteet" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <code>sivustokartta</code>
        <b>esimerkki: lvi-yritys</b>
      </div>
      <ul>
        {TREE.map(([polku, haku]) => (
          <li key={polku}>
            <span className="puu-polku">{polku}</span>
            <span className="puu-haku">{haku}</span>
          </li>
        ))}
      </ul>
      <figcaption>
        Jokainen palvelu saa oman sivunsa ja oman hakunsa. Yhdelle etusivulle
        puristettuna ne kilpailisivat keskenään samasta tuloksesta.
      </figcaption>
    </figure>
  );
}

/** Mitatut erot kahden toteutustavan valilla. Palkki on suhteellinen,
 *  ja arviorivit ovat pelkkaa tekstia ilman palkkia: palkki lupaa
 *  mittausta, ja sita ei anneta sille mita ei ole mitattu. */
export function Vertailu() {
  return (
    <figure className="art art-vertailu">
      <div className="art-palkki">
        <span className="art-pisteet" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <code>mittaus</code>
        <b>valmispohja vs. koodattu</b>
      </div>
      <table className="vt">
        <thead>
          <tr>
            <th scope="col">Mitattava</th>
            <th scope="col">Valmispohja</th>
            <th scope="col">Koodattu</th>
          </tr>
        </thead>
        <tbody>
          {VS_ROWS.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              {[r.pohja, r.koodattu].map((cell, n) => (
                <td key={n} className={n === 1 ? "hyva" : ""}>
                  {Array.isArray(cell) ? (
                    <>
                      <span className="vt-palkki" style={{ width: cell[0] }} aria-hidden="true" />
                      <b>{cell[1]}</b>
                    </>
                  ) : (
                    <em>{cell}</em>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
