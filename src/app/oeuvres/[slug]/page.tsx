import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice, AVAILABILITY_LABELS, STATUS_LABELS } from "@/lib/utils";
import FavoriteButton from "@/components/FavoriteButton";
import ArtworkCard from "@/components/ArtworkCard";
import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await prisma.artwork.findUnique({ where: { slug }, include: { artist: { include: { user: true } } } });
  if (!a) return {};
  return {
    title: `${a.title} — ${a.artist.user.name}`,
    description: a.description?.slice(0, 160) ?? `${a.title} par ${a.artist.user.name} sur Zit'art.`,
    openGraph: { images: [a.image] },
  };
}

export default async function OeuvrePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { getSession } = await import("@/lib/auth");
  const session = await getSession();
  const artwork = await prisma.artwork.findUnique({
    where: { slug },
    include: {
      artist: { include: { user: { select: { name: true, email: true } } } },
      category: true,
    },
  });
  if (!artwork) notFound();
  let isOwner = session?.role === "ADMIN";
  if (!isOwner && session?.role === "ARTIST") {
    const mine = await prisma.artist.findUnique({ where: { userId: session.id } });
    isOwner = mine?.id === artwork.artistId;
  }
  if (artwork.status !== "PUBLIE" && !isOwner) notFound();

  await prisma.artwork.update({ where: { id: artwork.id }, data: { views: { increment: 1 } } });

  const [others, isFav] = await Promise.all([
    prisma.artwork.findMany({
      where: { artistId: artwork.artistId, status: "PUBLIE", id: { not: artwork.id } },
      include: { artist: { include: { user: { select: { name: true } } } }, category: true },
      take: 3,
    }),
    (async () => {
      if (!session) return false;
      const f = await prisma.favorite.findUnique({
        where: { userId_artworkId: { userId: session.id, artworkId: artwork.id } },
      });
      return !!f;
    })(),
  ]);

  const specs = [
    artwork.year && { label: "Année", value: String(artwork.year) },
    artwork.techniques && { label: "Techniques", value: artwork.techniques },
    artwork.dimensions && { label: "Dimensions", value: artwork.dimensions },
    artwork.price != null && { label: "Prix", value: formatPrice(artwork.price) },
    { label: "Disponibilité", value: AVAILABILITY_LABELS[artwork.availability] },
    { label: "Catégorie", value: artwork.category.name },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="mx-auto max-w-[1600px] px-5 sm:px-8 pt-28 sm:pt-36 pb-20">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Image */}
        <div className="lg:col-span-7">
          <div className="relative aspect-[4/5] bg-sand overflow-hidden rounded-sm">
            <Image src={artwork.image} alt={artwork.title} fill priority sizes="(max-width:1024px) 100vw, 60vw" className="object-cover" />
            <FavoriteButton artworkId={artwork.id} initial={isFav} className="!top-4 !right-4" />
          </div>
        </div>

        {/* Infos */}
        <div className="lg:col-span-5 flex flex-col">
          <p className="text-[11px] uppercase tracking-[0.3em] text-clay">{artwork.category.name}</p>
          <h1 className="font-display text-4xl sm:text-5xl mt-3 leading-tight">{artwork.title}</h1>
          <Link href={`/artistes/${artwork.artist.slug}`} className="mt-3 text-fog hover:text-ember transition-colors w-fit">
            par <span className="underline underline-offset-4">{artwork.artist.user.name}</span>
          </Link>

          <div className="mt-8 border-t border-ink/10">
            {specs.map((s) => (
              <div key={s.label} className="flex justify-between py-3 border-b border-ink/10 text-sm">
                <span className="text-fog">{s.label}</span>
                <span className="font-medium text-right">{s.value}</span>
              </div>
            ))}
          </div>

          {artwork.description && (
            <p className="mt-8 text-fog leading-relaxed whitespace-pre-line">{artwork.description}</p>
          )}

          <div className="mt-8">
            <ContactForm artworkId={artwork.id} artistName={artwork.artist.user.name} compact />
          </div>
        </div>
      </div>

      {/* Artiste */}
      <section className="mt-24 grid md:grid-cols-2 gap-8 items-center rounded-2xl bg-ink text-cream p-8 sm:p-12 grain relative overflow-hidden">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold mb-3">L'artiste</p>
          <h2 className="font-display text-3xl sm:text-4xl">{artwork.artist.user.name}</h2>
          {artwork.artist.bio && (
            <p className="mt-4 text-fog text-sm leading-relaxed line-clamp-4">{artwork.artist.bio}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/artistes/${artwork.artist.slug}`} className="rounded-full bg-cream text-ink px-6 py-3 text-xs uppercase tracking-[0.15em] hover:bg-ember hover:text-cream transition-colors">
              Voir le profil
            </Link>
            {artwork.artist.location && <span className="rounded-full border border-cream/20 px-6 py-3 text-xs uppercase tracking-[0.15em]">{artwork.artist.location}</span>}
          </div>
        </div>
        {artwork.artist.avatar && (
          <div className="relative aspect-square max-w-xs mx-auto rounded-2xl overflow-hidden">
            <Image src={artwork.artist.avatar} alt={artwork.artist.user.name} fill sizes="30vw" className="object-cover" />
          </div>
        )}
      </section>

      {/* Autres œuvres */}
      {others.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-3xl mb-10">Autres œuvres de {artwork.artist.user.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
            {others.map((a) => <ArtworkCard key={a.id} artwork={a} />)}
          </div>
        </section>
      )}
    </div>
  );
}
