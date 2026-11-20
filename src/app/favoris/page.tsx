import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ArtworkCard from "@/components/ArtworkCard";
import Reveal from "@/components/Reveal";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mes favoris" };

export default async function Favoris() {
  const session = await getSession();
  if (!session) redirect("/connexion");

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.id },
    include: {
      artwork: {
        include: {
          artist: { include: { user: { select: { name: true } } } },
          category: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-[1600px] px-5 sm:px-8 pt-32 sm:pt-36 pb-20">
      <Reveal>
        <p className="text-[11px] uppercase tracking-[0.3em] text-clay mb-3">Collection personnelle</p>
        <h1 className="font-display text-5xl sm:text-6xl">Mes favoris</h1>
        <p className="mt-4 text-fog">{favorites.length} œuvre{favorites.length > 1 ? "s" : ""} sauvegardée{favorites.length > 1 ? "s" : ""}.</p>
      </Reveal>

      {favorites.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-ink/20 p-16 text-center">
          <p className="font-display text-2xl">Aucun favori pour le moment</p>
          <p className="text-fog text-sm mt-2">Explorez la galerie et sauvegardez les œuvres qui vous touchent.</p>
          <a href="/galerie" className="inline-block mt-8 rounded-full bg-ink text-cream px-8 py-3.5 text-xs uppercase tracking-[0.15em] hover:bg-ember transition-colors">
            Découvrir la galerie
          </a>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {favorites.map((f) => (
            <ArtworkCard key={f.id} artwork={f.artwork} favorited />
          ))}
        </div>
      )}
    </div>
  );
}
