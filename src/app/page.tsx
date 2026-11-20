import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import ArtworkCard from "@/components/ArtworkCard";
import Reveal from "@/components/Reveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zit'art — L'art s'exprime. Zit'art le révèle.",
  description:
    "Plateforme de découverte et de valorisation des artistes africains : peinture, sculpture, photographie, art numérique, artisanat et design.",
};

const include = {
  artist: { include: { user: { select: { name: true } } } },
  category: true,
} as const;

export default async function Home() {
  const [featuredArtworks, featuredArtists, categories, latest, upcoming] = await Promise.all([
    prisma.artwork.findMany({
      where: { status: "PUBLIE", featured: true },
      include,
      orderBy: { views: "desc" },
      take: 6,
    }),
    prisma.artist.findMany({
      where: { featured: true },
      include: { user: { select: { name: true } }, _count: { select: { artworks: { where: { status: "PUBLIE" } } } } },
      take: 4,
    }),
    prisma.category.findMany({
      include: { _count: { select: { artworks: { where: { status: "PUBLIE" } } } } },
      orderBy: { name: "asc" },
    }),
    prisma.artwork.findMany({
      where: { status: "PUBLIE" },
      include,
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.event.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: "asc" },
      take: 3,
    }),
  ]);

  const hero = featuredArtworks[0];

  return (
    <>
      {/* HERO */}
      <section className="relative bg-ink text-cream grain overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 pt-32 sm:pt-40 pb-16 sm:pb-24">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-gold mb-6">
                  Plateforme de découverte artistique
                </p>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="font-display text-[13vw] sm:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight">
                  L'art s'exprime.
                  <br />
                  <span className="italic text-ember">Zit'art</span> le révèle.
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-8 max-w-lg text-fog leading-relaxed">
                  Zit'art rassemble les artistes africains et leurs univers — peinture, sculpture,
                  photographie, art numérique — pour leur offrir une vitrine et au public une
                  porte d'entrée vers la création contemporaine.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/galerie"
                    className="rounded-full bg-ember text-cream px-8 py-4 text-sm uppercase tracking-[0.15em] hover:bg-clay transition-colors"
                  >
                    Explorer la galerie
                  </Link>
                  <Link
                    href="/inscription"
                    className="rounded-full border border-cream/30 px-8 py-4 text-sm uppercase tracking-[0.15em] hover:border-ember hover:text-ember transition-colors"
                  >
                    Devenir artiste
                  </Link>
                </div>
              </Reveal>
            </div>

            {hero && (
              <div className="lg:col-span-5 relative">
                <Reveal delay={200} className="relative">
                  <Link href={`/oeuvres/${hero.slug}`} className="block group">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                      <Image
                        src={hero.image}
                        alt={hero.title}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-4 flex justify-between items-baseline">
                      <div>
                        <p className="font-display text-xl">{hero.title}</p>
                        <p className="text-sm text-fog">{hero.artist.user.name}</p>
                      </div>
                      <span className="text-xs uppercase tracking-[0.15em] text-gold">Œuvre du moment</span>
                    </div>
                  </Link>
                </Reveal>
              </div>
            )}
          </div>
        </div>

        {/* Marquee */}
        <div className="border-t border-cream/10 py-5 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee gap-0">
            {[0, 1].map((n) => (
              <div key={n} className="flex shrink-0 items-center gap-8 pr-8 text-sm uppercase tracking-[0.25em] text-fog">
                {["Peinture", "Sculpture", "Photographie", "Art numérique", "Artisanat", "Illustration", "Design", "Mode"].map((d) => (
                  <span key={d} className="flex items-center gap-8">
                    {d} <span className="text-ember">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Œuvres en vedette — composition asymétrique */}
      <section className="mx-auto max-w-[1600px] px-5 sm:px-8 py-20 sm:py-28">
        <div className="flex items-end justify-between mb-12">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.3em] text-clay mb-3">Sélection</p>
            <h2 className="font-display text-4xl sm:text-5xl">Œuvres en vedette</h2>
          </Reveal>
          <Reveal delay={100}>
            <Link href="/galerie" className="link-underline text-sm uppercase tracking-[0.15em] hidden sm:block">
              Toute la galerie →
            </Link>
          </Reveal>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {featuredArtworks.slice(0, 6).map((a, i) => (
            <Reveal key={a.id} delay={(i % 3) * 100} className={i === 1 ? "lg:mt-16" : i === 4 ? "lg:-mt-8" : ""}>
              <ArtworkCard artwork={a} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 sm:hidden text-center">
          <Link href="/galerie" className="link-underline text-sm uppercase tracking-[0.15em]">Toute la galerie →</Link>
        </div>
      </section>

      {/* Artistes mis en avant */}
      <section className="bg-ink text-cream grain relative overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 py-20 sm:py-28">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold mb-3">Les créateurs</p>
            <h2 className="font-display text-4xl sm:text-5xl max-w-2xl leading-tight">
              Derrière chaque œuvre, un univers à explorer.
            </h2>
          </Reveal>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredArtists.map((a, i) => (
              <Reveal key={a.id} delay={i * 100}>
                <Link href={`/artistes/${a.slug}`} className="group block">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-soot">
                    {a.avatar ? (
                      <Image src={a.avatar} alt={a.user.name} fill sizes="25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center font-display text-6xl text-fog">
                        {a.user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="font-display text-xl group-hover:text-ember transition-colors">{a.user.name}</p>
                    <p className="text-sm text-fog">{a.location ?? a.disciplines ?? "Artiste"}</p>
                    <p className="text-xs text-fog mt-1">{a._count.artworks} œuvre{a._count.artworks > 1 ? "s" : ""}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="mx-auto max-w-[1600px] px-5 sm:px-8 py-20 sm:py-28">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.3em] text-clay mb-3">Disciplines</p>
          <h2 className="font-display text-4xl sm:text-5xl mb-12">Explorer par discipline</h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 60}>
              <Link
                href={`/galerie?categorie=${c.slug}`}
                className="group block rounded-2xl border border-ink/10 bg-linen p-6 h-full hover:border-ember hover:bg-sand transition-all"
              >
                <p className="font-display text-2xl group-hover:text-ember transition-colors">{c.name}</p>
                {c.description && <p className="text-xs text-fog mt-2 leading-relaxed">{c.description}</p>}
                <p className="text-[11px] uppercase tracking-[0.15em] text-fog mt-4">
                  {c._count.artworks} œuvre{c._count.artworks > 1 ? "s" : ""}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Nouveautés */}
      <section className="mx-auto max-w-[1600px] px-5 sm:px-8 pb-20 sm:pb-28">
        <div className="flex items-end justify-between mb-12">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.3em] text-clay mb-3">Fraîchement arrivées</p>
            <h2 className="font-display text-4xl sm:text-5xl">Nouveautés</h2>
          </Reveal>
          <Reveal delay={100}>
            <Link href="/galerie?tri=recent" className="link-underline text-sm uppercase tracking-[0.15em] hidden sm:block">
              Tout voir →
            </Link>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {latest.slice(0, 8).map((a, i) => (
            <Reveal key={a.id} delay={(i % 4) * 80}>
              <ArtworkCard artwork={a} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Événements */}
      {upcoming.length > 0 && (
        <section className="bg-sand/60 border-y border-ink/10">
          <div className="mx-auto max-w-[1600px] px-5 sm:px-8 py-20">
            <div className="flex items-end justify-between mb-10">
              <Reveal>
                <p className="text-[11px] uppercase tracking-[0.3em] text-clay mb-3">Agenda</p>
                <h2 className="font-display text-4xl">Événements à venir</h2>
              </Reveal>
              <Reveal delay={100}>
                <Link href="/evenements" className="link-underline text-sm uppercase tracking-[0.15em] hidden sm:block">
                  Tout l'agenda →
                </Link>
              </Reveal>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {upcoming.map((e, i) => (
                <Reveal key={e.id} delay={i * 100}>
                  <Link href="/evenements" className="group block rounded-2xl overflow-hidden bg-cream border border-ink/10 hover:border-ember transition-colors">
                    {e.image && (
                      <div className="relative aspect-[16/9]">
                        <Image src={e.image} alt={e.title} fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    )}
                    <div className="p-6">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-ember">
                        {new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(e.date))}
                      </p>
                      <p className="font-display text-xl mt-2 group-hover:text-ember transition-colors">{e.title}</p>
                      <p className="text-sm text-fog mt-1">{e.location}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA artiste */}
      <section className="mx-auto max-w-[1600px] px-5 sm:px-8 py-24 sm:py-32 text-center">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.3em] text-clay mb-4">Artistes</p>
          <h2 className="font-display text-4xl sm:text-6xl max-w-3xl mx-auto leading-tight">
            Votre univers mérite d'être <span className="italic text-ember">vu.</span>
          </h2>
          <p className="mt-6 text-fog max-w-xl mx-auto">
            Créez votre vitrine, publiez vos œuvres et rencontrez collectionneurs, galeries et public.
            La modération vous garantit une plateforme de qualité.
          </p>
          <Link
            href="/inscription"
            className="inline-block mt-10 rounded-full bg-ink text-cream px-10 py-4 text-sm uppercase tracking-[0.15em] hover:bg-ember transition-colors"
          >
            Créer mon profil artiste
          </Link>
        </Reveal>
      </section>
    </>
  );
}
