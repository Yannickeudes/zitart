import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ArtworkCard from "@/components/ArtworkCard";
import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await prisma.artist.findUnique({ where: { slug }, include: { user: true } });
  if (!a) return {};
  return {
    title: a.user.name,
    description: a.bio?.slice(0, 160) ?? `Profil de ${a.user.name} sur Zit'art.`,
    openGraph: { images: a.avatar ? [a.avatar] : [] },
  };
}

export default async function ArtistePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artist = await prisma.artist.findUnique({
    where: { slug },
    include: {
      user: { select: { name: true, email: true } },
      artworks: {
        where: { status: "PUBLIE" },
        include: { artist: { include: { user: { select: { name: true } } } }, category: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!artist) notFound();

  const socials = [
    artist.instagram && { label: "Instagram", href: artist.instagram.startsWith("http") ? artist.instagram : `https://instagram.com/${artist.instagram.replace("@", "")}` },
    artist.twitter && { label: "Twitter / X", href: artist.twitter.startsWith("http") ? artist.twitter : `https://x.com/${artist.twitter.replace("@", "")}` },
    artist.website && { label: "Site web", href: artist.website },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="mx-auto max-w-[1600px] px-5 sm:px-8 pt-28 sm:pt-36 pb-20">
      {/* En-tête profil */}
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-4">
          <div className="relative aspect-square max-w-sm mx-auto lg:mx-0 rounded-2xl overflow-hidden bg-sand">
            {artist.avatar ? (
              <Image src={artist.avatar} alt={artist.user.name} fill priority sizes="(max-width:1024px) 90vw, 30vw" className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center font-display text-8xl text-fog">
                {artist.user.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-8">
          {artist.featured && (
            <span className="inline-block rounded-full bg-ember text-cream px-3 py-1 text-[10px] uppercase tracking-[0.15em] mb-4">Artiste en vedette</span>
          )}
          <h1 className="font-display text-5xl sm:text-6xl leading-tight">{artist.user.name}</h1>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-fog">
            {artist.location && <span>📍 {artist.location}</span>}
            {artist.disciplines && <span>{artist.disciplines}</span>}
            <span>{artist.artworks.length} œuvre{artist.artworks.length > 1 ? "s" : ""}</span>
          </div>
          {artist.bio && <p className="mt-6 text-fog leading-relaxed max-w-2xl whitespace-pre-line">{artist.bio}</p>}
          {socials.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="rounded-full border border-ink/20 px-5 py-2.5 text-xs uppercase tracking-[0.15em] hover:border-ember hover:text-ember transition-colors">
                  {s.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Œuvres */}
      <section className="mt-20">
        <h2 className="font-display text-3xl mb-10">Œuvres</h2>
        {artist.artworks.length === 0 ? (
          <p className="text-fog text-sm">Aucune œuvre publiée pour le moment.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            {artist.artworks.map((a) => <ArtworkCard key={a.id} artwork={a} />)}
          </div>
        )}
      </section>

      {/* Contact */}
      <section className="mt-24 rounded-2xl bg-sand/60 border border-ink/10 p-8 sm:p-12">
        <h2 className="font-display text-3xl mb-2">Contacter {artist.user.name}</h2>
        <p className="text-fog text-sm mb-8">Une question sur une œuvre, une commande, une collaboration ?</p>
        <ContactForm artistName={artist.user.name} />
      </section>
    </div>
  );
}
