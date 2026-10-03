import { ORGANISAATIO } from "../components/organisaatio";
import { SIVUSTO } from "../sivusto";

/** Meistä-sivun rakenteinen data: AboutPage, organisaatio ja murupolku. */
export function buildJsonLd() {
  const url = `${SIVUSTO}/meista`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${url}#sivu`,
        url,
        name: "Meistä | WS Media",
        inLanguage: "fi-FI",
        about: { "@id": `${SIVUSTO}/#organisaatio` },
        breadcrumb: { "@id": `${url}#murupolku` },
      },
      {
        ...ORGANISAATIO,
        areaServed: "FI",
        founder: { "@type": "Person", name: "Tuomas Ivanov" },
        employee: [
          { "@type": "Person", name: "Tuomas Ivanov", jobTitle: "Perustaja" },
          { "@type": "Person", name: "Alex", jobTitle: "Toimitusjohtaja ja tuottaja" },
          { "@type": "Person", name: "Ville Karppinen", jobTitle: "Asiakasvastaava" },
        ],
        knowsAbout: ["Lyhytvideot", "Verkkosivut", "Hakukoneoptimointi", "Graafinen suunnittelu"],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#murupolku`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Etusivu", item: SIVUSTO },
          { "@type": "ListItem", position: 2, name: "Meistä", item: url },
        ],
      },
    ],
  };
}
