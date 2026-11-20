import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSessionWithArtist } from "@/lib/auth";
import { redirect } from "next/navigation";
import { deleteArtwork } from "@/lib/actions/artworks";
import { STATUS_LABELS, formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mes œuvres" };

export default async function EspaceOeuvres() {
  const user = await getSessionWithArtist();
  if (!user?.artist) redirect("/connexion");

  const artworks = await prisma.artwork.findMany({
    where: { artistId: user.artist.id },
    include: { category: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl">Mes œuvres</h1>
          <p className="text-fog mt-2 text-sm">{artworks.length} œuvre{artworks.length > 1 ? "s" : ""} au total.</p>
        </div>
        <Link href="/espace/oeuvres/nouveau" className="rounded-full bg-ink text-cream px-6 py-3.5 text-xs uppercase tracking-[0.15em] hover:bg-ember transition-colors">
          + Ajouter
        </Link>
      </div>

      {artworks.length === 0 ? (
        <div className="mt-14 rounded-2xl border border-dashed border-ink/20 p-16 text-center">
          <p className="font-display text-2xl">Aucune œuvre pour l'instant</p>
          <p className="text-fog text-sm mt-2">Publiez votre première création pour commencer à être découvert.</p>
          <Link href="/espace/oeuvres/nouveau" className="inline-block mt-6 rounded-full bg-ink text-cream px-8 py-3.5 text-xs uppercase tracking-[0.15em] hover:bg-ember transition-colors">
            Ajouter une œuvre
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((a) => (
            <div key={a.id} className="rounded-2xl border border-ink/10 overflow-hidden bg-cream">
              <div className="relative aspect-[4/3] bg-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.image} alt={a.title} className="absolute inset-0 w-full h-full object-cover" />
                <span className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.15em] ${
                  a.status === "PUBLIE" ? "bg-emerald-600 text-white" :
                  a.status === "EN_ATTENTE" ? "bg-amber-500 text-white" :
                  a.status === "REFUSE" ? "bg-red-600 text-white" : "bg-ink/70 text-cream"
                }`}>
                  {STATUS_LABELS[a.status]}
                </span>
              </div>
              <div className="p-4">
                <p className="font-display text-lg truncate">{a.title}</p>
                <p className="text-xs text-fog mt-1">{a.category.name} · {formatPrice(a.price)}</p>
                <div className="mt-3 flex gap-4 text-xs">
                  <Link href={`/espace/oeuvres/${a.id}/modifier`} className="text-ember link-underline">Modifier</Link>
                  <Link href={`/oeuvres/${a.slug}`} className="text-fog link-underline">Voir ↗</Link>
                  <form action={async () => { "use server"; await deleteArtwork(a.id); }}>
                    <button className="text-fog hover:text-brique link-underline">Supprimer</button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
