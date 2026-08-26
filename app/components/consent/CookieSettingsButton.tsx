"use client";

import { openConsentSettings } from "./consent";

/** Footerin linkki, joka avaa evastebannerin uudelleen. */
export default function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button type="button" className="cc-reopen" onClick={openConsentSettings}>
      {label}
    </button>
  );
}
