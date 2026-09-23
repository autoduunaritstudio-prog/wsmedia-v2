import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * VÄLIAIKAINEN: wsmedia.fi näyttää "tulossa"-sivun, kunnes uusi sivusto
 * julkaistaan. wsmedia-v2.vercel.app ja preview-osoitteet toimivat normaalisti.
 *
 * Julkaisu = poista tämä tiedosto ja public/tulossa/. Mitään muuta ei tarvitse
 * muuttaa: DNS osoittaa jo Verceliin.
 */
const TULOSSA_HOSTS = new Set(["wsmedia.fi", "www.wsmedia.fi"]);

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  if (!TULOSSA_HOSTS.has(host)) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (pathname === "/robots.txt") {
    return NextResponse.rewrite(new URL("/tulossa/robots.txt", request.url));
  }
  return NextResponse.rewrite(new URL("/tulossa/index.html", request.url));
}

export const config = {
  matcher: [
    /* Kaikki paitsi Nextin omat resurssit, tulossa-kansio itse ja ikonit. */
    "/((?!_next/|tulossa/|favicon\\.ico|apple-touch-icon\\.png|icon-\\d+\\.png|site\\.webmanifest).*)",
  ],
};
