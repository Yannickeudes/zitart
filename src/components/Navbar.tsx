"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/galerie", label: "Galerie" },
  { href: "/artistes", label: "Artistes" },
  { href: "/evenements", label: "Événements" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({
  user,
}: {
  user?: { name: string; role: string } | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <div className="mt-4 flex items-center justify-between rounded-full border border-ink/10 bg-cream/85 backdrop-blur-md px-5 sm:px-7 py-3 shadow-[0_8px_30px_rgba(23,19,16,0.08)]">
          <Link href="/" className="font-display text-2xl tracking-tight" onClick={() => setOpen(false)}>
            Zit<span className="text-ember">’</span>art
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-[13px] uppercase tracking-[0.14em]">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`link-underline transition-colors ${pathname.startsWith(l.href) ? "text-ember" : "hover:text-ember"}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {user.role === "ARTIST" && (
                  <Link href={`/espace`} className="text-[13px] uppercase tracking-[0.14em] link-underline hover:text-ember">
                    Mon espace
                  </Link>
                )}
                {user.role === "ADMIN" && (
                  <Link href="/admin" className="text-[13px] uppercase tracking-[0.14em] link-underline hover:text-ember">
                    Admin
                  </Link>
                )}
                <Link
                  href="/favoris"
                  className="text-[13px] uppercase tracking-[0.14em] link-underline hover:text-ember"
                >
                  Favoris
                </Link>
                <form action="/api/auth/logout" method="post">
                  <button className="rounded-full bg-ink text-cream text-[13px] uppercase tracking-[0.14em] px-5 py-2.5 hover:bg-ember transition-colors">
                    Quitter
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/connexion" className="text-[13px] uppercase tracking-[0.14em] link-underline hover:text-ember">
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  className="rounded-full bg-ink text-cream text-[13px] uppercase tracking-[0.14em] px-5 py-2.5 hover:bg-ember transition-colors"
                >
                  Rejoindre
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`h-px bg-ink transition-transform ${open ? "rotate-45 translate-y-[3.5px]" : ""}`} />
              <span className={`h-px bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`h-px bg-ink transition-transform ${open ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
            </div>
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-2 rounded-3xl border border-ink/10 bg-cream p-6 shadow-xl">
            <nav className="flex flex-col gap-4 text-sm uppercase tracking-[0.14em]">
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="hover:text-ember">
                  {l.label}
                </Link>
              ))}
              <hr className="border-ink/10" />
              {user ? (
                <>
                  {user.role === "ARTIST" && <Link href="/espace" onClick={() => setOpen(false)}>Mon espace</Link>}
                  {user.role === "ADMIN" && <Link href="/admin" onClick={() => setOpen(false)}>Administration</Link>}
                  <Link href="/favoris" onClick={() => setOpen(false)}>Favoris</Link>
                  <form action="/api/auth/logout" method="post">
                    <button className="text-left w-full">Se déconnecter</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/connexion" onClick={() => setOpen(false)}>Connexion</Link>
                  <Link href="/inscription" onClick={() => setOpen(false)}>Rejoindre Zit'art</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
