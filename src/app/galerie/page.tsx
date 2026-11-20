import Link from "next/link";
import { prisma } from "@/lib/db";
import ArtworkCard from "@/components/ArtworkCard";
import Reveal from "@/components/Reveal";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Explorez la galerie Zit'art : œuvres de peinture, sculpture, photographie, art numérique et artisanat.",
};

const include = {
  artist: { include: { user: { select: { name: true } } } },
  category: true,
} as const;

const PAGE_SIZE = 12;

export default async function Galerie({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categorie?: string; artiste?: string; tri?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const categorie = sp.categorie ?? "";
  const artiste = sp.artiste ?? "";
  const tri = sp.tri === "populaire" ? "populaire" : "recent";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const where: Prisma.ArtworkWhereInput = {
    status: "PUBLIE",
    ...(q && {
      OR: [
        { title: { contains: q } },
        { description: { contains: q } },
        { artist: { user: { name: { contains: q } } } },
      ],
    }),
    ...(categorie && { category: { slug: categorie } }),
    ...(artiste && { artist: { slug: artiste } }),
  };

  const [artworks, total, categories, artists] = await Promise.all([
    prisma.artwork.findMany({
      where,
      include,
      orderBy: tri === "populaire" ? { views: "desc" } : { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.artwork.count({ where }),
    prisma.category.findMany({ include: { _count: { select: { artworks: { where: { status: "PUBLIE" } } } } }, orderBy: { name: "asc" } }),
    prisma.artist.findMany({
      include: { user: { select: { name: true } }, _count: { select: { artworks: { where: { status: "PUBLIE" } } } } },
      where: { artworks: { some: { status: "PUBLIE" } } },
      orderBy: { user: { name: "asc" } },
    }),
  ]);

  const pages = Math.ceil(total / PAGE_SIZE);
  const buildUrl = (over: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { q: q || undefined, categorie: categorie || undefined, artiste: artiste || undefined, tri: tri === "populaire" ? "populaire" : undefined, ...over };
    Object.entries(merged).forEach(([k, v]) => v && params.set(k, v));
    const s = params.toString();
    return `/galerie${s ? `?${s}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-[1600px] px-5 sm:px-8 pt-32 sm:pt-36 pb-20">
      <Reveal>
        <p className="text-[11px] uppercase tracking-[0.3em] text-clay mb-3">La collection</p>
        <h1 className="font-display text-5xl sm:text-6xl">Galerie</h1>
        <p className="mt-4 text-fog max-w-xl">
          {total} œuvre{total > 1 ? "s" : ""} — laissez-vous porter par les univers.
        </p>
      </Reveal>

      {/* Filtres */}
      <Reveal delay={100}>
        <form method="GET" action="/galerie" className="mt-10 grid gap-4 lg:grid-cols-[1fr_auto_auto_auto] items-end">
          <div>
            <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Rechercher</label>
            <input name="q" defaultValue={q} placeholder="Titre, artiste, description…" className="input" />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Catégorie</label>
            <select name="categorie" defaultValue={categorie} className="input">
              <option value="">Toutes</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name} ({c._count.artworks})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Artiste</label>
            <select name="artiste" defaultValue={artiste} className="input">
              <option value="">Tous</option>
              {artists.map((a) => (
                <option key={a.id} value={a.slug}>{a.user.name} ({a._count.artworks})</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <select name="tri" defaultValue={tri} className="input w-auto">
              <option value="recent">Récents</option>
              <option value="populaire">Populaires</option>
            </select>
            <button className="rounded-full bg-ink text-cream px-6 py-3 text-xs uppercase tracking-[0.15em] hover:bg-ember transition-colors whitespace-nowrap">
              Filtrer
            </button>
          </div>
        </form>
      </Reveal>

      {/* Chips actifs */}
      {(q || categorie || artiste) && (
        <div className="mt-6 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-fog uppercase tracking-[0.15em]">Filtres :</span>
          {q && <span className="rounded-full bg-sand px-3 py-1 text-xs">« {q} »</span>}
          {categorie && <span className="rounded-full bg-sand px-3 py-1 text-xs">{categories.find(c => c.slug === categorie)?.name}</span>}
          {artiste && <span className="rounded-full bg-sand px-3 py-1 text-xs">{artists.find(a => a.slug === artiste)?.user.name}</span>}
          <Link href="/galerie" className="text-xs text-ember underline underline-offset-2">Tout effacer</Link>
        </div>
      )}

      {/* Grille asymétrique */}
      {artworks.length === 0 ? (
        <div className="mt-20 text-center py-20 border border-dashed border-ink/20 rounded-2xl">
          <p className="font-display text-2xl">Aucune œuvre ne correspond</p>
          <p className="text-fog mt-2 text-sm">Essayez d'autres critères de recherche.</p>
          <Link href="/galerie" className="inline-block mt-6 rounded-full bg-ink text-cream px-6 py-3 text-xs uppercase tracking-[0.15em] hover:bg-ember transition-colors">
            Réinitialiser
          </Link>
        </div>
      ) : (
        <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 gap-8 [&>*]:mb-8">
          {artworks.map((a, i) => (
            <ArtworkCard key={a.id} artwork={a} large={i % 5 === 0} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <nav className="mt-14 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link href={buildUrl({ page: String(page - 1) })} className="rounded-full border border-ink/20 px-5 py-2.5 text-sm hover:border-ember hover:text-ember transition-colors">
              ← Précédent
            </Link>
          )}
          <span className="text-sm text-fog px-4">Page {page} / {pages}</span>
          {page < pages && (
            <Link href={buildUrl({ page: String(page + 1) })} className="rounded-full border border-ink/20 px-5 py-2.5 text-sm hover:border-ember hover:text-ember transition-colors">
              Suivant →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
