/* TIETOSUOJA: PUHELINVERSIO (6.10.2026).

   Porttaus suunnitelmasta _mobiili-design/sivut/Tietosuoja.dc.html: rakenne,
   tekstit, tyylit ja jarjestys sellaisenaan. Merkinta on muunnettu
   koneellisesti (dc2jsx.mjs + tyokalut/pienet.py) ja vierityksen arvot on
   korvattu alkutilalla (y = 0). Naytetaan vain max-width: 767px.

   Suunnitelman oma ylapalkki, valikkolinkki ja CTA-pilleri korvataan
   yhteisella Kuorella (tapa="pieni"); footer on suunnitelman oma.
   Sisallysluettelo ja sen paikka ylapalkin mukaan ovat Efektit.tsx:ssa.
   Paljastukset (suunnitelman data-seur-tarkkailu) tekee Moottori: kaikki
   sisalto on merkinnassa alusta asti, joten yksi tarkkailu riittaa.
   Ankkurit: Moottori hyppaa kohteeseen -76 px; id on 64 px osion
   ylapuolella olevassa merkissa, jolloin osio paatyy samaan kohtaan kuin
   suunnitelman scroll-margin-top: 140px. */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "./mobiili.css";
import "./lisat.css";
import Kuori from "@/app/components/mobiili/Kuori";
import Moottori from "@/app/components/mobiili/Moottori";
import Efektit from "./Efektit";


