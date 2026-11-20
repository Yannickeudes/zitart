import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-40 pb-24 text-center">
      <p className="font-display text-[10rem] leading-none text-ember/30">404</p>
      <h1 className="font-display text-4xl mt-4">Cette page s'est envolée</h1>
      <p className="text-fog mt-4">L'œuvre que vous cherchez n'existe pas ou a été déplacée.</p>
      <div className="mt-10 flex justify-center gap-4">
        <Link href="/" className="rounded-full bg-ink text-cream px-8 py-3.5 text-xs uppercase tracking-[0.15em] hover:bg-ember transition-colors">
          Accueil
        </Link>
        <Link href="/galerie" className="rounded-full border border-ink/20 px-8 py-3.5 text-xs uppercase tracking-[0.15em] hover:border-ember hover:text-ember transition-colors">
          Galerie
        </Link>
      </div>
    </div>
  );
}
