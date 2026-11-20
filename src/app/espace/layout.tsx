import Link from "next/link";
import { getSessionWithArtist } from "@/lib/auth";
import { redirect } from "next/navigation";

const NAV = [
  { href: "/espace", label: "Tableau de bord" },
  { href: "/espace/oeuvres", label: "Mes œuvres" },
  { href: "/espace/oeuvres/nouveau", label: "Ajouter une œuvre" },
  { href: "/espace/profil", label: "Mon profil" },
];

export default async function EspaceLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionWithArtist();
  if (!user) redirect("/connexion");
  if (user.role === "ADMIN") redirect("/admin");
  if (!user.artist) {
    return (
      <div className="mx-auto max-w-lg px-5 pt-40 pb-24 text-center">
        <h1 className="font-display text-3xl">Profil artiste manquant</h1>
        <p className="text-fog mt-3 text-sm">Votre compte n'est pas encore associé à un profil artiste.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-28 sm:pt-32 pb-20">
      <div className="flex flex-col md:flex-row gap-10">
        <aside className="md:w-56 shrink-0">
          <p className="text-[11px] uppercase tracking-[0.3em] text-clay mb-2">Espace artiste</p>
          <p className="font-display text-2xl mb-6">{user.artist.user.name}</p>
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="whitespace-nowrap rounded-full md:rounded-lg px-4 py-2.5 text-sm hover:bg-sand transition-colors"
              >
                {n.label}
              </Link>
            ))}
            <Link href={`/artistes/${user.artist.slug}`} className="whitespace-nowrap rounded-full md:rounded-lg px-4 py-2.5 text-sm text-fog hover:bg-sand hover:text-ink transition-colors">
              Voir ma vitrine ↗
            </Link>
          </nav>
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