export default function TietosuojaMobiili() {
  return (
    <div className="mo-root mo-s-tietosuoja">
      <div style={{ position: "relative", background: "#0b1320", color: "#fff", fontFamily: "var(--font-instrument), system-ui, sans-serif" }}>
        {" "}
        {/* HERO */}
        {" "}
        <header style={{ position: "relative", padding: "112px 20px 40px", background: "radial-gradient(120% 60% at 85% 0%, #1d3453 0%, #0b1320 62%)" }}>
          {" "}
          <span className="mo-m-kick mo-li mo-d1">
            {"WS Media Oy"}
          </span>
          {" "}
          <h1 className="mo-li mo-d1" style={{ margin: "10px 0 0", fontSize: "40px", lineHeight: "1.05", letterSpacing: "-0.035em", fontWeight: "700" }}>
            {"Tietosuojaseloste"}
          </h1>
          {" "}
          <p className="mo-li mo-d2" style={{ margin: "18px 0 0", fontSize: "16.5px", lineHeight: "1.6", color: "rgba(255,255,255,.8)" }}>
            {"Tällä sivulla kerromme, mitä tietoja keräämme, mihin niitä käytetään ja kuinka kauan niitä säilytetään. Seuranta- ja mainosevästeet otetaan käyttöön vain suostumuksellasi."}
          </p>
          {" "}
          <p className="mo-li mo-d2" style={{ margin: "14px 0 0", fontSize: "14px", color: "rgba(255,255,255,.55)" }}>
            {"Päivitetty 8.10.2026"}
          </p>
          {" "}
          <aside className="mo-li mo-d3" aria-label="Tietosuoja lyhyesti" style={{ marginTop: "28px", padding: "22px 20px 20px", borderRadius: "22px", background: "#eef1f5", color: "#11151a", boxShadow: "0 30px 60px -30px rgba(0,0,0,.8)" }}>
            {" "}
            <p style={{ margin: "0 0 6px", fontSize: "13px", fontWeight: "700", letterSpacing: ".06em", color: "#00697a" }}>
              {"Lyhyesti"}
            </p>
            {" "}
            <dl style={{ margin: "0" }}>
              {" "}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "14px", padding: "13px 0", borderBottom: "1px solid rgba(17,21,26,.1)" }}>
                <dt style={{ fontSize: "14.5px", color: "#4a5560" }}>
                  {"Rekisterinpitäjä"}
                </dt>
                <dd style={{ margin: "0", fontSize: "15.5px", fontWeight: "600", textAlign: "right" }}>
                  {"WS Media Oy"}
                </dd>
              </div>
              {" "}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "14px", padding: "13px 0", borderBottom: "1px solid rgba(17,21,26,.1)" }}>
                <dt style={{ fontSize: "14.5px", color: "#4a5560" }}>
                  {"Seurantaevästeet"}
                </dt>
                <dd style={{ margin: "0", fontSize: "15.5px", fontWeight: "600", textAlign: "right" }}>
                  {"Vain suostumuksellasi"}
                </dd>
              </div>
              {" "}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "14px", padding: "13px 0", borderBottom: "1px solid rgba(17,21,26,.1)" }}>
                <dt style={{ fontSize: "14.5px", color: "#4a5560" }}>
                  {"Tietojen myynti"}
                </dt>
                <dd style={{ margin: "0", fontSize: "15.5px", fontWeight: "600", textAlign: "right" }}>
                  {"Emme myy tietoja"}
                </dd>
              </div>
              {" "}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "14px", padding: "13px 0" }}>
                <dt style={{ fontSize: "14.5px", color: "#4a5560" }}>
                  {"Tietopyynnöt"}
                </dt>
                <dd style={{ margin: "0", fontSize: "15.5px", fontWeight: "600", textAlign: "right" }}>
                  <a href="mailto:info@wsmedia.fi" style={{ color: "#00697a" }}>
                    {"info@wsmedia.fi"}
                  </a>
                </dd>
              </div>
              {" "}
            </dl>
            {" "}
            <button type="button" data-mo-evasteet="" className="mo-m-btn" style={{ marginTop: "12px", width: "100%", height: "48px", fontSize: "15px", background: "#007c8f", color: "#fff" }}>
              {"Evästeasetukset"}
            </button>
            {" "}
          </aside>
          {" "}
        </header>
        {" "}
        {/* DOKUMENTTI */}
        {" "}
        <div style={{ position: "relative", padding: "4px 20px 64px" }}>
          {" "}
          <nav className="mo-ts-toc" aria-label="Sisällys" data-toc="" style={{ position: "sticky", top: "76px", zIndex: "4", transform: "translateY(0px)", transition: "transform .3s ease" }}>
            {" "}
            <button type="button" data-toc-nappi="" aria-expanded="false" aria-controls="m-toc-lista" style={{ width: "100%", height: "52px", padding: "0 16px 0 18px", borderRadius: "999px", border: "1px solid rgba(255,255,255,.16)", background: "rgba(16,27,44,.94)", color: "#fff", font: "inherit", fontSize: "15.5px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", boxShadow: "0 14px 30px -14px rgba(0,0,0,.8)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "10px", width: "auto", fontSize: "15.5px", color: "#fff" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6fecff" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 6h16M4 12h16M4 18h10"></path>
                </svg>
                {"Sisällys"}
              </span>
              <svg className="mo-ts-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </button>
            {" "}
            <div className="mo-m-vast" id="m-toc-lista" data-toc-lista="" hidden style={{ position: "absolute", left: "0", right: "0", top: "60px", maxHeight: "470px", overflowY: "auto", padding: "8px", borderRadius: "20px", background: "#16263d", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 30px 60px -20px rgba(0,0,0,.9)" }}>
                  {" "}
                  <ol style={{ margin: "0", padding: "0", listStyle: "none" }}>
                    {" "}
                    <li>
                      <a href="#m-rekisterinpitaja">
                        <span>
                          {"1"}
                        </span>
                        {"Rekisterinpitäjä"}
                      </a>
                    </li>
                    {" "}
                    <li>
                      <a href="#m-tiedot">
                        <span>
                          {"2"}
                        </span>
                        {"Käsiteltävät tiedot"}
                      </a>
                    </li>
                    {" "}
                    <li>
                      <a href="#m-tarkoitus">
                        <span>
                          {"3"}
                        </span>
                        {"Tarkoitukset"}
                      </a>
                    </li>
                    {" "}
                    <li>
                      <a href="#m-evasteet">
                        <span>
                          {"4"}
                        </span>
                        {"Evästeet"}
                      </a>
                    </li>
                    {" "}
                    <li>
                      <a href="#m-vastaanottajat">
                        <span>
                          {"5"}
                        </span>
                        {"Palveluntarjoajat"}
                      </a>
                    </li>
                    {" "}
                    <li>
                      <a href="#m-siirrot">
                        <span>
                          {"6"}
                        </span>
                        {"Siirrot EU:n ulkopuolelle"}
                      </a>
                    </li>
                    {" "}
                    <li>
                      <a href="#m-sailytys">
                        <span>
                          {"7"}
                        </span>
                        {"Säilytysajat"}
                      </a>
                    </li>
                    {" "}
                    <li>
                      <a href="#m-tietoturva">
                        <span>
                          {"8"}
                        </span>
                        {"Tietoturva"}
                      </a>
                    </li>
                    {" "}
                    <li>
                      <a href="#m-oikeudet">
                        <span>
                          {"9"}
                        </span>
                        {"Oikeutesi"}
                      </a>
                    </li>
                    {" "}
                    <li>
                      <a href="#m-muutokset">
                        <span>
                          {"10"}
                        </span>
                        {"Muutokset"}
                      </a>
                    </li>
                    {" "}
                  </ol>
                  {" "}
                </div>
            {" "}
          </nav>
          {" "}
          {/* 1 */}
          {" "}
          <span id="m-rekisterinpitaja" aria-hidden="true" style={{ display: "block", position: "relative", top: "-64px", height: "0" }}></span>
          <section className="mo-ts-sec" aria-labelledby="m-rekisterinpitaja-h">
            {" "}
            <h2 id="m-rekisterinpitaja-h" className="mo-ts-h mo-rv">
              <span className="mo-ts-num">
                {"1"}
              </span>
              {"Rekisterinpitäjä ja yhteystiedot"}
            </h2>
            {" "}
            <div className="mo-ts-body">
              {" "}
              <address className="mo-ts-kortti mo-rv mo-d1" style={{ fontStyle: "normal", fontSize: "16px", lineHeight: "1.7", color: "rgba(255,255,255,.8)" }}>
                <b style={{ color: "#fff", fontSize: "17px" }}>
                  {"WS Media Oy"}
                </b>
                <br />
                {"Y-tunnus 3615084-4"}
                <br />
                {"Kuusiniementie 8 F, 02710 Espoo"}
                <br />
                <a href="mailto:info@wsmedia.fi">
                  {"info@wsmedia.fi"}
                </a>
                {", "}
                <a href="tel:+358405648770">
                  {"040 564 8770"}
                </a>
              </address>
              {" "}
              <p className="mo-rv mo-d1">
                {"Tietosuojaa koskevissa asioissa yhteyshenkilö on Tuomas Ivanov. Tavoitat hänet osoitteesta "}
                <a href="mailto:info@wsmedia.fi">
                  {"info@wsmedia.fi"}
                </a>
                {"."}
              </p>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* 2 */}
          {" "}
          <span id="m-tiedot" aria-hidden="true" style={{ display: "block", position: "relative", top: "-64px", height: "0" }}></span>
          <section className="mo-ts-sec" aria-labelledby="m-tiedot-h">
            {" "}
            <h2 id="m-tiedot-h" className="mo-ts-h mo-rv">
              <span className="mo-ts-num">
                {"2"}
              </span>
              {"Mitä tietoja käsittelemme"}
            </h2>
            {" "}
            <div className="mo-ts-body">
              {" "}
              <p className="mo-ts-sub mo-rv">
                {"Yhteydenotto ja tarjouspyyntö"}
              </p>
              {" "}
              <p className="mo-rv">
                {"Kun lähetät viestin tai tarjouspyynnön sivuston lomakkeella, saamme antamasi tiedot: nimen, sähköpostiosoitteen, puhelinnumeron, yrityksen nimen ja paikkakunnan, valitsemasi palvelut ja budjetin sekä viestisi sisällön."}
              </p>
              {" "}
              <p className="mo-ts-sub mo-rv">
                {"Kartoituksen ajanvaraus"}
              </p>
              {" "}
              <p className="mo-rv">
                {"Ajanvarauksessa saamme yrityksen nimen, yhteyshenkilön nimen, puhelinnumeron ja sähköpostiosoitteen, valitun ajan ja tapaamistavan sekä mahdolliset lisätiedot. Jos kartoitus tehdään paikan päällä, saamme myös käyntiosoitteen."}
              </p>
              {" "}
              <p className="mo-ts-sub mo-rv">
                {"Työhakemus"}
              </p>
              {" "}
              <p className="mo-rv">
                {"Hakemuksesta saamme nimen, yhteystiedot, paikkakunnan, osaamisalueet, linkit työnäytteisiin, palkka- tai hintatoiveen sekä viestin ja liitteet, jotka lähetät meille."}
              </p>
              {" "}
              <p className="mo-ts-sub mo-rv">
                {"Asiakkuus"}
              </p>
              {" "}
              <p className="mo-rv">
                {"Asiakassuhteen aikana käsittelemme yhteyshenkilöiden tietoja, sopimus- ja laskutustietoja sekä yhteydenpitoa."}
              </p>
              {" "}
              <p className="mo-ts-sub mo-rv">
                {"Sivuston käyttö"}
              </p>
              {" "}
              <p className="mo-rv">
                {"Palvelin kirjaa teknisiä lokitietoja, kuten IP-osoitteen, käynnin ajankohdan ja selaimen tiedot. Jos hyväksyt analytiikka- ja markkinointievästeet, saamme lisäksi tietoja siitä, miten sivustoa käytetään (kohta 4)."}
              </p>
              {" "}
              <p className="mo-rv">
                {"Tiedot saadaan pääosin sinulta itseltäsi tai sivuston käytöstä. Yritysten yhteyshenkilöiden tietoja voimme saada myös julkisista lähteistä, kuten yrityksen verkkosivuilta ja kaupparekisteristä."}
              </p>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* 3 */}
          {" "}
          <span id="m-tarkoitus" aria-hidden="true" style={{ display: "block", position: "relative", top: "-64px", height: "0" }}></span>
          <section className="mo-ts-sec" aria-labelledby="m-tarkoitus-h">
            {" "}
            <h2 id="m-tarkoitus-h" className="mo-ts-h mo-rv">
              <span className="mo-ts-num">
                {"3"}
              </span>
              {"Käsittelyn tarkoitukset ja oikeusperusteet"}
            </h2>
            {" "}
            <div className="mo-ts-body">
              {" "}
              <ul className="mo-ts-list">
                {" "}
                <li className="mo-rv">
                  <b>
                    {"Yhteydenottoihin ja tarjouspyyntöihin vastaaminen sekä kartoitusten järjestäminen."}
                  </b>
                  {" Peruste: sopimuksen valmistelu (tietosuoja-asetuksen 6 artiklan 1 kohdan b alakohta)."}
                </li>
                {" "}
                <li className="mo-rv">
                  <b>
                    {"Palvelujen toimittaminen ja asiakassuhteen hoitaminen."}
                  </b>
                  {" Peruste: sopimus (b alakohta)."}
                </li>
                {" "}
                <li className="mo-rv">
                  <b>
                    {"Rekrytointi."}
                  </b>
                  {" Peruste: toimet hakijan pyynnöstä ennen sopimuksen tekemistä (b alakohta)."}
                </li>
                {" "}
                <li className="mo-rv">
                  <b>
                    {"Sivuston toiminta ja tietoturva."}
                  </b>
                  {" Peruste: oikeutettu etu (f alakohta)."}
                </li>
                {" "}
                <li className="mo-rv">
                  <b>
                    {"Kävijäanalytiikka, mainonnan mittaaminen (Google Ads ja Meta) ja Meta-mainonnan kohdentaminen."}
                  </b>
                  {" Peruste: suostumus (a alakohta), jonka voit perua milloin tahansa."}
                </li>
                {" "}
                <li className="mo-rv">
                  <b>
                    {"Markkinointi asiakkaille ja yhteistyökumppaneille."}
                  </b>
                  {" Peruste: oikeutettu etu (f alakohta). Voit kieltää suoramarkkinoinnin milloin tahansa."}
                </li>
                {" "}
                <li className="mo-rv">
                  <b>
                    {"Kirjanpito ja muut lakisääteiset velvoitteet."}
                  </b>
                  {" Peruste: lakisääteinen velvoite (c alakohta)."}
                </li>
                {" "}
              </ul>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* 4 */}
          {" "}
          <span id="m-evasteet" aria-hidden="true" style={{ display: "block", position: "relative", top: "-64px", height: "0" }}></span>
          <section className="mo-ts-sec" aria-labelledby="m-evasteet-h">
            {" "}
            <h2 id="m-evasteet-h" className="mo-ts-h mo-rv">
              <span className="mo-ts-num">
                {"4"}
              </span>
              {"Evästeet"}
            </h2>
            {" "}
            <div className="mo-ts-body">
              {" "}
              <p className="mo-rv">
                {"Evästeet ovat pieniä tiedostoja, jotka sivusto tallentaa selaimeesi. Välttämätön tallenne on aina käytössä. Analytiikka- ja markkinointievästeet otetaan käyttöön vain, jos hyväksyt ne evästeilmoituksessa. Ennen suostumusta sivusto ei lataa Googlen eikä Metan seurantakoodeja."}
              </p>
              {" "}
              <div role="region" aria-label="Sivuston evästeet" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {" "}
                <div className="mo-ts-kortti mo-rv" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {" "}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                    <div>
                      <span className="mo-ts-pieni">
                        {"Eväste"}
                      </span>
                      <code className="mo-ts-koodi">
                        {"wsmedia.consent"}
                      </code>
                    </div>
                    <span className="mo-ts-tyyppi mo-ts-tyyppi-v">
                      {"Välttämätön"}
                    </span>
                  </div>
                  {" "}
                  <div>
                    <span className="mo-ts-pieni">
                      {"Palvelu ja tarkoitus"}
                    </span>
                    <p style={{ margin: "0", fontSize: "15.5px", lineHeight: "1.55", color: "rgba(255,255,255,.78)" }}>
                      <b>
                        {"WS Media."}
                      </b>
                      {" Muistaa evästevalintasi, jotta kysymystä ei näytetä joka käynnillä."}
                    </p>
                  </div>
                  {" "}
                  <div style={{ paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span className="mo-ts-pieni" style={{ margin: "0" }}>
                      {"Säilyy"}
                    </span>
                    <b style={{ fontSize: "15.5px" }}>
                      {"180 päivää"}
                    </b>
                  </div>
                  {" "}
                </div>
                {" "}
                <div className="mo-ts-kortti mo-rv" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {" "}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                    <div>
                      <span className="mo-ts-pieni">
                        {"Eväste"}
                      </span>
                      <code className="mo-ts-koodi">
                        {"_ga"}
                      </code>
                    </div>
                    <span className="mo-ts-tyyppi mo-ts-tyyppi-s">
                      {"Analytiikka"}
                    </span>
                  </div>
                  {" "}
                  <div>
                    <span className="mo-ts-pieni">
                      {"Palvelu ja tarkoitus"}
                    </span>
                    <p style={{ margin: "0", fontSize: "15.5px", lineHeight: "1.55", color: "rgba(255,255,255,.78)" }}>
                      <b>
                        {"Google Analytics 4."}
                      </b>
                      {" Erottaa kävijät toisistaan kävijätilastoissa."}
                    </p>
                  </div>
                  {" "}
                  <div style={{ paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span className="mo-ts-pieni" style={{ margin: "0" }}>
                      {"Säilyy"}
                    </span>
                    <b style={{ fontSize: "15.5px" }}>
                      {"2 vuotta"}
                    </b>
                  </div>
                  {" "}
                </div>
                {" "}
                <div className="mo-ts-kortti mo-rv" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {" "}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                    <div>
                      <span className="mo-ts-pieni">
                        {"Eväste"}
                      </span>
                      <code className="mo-ts-koodi">
                        {"_ga_<tunnus>"}
                      </code>
                    </div>
                    <span className="mo-ts-tyyppi mo-ts-tyyppi-s">
                      {"Analytiikka"}
                    </span>
                  </div>
                  {" "}
                  <div>
                    <span className="mo-ts-pieni">
                      {"Palvelu ja tarkoitus"}
                    </span>
                    <p style={{ margin: "0", fontSize: "15.5px", lineHeight: "1.55", color: "rgba(255,255,255,.78)" }}>
                      <b>
                        {"Google Analytics 4."}
                      </b>
                      {" Pitää kirjaa käyntikerrasta."}
                    </p>
                  </div>
                  {" "}
                  <div style={{ paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span className="mo-ts-pieni" style={{ margin: "0" }}>
                      {"Säilyy"}
                    </span>
                    <b style={{ fontSize: "15.5px" }}>
                      {"2 vuotta"}
                    </b>
                  </div>
                  {" "}
                </div>
                {" "}
                <div className="mo-ts-kortti mo-rv" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {" "}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                    <div>
                      <span className="mo-ts-pieni">
                        {"Eväste"}
                      </span>
                      <code className="mo-ts-koodi">
                        {"_gcl_au"}
                      </code>
                    </div>
                    <span className="mo-ts-tyyppi mo-ts-tyyppi-s">
                      {"Markkinointi"}
                    </span>
                  </div>
                  {" "}
                  <div>
                    <span className="mo-ts-pieni">
                      {"Palvelu ja tarkoitus"}
                    </span>
                    <p style={{ margin: "0", fontSize: "15.5px", lineHeight: "1.55", color: "rgba(255,255,255,.78)" }}>
                      <b>
                        {"Google Ads."}
                      </b>
                      {" Liittää sivustolla tehdyn yhteydenoton Google-mainoksen klikkaukseen, jotta mainonnan tuloksia voidaan mitata."}
                    </p>
                  </div>
                  {" "}
                  <div style={{ paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span className="mo-ts-pieni" style={{ margin: "0" }}>
                      {"Säilyy"}
                    </span>
                    <b style={{ fontSize: "15.5px" }}>
                      {"90 päivää"}
                    </b>
                  </div>
                  {" "}
                </div>
                {" "}
                <div className="mo-ts-kortti mo-rv" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {" "}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                    <div>
                      <span className="mo-ts-pieni">
                        {"Eväste"}
                      </span>
                      <code className="mo-ts-koodi">
                        {"_fbp"}
                      </code>
                    </div>
                    <span className="mo-ts-tyyppi mo-ts-tyyppi-s">
                      {"Markkinointi"}
                    </span>
                  </div>
                  {" "}
                  <div>
                    <span className="mo-ts-pieni">
                      {"Palvelu ja tarkoitus"}
                    </span>
                    <p style={{ margin: "0", fontSize: "15.5px", lineHeight: "1.55", color: "rgba(255,255,255,.78)" }}>
                      <b>
                        {"Meta Pixel."}
                      </b>
                      {" Tunnistaa selaimen, jotta Facebook- ja Instagram-mainosten tuloksia voidaan mitata ja mainoksia kohdentaa."}
                    </p>
                  </div>
                  {" "}
                  <div style={{ paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span className="mo-ts-pieni" style={{ margin: "0" }}>
                      {"Säilyy"}
                    </span>
                    <b style={{ fontSize: "15.5px" }}>
                      {"90 päivää"}
                    </b>
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              <p className="mo-rv">
                {"Google Search Consolen avulla seuraamme, millä hauilla sivusto näkyy Googlessa. Se ei aseta sivustolla evästeitä, ja sen kautta saamme vain koostettuja tilastoja."}
              </p>
              {" "}
              <p className="mo-rv">
                {"Voit muuttaa tai perua suostumuksesi milloin tahansa: "}
                <button type="button" data-mo-evasteet="" className="mo-ts-linkki">
                  {"avaa evästeasetukset"}
                </button>
                {". Evästeet voi poistaa myös selaimen asetuksista."}
              </p>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* 5 */}
          {" "}
          <span id="m-vastaanottajat" aria-hidden="true" style={{ display: "block", position: "relative", top: "-64px", height: "0" }}></span>
          <section className="mo-ts-sec" aria-labelledby="m-vastaanottajat-h">
            {" "}
            <h2 id="m-vastaanottajat-h" className="mo-ts-h mo-rv">
              <span className="mo-ts-num">
                {"5"}
              </span>
              {"Palveluntarjoajat ja tietojen luovutus"}
            </h2>
            {" "}
            <div className="mo-ts-body">
              {" "}
              <p className="mo-rv">
                {"Seuraavat palveluntarjoajat käsittelevät tietoja meidän lukuumme ja sopimustemme mukaisesti:"}
              </p>
              {" "}
              <dl className="mo-ts-kortti mo-rv" style={{ margin: "0", padding: "4px 18px" }}>
                {" "}
                <div style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                  <dt style={{ fontSize: "16px", fontWeight: "700" }}>
                    {"Google Ireland Limited"}
                  </dt>
                  <dd style={{ margin: "4px 0 0", fontSize: "15.5px", lineHeight: "1.55", color: "rgba(255,255,255,.72)" }}>
                    {"Sähköposti ja kalenteri (Google Workspace), kartoitusten ajanvaraus, Google Analytics 4, Google Ads -mainonnan mittaaminen ja Google Search Console."}
                  </dd>
                </div>
                {" "}
                <div style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                  <dt style={{ fontSize: "16px", fontWeight: "700" }}>
                    {"Resend, Inc. (Yhdysvallat)"}
                  </dt>
                  <dd style={{ margin: "4px 0 0", fontSize: "15.5px", lineHeight: "1.55", color: "rgba(255,255,255,.72)" }}>
                    {"Sivuston lomakkeilta lähetettyjen viestien ja vahvistusviestien sähköpostitoimitus."}
                  </dd>
                </div>
                {" "}
                <div style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                  <dt style={{ fontSize: "16px", fontWeight: "700" }}>
                    {"Vercel Inc. (Yhdysvallat)"}
                  </dt>
                  <dd style={{ margin: "4px 0 0", fontSize: "15.5px", lineHeight: "1.55", color: "rgba(255,255,255,.72)" }}>
                    {"Sivuston palvelin ja sen tekniset lokitiedot."}
                  </dd>
                </div>
                {" "}
                <div style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                  <dt style={{ fontSize: "16px", fontWeight: "700" }}>
                    {"Meta Platforms Ireland Limited"}
                  </dt>
                  <dd style={{ margin: "4px 0 0", fontSize: "15.5px", lineHeight: "1.55", color: "rgba(255,255,255,.72)" }}>
                    {"Meta Pixel: Facebook- ja Instagram-mainonnan mittaaminen ja kohdentaminen."}
                  </dd>
                </div>
                {" "}
                <div style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                  <dt style={{ fontSize: "16px", fontWeight: "700" }}>
                    {"Microsoft Ireland Operations Limited"}
                  </dt>
                  <dd style={{ margin: "4px 0 0", fontSize: "15.5px", lineHeight: "1.55", color: "rgba(255,255,255,.72)" }}>
                    {"Teams-etätapaamiset."}
                  </dd>
                </div>
                {" "}
                <div style={{ padding: "14px 0" }}>
                  <dt style={{ fontSize: "16px", fontWeight: "700" }}>
                    {"Kirjanpidon ja laskutuksen palveluntarjoajat"}
                  </dt>
                  <dd style={{ margin: "4px 0 0", fontSize: "15.5px", lineHeight: "1.55", color: "rgba(255,255,255,.72)" }}>
                    {"Laskutus, verkkolaskujen välitys (Apix Messaging Oy) ja lakisääteinen kirjanpito."}
                  </dd>
                </div>
                {" "}
              </dl>
              {" "}
              <p className="mo-rv">
                {"Meta Pixelin tietojen keräämisessä WS Media ja Meta ovat yhteisrekisterinpitäjiä. Meta käyttää tietoja myös omiin tarkoituksiinsa "}
                <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">
                  {"Metan tietosuojakäytännön"}
                </a>
                {" mukaisesti. Googlen käsittelystä kerrotaan "}
                <a href="https://policies.google.com/privacy?hl=fi" target="_blank" rel="noopener noreferrer">
                  {"Googlen tietosuojakäytännössä"}
                </a>
                {"."}
              </p>
              {" "}
              <p className="mo-rv">
                {"Emme myy henkilötietoja. Viranomaisille luovutamme tietoja vain silloin, kun laki sitä edellyttää."}
              </p>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* 6 */}
          {" "}
          <span id="m-siirrot" aria-hidden="true" style={{ display: "block", position: "relative", top: "-64px", height: "0" }}></span>
          <section className="mo-ts-sec" aria-labelledby="m-siirrot-h">
            {" "}
            <h2 id="m-siirrot-h" className="mo-ts-h mo-rv">
              <span className="mo-ts-num">
                {"6"}
              </span>
              {"Siirrot EU:n ja ETA:n ulkopuolelle"}
            </h2>
            {" "}
            <div className="mo-ts-body">
              {" "}
              <p className="mo-rv">
                {"Google, Meta, Microsoft, Vercel ja Resend voivat käsitellä tietoja myös Yhdysvalloissa. Siirrot perustuvat EU:n ja Yhdysvaltojen väliseen tietosuojakehykseen (Data Privacy Framework), jos palveluntarjoaja on sitoutunut siihen. Muissa tapauksissa siirrot perustuvat Euroopan komission hyväksymiin vakiosopimuslausekkeisiin."}
              </p>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* 7 */}
          {" "}
          <span id="m-sailytys" aria-hidden="true" style={{ display: "block", position: "relative", top: "-64px", height: "0" }}></span>
          <section className="mo-ts-sec" aria-labelledby="m-sailytys-h">
            {" "}
            <h2 id="m-sailytys-h" className="mo-ts-h mo-rv">
              <span className="mo-ts-num">
                {"7"}
              </span>
              {"Kuinka kauan tietoja säilytetään"}
            </h2>
            {" "}
            <div className="mo-ts-body">
              {" "}
              <ul className="mo-ts-list">
                {" "}
                <li className="mo-rv">
                  {"Yhteydenotot ja tarjouspyynnöt, jotka eivät johda asiakkuuteen: 12 kuukautta viimeisestä yhteydenpidosta."}
                </li>
                {" "}
                <li className="mo-rv">
                  {"Kartoitusten kalenterimerkinnät: 12 kuukautta kartoituksen jälkeen."}
                </li>
                {" "}
                <li className="mo-rv">
                  {"Työhakemukset: enintään kaksi vuotta haun päättymisestä, ellei hakijan kanssa sovita muuta."}
                </li>
                {" "}
                <li className="mo-rv">
                  {"Asiakkuuden tiedot: asiakassuhteen ajan."}
                </li>
                {" "}
                <li className="mo-rv">
                  {"Kirjanpitoaineisto: kirjanpitolain mukaan, eli kirjanpito ja tilinpäätös kymmenen vuotta tilikauden päättymisestä ja tositteet kuusi vuotta sen vuoden lopusta, jonka aikana tilikausi päättyi."}
                </li>
                {" "}
                <li className="mo-rv">
                  {"Google Analyticsin kävijätiedot: enintään 14 kuukautta."}
                </li>
                {" "}
                <li className="mo-rv">
                  {"Evästeet: kohdan 4 taulukon mukaisesti."}
                </li>
                {" "}
              </ul>
              {" "}
              <p className="mo-rv">
                {"Kun säilytysaika päättyy, tiedot poistetaan tai muutetaan sellaisiksi, ettei niistä voi tunnistaa henkilöä."}
              </p>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* 8 */}
          {" "}
          <span id="m-tietoturva" aria-hidden="true" style={{ display: "block", position: "relative", top: "-64px", height: "0" }}></span>
          <section className="mo-ts-sec" aria-labelledby="m-tietoturva-h">
            {" "}
            <h2 id="m-tietoturva-h" className="mo-ts-h mo-rv">
              <span className="mo-ts-num">
                {"8"}
              </span>
              {"Tietoturva"}
            </h2>
            {" "}
            <div className="mo-ts-body">
              {" "}
              <p className="mo-rv">
                {"Sivusto ja sen lomakkeet käyttävät salattua HTTPS-yhteyttä. Tiedot säilytetään palveluissa, joihin pääsee vain henkilökohtaisilla tunnuksilla, ja pääsy on rajattu niille, jotka tarvitsevat tietoja työssään."}
              </p>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* 9 */}
          {" "}
          <span id="m-oikeudet" aria-hidden="true" style={{ display: "block", position: "relative", top: "-64px", height: "0" }}></span>
          <section className="mo-ts-sec" aria-labelledby="m-oikeudet-h">
            {" "}
            <h2 id="m-oikeudet-h" className="mo-ts-h mo-rv">
              <span className="mo-ts-num">
                {"9"}
              </span>
              {"Sinun oikeutesi"}
            </h2>
            {" "}
            <div className="mo-ts-body">
              {" "}
              <p className="mo-rv">
                {"Sinulla on oikeus:"}
              </p>
              {" "}
              <ul className="mo-ts-list">
                {" "}
                <li className="mo-rv">
                  {"saada tietää, mitä tietoja sinusta käsitellään, ja saada niistä kopio"}
                </li>
                {" "}
                <li className="mo-rv">
                  {"vaatia virheellisten tietojen korjaamista"}
                </li>
                {" "}
                <li className="mo-rv">
                  {"vaatia tietojesi poistamista"}
                </li>
                {" "}
                <li className="mo-rv">
                  {"vaatia käsittelyn rajoittamista"}
                </li>
                {" "}
                <li className="mo-rv">
                  {"vastustaa käsittelyä, joka perustuu oikeutettuun etuun, ja kieltää suoramarkkinointi"}
                </li>
                {" "}
                <li className="mo-rv">
                  {"siirtää antamasi tiedot toiseen järjestelmään"}
                </li>
                {" "}
                <li className="mo-rv">
                  {"perua suostumuksesi milloin tahansa, mikä ei vaikuta ennen perumista tehdyn käsittelyn lainmukaisuuteen"}
                </li>
                {" "}
              </ul>
              {" "}
              <p className="mo-rv">
                {"Lähetä pyyntö osoitteeseen "}
                <a href="mailto:info@wsmedia.fi">
                  {"info@wsmedia.fi"}
                </a>
                {". Vastaamme viimeistään kuukauden kuluessa. Emme tee automaattisia päätöksiä, joilla olisi sinuun oikeudellisia tai niihin verrattavia vaikutuksia."}
              </p>
              {" "}
              <p className="mo-rv">
                {"Jos katsot, että tietojasi käsitellään lainvastaisesti, voit tehdä valituksen tietosuojavaltuutetun toimistolle ("}
                <a href="https://tietosuoja.fi" target="_blank" rel="noopener noreferrer">
                  {"tietosuoja.fi"}
                </a>
                {")."}
              </p>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* 10 */}
          {" "}
          <span id="m-muutokset" aria-hidden="true" style={{ display: "block", position: "relative", top: "-64px", height: "0" }}></span>
          <section className="mo-ts-sec" aria-labelledby="m-muutokset-h">
            {" "}
            <h2 id="m-muutokset-h" className="mo-ts-h mo-rv">
              <span className="mo-ts-num">
                {"10"}
              </span>
              {"Muutokset"}
            </h2>
            {" "}
            <div className="mo-ts-body">
              {" "}
              <p className="mo-rv">
                {"Päivitämme selostetta, kun palvelumme tai lainsäädäntö muuttuvat. Seloste on päivitetty viimeksi 8.10.2026."}
              </p>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
        </div>
        {" "}
        <footer style={{ padding: "40px 20px 120px", background: "#05080c", display: "flex", flexDirection: "column", gap: "22px", fontSize: "15px" }}>
          {" "}
          <div>
            <b style={{ fontSize: "18px" }}>
              {"WS Media"}
            </b>
            <p style={{ margin: "6px 0 0", fontSize: "14.5px", lineHeight: "1.55", color: "rgba(255,255,255,.65)" }}>
              {"Lyhytvideotuotanto, verkkosivut ja graafinen ilme yrityksille. Espoo ja Helsinki, koko Suomi."}
            </p>
          </div>
          {" "}
          <div style={{ display: "flex", gap: "10px" }}>
            {" "}
            <a href="https://www.instagram.com/wsmedia.fi/" aria-label="WS Media Instagramissa" style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1px solid rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="5"></rect>
                <circle cx="12" cy="12" r="3.6"></circle>
              </svg>
            </a>
            {" "}
            <a href="https://www.tiktok.com/@wsmedia.fi" aria-label="WS Media TikTokissa" style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1px solid rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M14 4v10.5a3.3 3.3 0 1 1-3.3-3.3M14 4c.5 2.3 2 3.8 4.6 4.1"></path>
              </svg>
            </a>
            {" "}
            <a href="https://fi.linkedin.com/company/ws-media-oy" aria-label="WS Media LinkedInissä" style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1px solid rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="4" y="9" width="3.5" height="11"></rect>
                <circle cx="5.7" cy="5.5" r="2"></circle>
                <path d="M10 9h3.3v1.6c.6-1 1.8-1.9 3.6-1.9 3 0 3.6 2 3.6 4.6V20H17v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V20H10z"></path>
              </svg>
            </a>
            {" "}
          </div>
          {" "}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "22px 12px" }}>
            {" "}
            <div>
              <b style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,.55)", marginBottom: "8px" }}>
                {"Palvelut"}
              </b>
              <a href="/lyhytvideot" style={{ display: "block", padding: "6px 0", color: "#fff", textDecoration: "none" }}>
                {"Lyhytvideot"}
              </a>
              <a href="/verkkosivut" style={{ display: "block", padding: "6px 0", color: "#fff", textDecoration: "none" }}>
                {"Verkkosivut"}
              </a>
              <a href="/hakukoneoptimointi" style={{ display: "block", padding: "6px 0", color: "#fff", textDecoration: "none" }}>
                {"Hakukoneoptimointi"}
              </a>
              <a href="/graafinen-suunnittelu" style={{ display: "block", padding: "6px 0", color: "#fff", textDecoration: "none" }}>
                {"Graafinen suunnittelu"}
              </a>
            </div>
            {" "}
            <div>
              <b style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,.55)", marginBottom: "8px" }}>
                {"Yritys"}
              </b>
              <a href="/meista" style={{ display: "block", padding: "6px 0", color: "#fff", textDecoration: "none" }}>
                {"Meistä"}
              </a>
              <a href="/" style={{ display: "block", padding: "6px 0", color: "#fff", textDecoration: "none" }}>
                {"Referenssit"}
              </a>
              <a href="/toihin-meille" style={{ display: "block", padding: "6px 0", color: "#fff", textDecoration: "none" }}>
                {"Töihin meille"}
              </a>
              <a href="/yhteystiedot" style={{ display: "block", padding: "6px 0", color: "#fff", textDecoration: "none" }}>
                {"Ota yhteyttä"}
              </a>
              <a href="/laskutustiedot" style={{ display: "block", padding: "6px 0", color: "#fff", textDecoration: "none" }}>
                {"Laskutustiedot"}
              </a>
            </div>
            {" "}
          </div>
          {" "}
          <div>
            <b style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,.55)", marginBottom: "8px" }}>
              {"Yhteystiedot"}
            </b>
            <a href="mailto:info@wsmedia.fi" style={{ display: "block", padding: "6px 0", color: "#fff", textDecoration: "none" }}>
              {"info@wsmedia.fi"}
            </a>
            <a href="tel:+358405648770" style={{ display: "block", padding: "6px 0", color: "#fff", textDecoration: "none" }}>
              {"040 564 8770"}
            </a>
            <span style={{ display: "block", padding: "6px 0", color: "rgba(255,255,255,.75)" }}>
              {"Kuusiniementie 8 F, 02710 Espoo"}
            </span>
          </div>
          {" "}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,.1)", fontSize: "13.5px", color: "rgba(255,255,255,.55)" }}>
            <span>
              {"© 2026 WS Media Oy"}
            </span>
            <a href="/tietosuoja" className="mo-osuma" style={{ color: "rgba(255,255,255,.75)", textDecoration: "none" }}>
              {"Tietosuojaseloste"}
            </a>
            <a href="#m-evasteet" className="mo-osuma" style={{ color: "rgba(255,255,255,.75)", textDecoration: "none" }}>
              {"Evästeasetukset"}
            </a>
          </div>
          {" "}
        </footer>
        {" "}
      </div>
      <Kuori reitti="/tietosuoja" tapa="pieni" />
      <Moottori otsake={{ tapa: "pieni" }} />
      <Efektit />
    </div>
  );
}
