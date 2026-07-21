"use client";

import Link from "next/link";
import Image from "next/image";
import { KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { evaluationNav, testNav, therapyNav } from "@/lib/site-data";

function Dropdown({ label, items }: { label: string; items: ReadonlyArray<readonly [string, string]> }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      window.requestAnimationFrame(() => containerRef.current?.querySelector<HTMLAnchorElement>("a")?.focus());
    }
  }

  return (
    <div className={`nav-dropdown ${open ? "is-open" : ""}`} ref={containerRef} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button ref={buttonRef} className="nav-dropdown-trigger" type="button" aria-haspopup="true" aria-expanded={open} aria-controls={id} onClick={() => setOpen((value) => !value)} onKeyDown={handleKeyDown}>
        {label}<span aria-hidden="true" className="chevron" />
      </button>
      <div className="nav-dropdown-panel" id={id} onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}>
        {items.map(([name, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{name}</Link>)}
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    if (!open) return () => document.body.classList.remove("menu-open");

    window.requestAnimationFrame(() => mobileMenuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus());
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(mobileMenuRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("menu-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const closeMobileMenu = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="Integrada Neuropsicologia — início">
          <span className="brand-mark"><Image src="/assets/logo.png" alt="" width={32} height={32} priority /></span>
          <strong>Integrada Neuropsicologia</strong>
        </Link>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <Dropdown label="Avaliação Neuropsicológica" items={evaluationNav} />
          <Dropdown label="Psicoterapia" items={therapyNav} />
          <Dropdown label="Checklists grátis" items={testNav} />
          <Link href="/blog">Blog</Link>
          <Link href="/jogosdeestimulaçãomental">Jogos de estimulação mental</Link>
        </nav>
        <button
          ref={menuButtonRef}
          className="menu-button"
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span /><span /><span />
        </button>
      </div>
      <div ref={mobileMenuRef} id="mobile-navigation" className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="mobile-menu-scroll">
          <p>Avaliação Neuropsicológica</p>
          {evaluationNav.map(([name, href]) => <Link key={href} href={href} onClick={closeMobileMenu}>{name}</Link>)}
          <p>Psicoterapia</p>
          {therapyNav.map(([name, href]) => <Link key={href} href={href} onClick={closeMobileMenu}>{name}</Link>)}
          <p>Checklists grátis</p>
          {testNav.map(([name, href]) => <Link key={href} href={href} onClick={closeMobileMenu}>{name}</Link>)}
          <Link className="mobile-menu-main" href="/blog" onClick={closeMobileMenu}>Blog</Link>
          <Link className="mobile-menu-main" href="/jogosdeestimulaçãomental" onClick={closeMobileMenu}>Jogos de estimulação mental</Link>
        </div>
      </div>
    </header>
  );
}
