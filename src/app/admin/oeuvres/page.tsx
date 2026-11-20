import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { setArtworkStatus, deleteArtworkAdmin, toggleFeaturedArtwork } from "@/lib/actions/admin";
import { STATUS_LABELS } from "@/lib/utils";
import type { Metadata } from "next";
import type { ArtworkStatus } from "@prisma/client";

export const metadata: Metadata = { title: "Admin — Œuvres" };

const STATUTS: { value: string; label: string }[] = [
  { value: "", label: "Toutes" },
  { value: "EN_ATTENTE", label: "En attente" },
  { value: "PUBLIE", label: "Publiées" },
  { value: "BROUILLON", label: "Brouillons" },
  { value: "REFUSE", label: "Refusées" },
];

export default async function AdminOeuvres({ searchParams }: { searchParams: Promise<{ statut?: string }> }) {
  const { statut } = await searchParams;
  const artworks = await prisma.artwork.findMany({
    where: statut ? { status: statut as ArtworkStatus } : {},
    include: {
      artist: { include: { user: { select: { name: true } } } },
      category: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-4xl">Œuvres</h1>
        <div className="flex gap-2 flex-wrap">
          {STATUTS.map((s) => (
            <Link
              key={s.value}
              href={s.value ? `/admin/oeuvres?statut=${s.value}` : "/admin/oeuvres"}
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.12em] border transition-colors ${
                statut === s.value || (!statut && !s.value)
                  ? "bg-ink text-cream border-ink"
                  : "border-ink/20 hover:border-ember"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {artworks.map((a) => (
          <div key={a.id} className="flex gap-4 rounded-2xl border border-ink/10 bg-cream p-4">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-sand shrink-0">
              <Image src={a.image} alt={a.title} fill sizes="112px" className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-display text-lg truncate">{a.title}</p>
                  <p className="text-xs text-fog">{a.artist.user.name} · {a.category.name} · {a.year ?? "—"}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.15em] shrink-0 ${
                  a.status === "PUBLIE" ? "bg-emerald-100 text-emerald-800" :
                  a.status === "EN_ATTENTE" ? "bg-amber-100 text-amber-800" :
                  a.status === "REFUSE" ? "bg-red-100 text-red-800" : "bg-sand text-fog"
                }`}>
                  {STATUS_LABELS[a.status]}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs">
                <Link href={`/oeuvres/${a.slug}`} className="text-fog link-underline">Voir ↗</Link>
                {a.status !== "PUBLIE" && (
                  <form action={async () => { "use server"; await setArtworkStatus(a.id, "PUBLIE"); }}>
                    <button className="text-emerald-700 link-underline">Approuver</button>
                  </form>
                )}
                {a.status === "EN_ATTENTE" && (
                  <form action={async () => { "use server"; await setArtworkStatus(a.id, "REFUSE"); }}>
                    <button className="text-brique link-underline">Refuser</button>
                  </form>
                )}
                {a.status === "REFUSE" && (
                  <form action={async () => { "use server"; await setArtworkStatus(a.id, "EN_ATTENTE"); }}>
                    <button className="text-fog link-underline">Remettre en attente</button>
                  </form>
                )}
                <form action={async () => { "use server"; await toggleFeaturedArtwork(a.id); }}>
                  <button className="text-ember link-underline">{a.featured ? "Retirer vedette" : "Mettre en vedette"}</button>
                </form>
                <form action={async () => { "use server"; await deleteArtworkAdmin(a.id); }}>
                  <button className="text-fog hover:text-brique link-underline">Supprimer</button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {artworks.length === 0 && (
          <p className="text-fog text-sm py-10 text-center">Aucune œuvre dans cette catégorie.</p>
        )}
      </div>
    </div>
  );
}
