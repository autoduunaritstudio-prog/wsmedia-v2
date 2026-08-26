"use client";

import { useEffect, useId, useRef, useState } from "react";

import MenuIcon from "./MenuIcon";
import SmartLink from "./SmartLink";
import type { ServiceMenuItem } from "./site-data";

type Props = {
  label: string;
  items: ServiceMenuItem[];
};

/**
 * Navin Palvelut-pudotusvalikko.
 *
 * Osoittimella (pointer: fine) valikko avautuu hoverilla ja sulkeutuu kun
 * osoitin poistuu. Kosketuslaitteella hoveria ei ole, joten valikko avataan
 * napautuksella. Molemmissa tapauksissa Escape ja klikkaus muualle sulkevat.
 */
export default function PalvelutDropdown({ label, items }: Props) {
  const [open, setOpen] = useState(false);
  const [hoverable, setHoverable] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    setHoverable(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const hoverProps = hoverable
    ? {
        onMouseEnter: () => setOpen(true),
        onMouseLeave: () => setOpen(false),
      }
    : {};

  return (
    <div className="navmenu" ref={wrapRef} {...hoverProps}>
      <button
        type="button"
        className="navmenu-btn"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <svg
          className="navmenu-chev"
          width="9"
          height="9"
          viewBox="0 0 9 9"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1.2 3 L4.5 6.1 L7.8 3"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/*
        Uloin kerros alkaa heti napin alareunasta ja tuo valin pehmusteella.
        Nain hiiri ei koskaan ohita valikkoa: pehmuste on DOM-lapsi, joten
        osoitin pysyy .navmenun sisalla eika mouseleave laukea kesken liikkeen.
      */}
      <div className="navmenu-pop" id={menuId} data-open={open || undefined} role="menu">
        <div className="navmenu-card">
          {items.map((item) => (
            <SmartLink
              key={item.label}
              href={item.href}
              className="navmenu-item"
              role="menuitem"
              tabIndex={open ? undefined : -1}
              onClick={() => setOpen(false)}
            >
              <span className="navmenu-ico">
                <MenuIcon name={item.icon} />
              </span>
              <span className="navmenu-txt">
                <b>{item.label}</b>
                <small>{item.desc}</small>
              </span>
            </SmartLink>
          ))}
        </div>
      </div>
    </div>
  );
}
