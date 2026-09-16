/**
 * AVAINSANANAUHA.
 *
 * Nauha liikkui aiemmin vierityksen mukana data-parx:lla. Liike oli
 * hallittua mutta se oli silti liikettä jonka ainoa tehtava oli olla
 * liikettä, ja sivulta karsittiin kaikki vierityksen ohjaamat
 * mekaniikat. Nauha jaa paikalleen: sen sisalto on oikeaa dataa,
 * hakusanoja ja hakuvolyymeja, ja se kelpaa luettavaksi ilman etta se
 * liukuu ohi.
 */
const SANAT: [string, string][] = [
  ["hakukoneoptimointi", "1 900 / kk"],
  ["seo toimisto", "880 / kk"],
  ["hakukoneoptimointi hinta", "720 / kk"],
  ["seo palvelut", "590 / kk"],
  ["hakukoneoptimointi espoo", "260 / kk"],
  ["avainsanatutkimus", "210 / kk"],
  ["tekninen seo", "170 / kk"],
  ["google yritysprofiili", "1 300 / kk"],
  ["paikallinen hakukoneoptimointi", "140 / kk"],
];

export default function Tape() {
  return (
    <div className="seo-tapeband" aria-label="Esimerkkejä hakusanoista ja niiden hakuvolyymeista">
      <div className="seo-tape">
        <div className="seo-tapecopy">
          {SANAT.map(([sana, vol]) => (
            <span key={sana}>
              {sana}
              <em>{vol}</em>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
