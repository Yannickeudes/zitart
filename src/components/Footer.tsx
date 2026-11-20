import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-ink text-cream grain overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-4xl sm:text-5xl leading-[1.05]">
              L'art s'exprime.<br />
              <span className="text-ember">Zit'art</span> le révèle.
            </p>
            <p className="mt-5 text-fog max-w-sm text-sm leading-relaxed">
              Une plateforme de découverte et de valorisation des artistes africains et de leurs créations.
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-fog mb-4">Explorer</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/galerie" className="hover:text-ember transition-colors">Galerie</Link></li>
              <li><Link href="/artistes" className="hover:text-ember transition-colors">Artistes</Link></li>
              <li><Link href="/evenements" className="hover:text-ember transition-colors">Événements</Link></li>
              <li><Link href="/contact" className="hover:text-ember transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-fog mb-4">Plateforme</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/inscription" className="hover:text-ember transition-colors">Devenir artiste</Link></li>
              <li><Link href="/connexion" className="hover:text-ember transition-colors">Connexion</Link></li>
              <li><Link href="/favoris" className="hover:text-ember transition-colors">Mes favoris</Link></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-fog mb-4">Contact</p>
            <ul className="space-y-2.5 text-sm text-fog">
              <li>bonjour@zitart.art</li>
              <li>Abidjan · Dakar · Lagos · Paris</li>
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-6 border-t border-cream/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-fog">
          <p>© {new Date().getFullYear()} Zit'art — Tous droits réservés.</p>
          <p>Fait avec passion pour la création africaine contemporaine.</p>
        </div>
      </div>
    </footer>
  );
}
