/**
 * React <ViewTransition> on canary-kanavan komponentti. Next.js kayttaa
 * App Routerissa omaa canary-buildiaan, joten komponentti on ajossa
 * olemassa (next/dist/compiled/react vie sen), mutta @types/react vie
 * sen tyypit vain react/canary-moduulissa.
 *
 * Viittaus on kolmoisvinoviivana eika importtina: `import {} from
 * "react/canary"` katoaa tsc:n omassa kaannoksessa, mutta Turbopack
 * kaantaa SWC:lla, joka voisi jattaa sivuvaikutusimportin paikalleen -
 * ja moduulia ei ole olemassa ajossa. Tama tiedosto ei tuota yhtaan
 * riviä JS:aa.
 */
/// <reference types="react/canary" />
