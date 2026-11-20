import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSessionWithArtist } from "@/lib/auth";
import { redirect } from "next/navigation";
import { STATUS_LABELS } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tableau de bord" };

export default async function Espace() {
  const user = await getSessionWithArtist();
  if (!user?.artist) redirect("/connexion");

  const artworks = await prisma.artwork.findMany({
    where: { artistId: user.artist.id },
    orderBy: { updatedAt: "desc" },
  });

  const counts = {
    publiees: artworks.filter((a) => a.status === "PUBLIE").length,
    enAttente: artworks.filter((a) => a.status === "EN_ATTENTE").length,
    brouillons: artworks.filter((a) => a.status === "BROUILLON").length,
    vues: artworks.reduce((s, a) => s + a.views, 0),
    favoris: await prisma.favorite.count({ where: { artwork: { artistId: user.artist.id } } }),
  };

  const recent = artworks.slice(0, 5);

  return (
    <div>
      <h1 className="font-display text-4xl">Bonjour, {user.artist.user.name.split(" ")[0]}</h1>
      <p className="text-fog mt-2 text-sm">Voici l'état de votre vitrine Zit'art.</p>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Œuvres publiées", value: counts.publiees },
          { label: "En attente", value: counts.enAttente },
          { label: "Vues totales", value: counts.vues },
          { label: "Favoris reçus", value: counts.favoris },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-ink/10 bg-cream p-5">
            <p className="font-display text-3xl">{s.value}</p>
            <p className="text-xs text-fog uppercase tracking-[0.15em] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl">Dernières œuvres</h2>
          <Link href="/espace/oeuvres" className="text-sm text-ember link-underline">Tout gérer →</Link>
        </div>
        <div className="rounded-2xl border border-ink/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left text-[11px] uppercase tracking-[0.15em] text-fog">
                <th className="px-5 py-3">Œuvre</th>
                <th className="px-5 py-3 hidden sm:table-cell">Statut</th>
                <th className="px-5 py-3 hidden md:table-cell">Vues</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {recent.map((a) => (
                <tr key={a.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-5 py-3 font-medium">{a.title}</td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.15em] ${
                      a.status === "PUBLIE" ? "bg-emerald-100 text-emerald-800" :
                      a.status === "EN_ATTENTE" ? "bg-amber-100 text-amber-800" :
                      a.status === "REFUSE" ? "bg-red-100 text-red-800" : "bg-sand text-fog"
                    }`}>
                      {STATUS_LABELS[a.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-fog">{a.views}</td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/espace/oeuvres/${a.id}/modifier`} className="text-xs text-ember link-underline">Modifier</Link>
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-fog">Aucune œuvre — commencez par en ajouter une.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {counts.enAttente > 0 && (
        <p className="mt-6 text-sm text-fog bg-sand/60 rounded-xl px-5 py-4">
          {counts.enAttente} œuvre{counts.enAttente > 1 ? "s" : ""} en attente de validation par l'équipe Zit'art.
        </p>
      )}
    </div>
  );
}
