"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

import { CONSENT_CHANGED, type Consent, readConsent } from "./consent";

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

type GtagArgs = unknown[];

declare global {
  interface Window {
    dataLayer?: GtagArgs[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq?: any;
    _fbq?: unknown;
  }
}

const DENIED = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
} as const;

const GRANTED = {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
} as const;

function push(args: GtagArgs) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

/**
 * Lataa GA4:n ja Meta Pixelin vain jos kavija on antanut suostumuksen.
 *
 * Consent Mode v2: oletustila kirjoitetaan dataLayeriin heti ensirenderissa,
 * ennen kuin yhtaan kolmannen osapuolen skriptia on ladattu. Se on pelkka
 * dataLayer-push eika aiheuta verkkopyyntoa. Kun kavija hyvaksyy, tila
 * paivitetaan grantediksi ja vasta silloin gtag.js ja Pixel ladataan.
 */
export default function Analytics() {
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    // Oletus denied ennen mitaan latausta.
    push(["consent", "default", { ...DENIED, wait_for_update: 500 }]);

    const apply = (consent: Consent | null) => {
      const granted = !!consent?.analytics;
      if (granted) push(["consent", "update", { ...GRANTED }]);
      setAnalytics(granted);
    };

    apply(readConsent());

    const onChange = (e: Event) => apply((e as CustomEvent<Consent>).detail);
    window.addEventListener(CONSENT_CHANGED, onChange);
    return () => window.removeEventListener(CONSENT_CHANGED, onChange);
  }, []);

  if (!analytics) return null;

  return (
    <>
      {GA4_ID && (
        <>
          <Script
            id="ga4-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('js', new Date());
gtag('config', '${GA4_ID}');`}
          </Script>
        </>
      )}

      {META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
      )}
    </>
  );
}
