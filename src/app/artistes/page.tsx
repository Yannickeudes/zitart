import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import Reveal from "@/components/Reveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artistes",
  description: "Rencontrez les artistes de la plateforme Zit'art : peintres, sculpteurs, photographes, illustrateurs et créateurs numériques.",
};

export default async function Artistes() {
  const artists = await prisma.artist.findMany({
    include: {
      user: { select: { name: true } },
      _count: { select: { artworks: { where: { status: "PUBLIE" } } } },
      artworks: { where: { status: "PUBLIE" }, take: 4, orderBy: { createdAt: "desc" } },
    },
    orderBy: [{ featured: "desc" }, { createdAt: "asc" }],
  });

  return (
    <div className="mx-auto max-w-[1600px] px-5 sm:px-8 pt-32 sm:pt-36 pb-20">
      <Reveal>
        <p className="text-[11px] uppercase tracking-[0.3em] text-clay mb-3">La communauté</p>
        <h1 className="font-display text-5xl sm:text-6xl">Artistes</h1>
        <p className="mt-4 text-fog max-w-xl">
          {artists.length} créateur{artists.length > 1 ? "s" : ""} exposent leur travail sur Zit'art.
        </p>
      </Reveal>

      <div className="mt-14 space-y-20">
        {artists.map((a, i) => (
          <Reveal key={a.id} delay={60}>
            <div className={`grid lg:grid-cols-12 gap-8 lg:gap-12 items-start ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <div className="lg:col-span-4">
                <Link href={`/artistes/${a.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
                    {a.avatar ? (
                      <Image src={a.avatar} alt={a.user.name} fill sizes="(max-width:1024px) 100vw, 30vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center font-display text-8xl text-fog">
                        {a.user.name.charAt(0)}
                      </div>
                    )}
                    {a.featured && (
                      <span className="absolute top-4 left-4 rounded-full bg-ember text-cream px-3 py-1 text-[10px] uppercase tracking-[0.15em]">En vedette</span>
                    )}
                  </div>
                </Link>
                <div className="mt-5">
                  <Link href={`/artistes/${a.slug}`}>
                    <h2 className="font-display text-3xl group-hover:text-ember transition-colors">{a.user.name}</h2>
                  </Link>
                  <p className="text-sm text-fog mt-1">{a.location ?? ""}</p>
                  <p className="text-sm text-fog">{a.disciplines ?? ""}</p>
                  <p className="text-xs text-fog mt-2 uppercase tracking-[0.15em]">
                    {a._count.artworks} œuvre{a._count.artworks > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="lg:col-span-8">
                {a.bio && <p className="text-fog leading-relaxed max-w-2xl line-clamp-4">{a.bio}</p>}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {a.artworks.map((w) => (
                    <Link key={w.id} href={`/oeuvres/${w.slug}`} className="group block">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-sand">
                        <Image src={w.image} alt={w.title} fill sizes="(max-width:768px) 50vw, 20vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                      <p className="mt-2 text-sm truncate group-hover:text-ember transition-colors">{w.title}</p>
                    </Link>
                  ))}
                  {a._count.artworks > 4 && (
                    <Link href={`/artistes/${a.slug}`} className="flex items-center justify-center aspect-[4/5] rounded-xl border border-dashed border-ink/25 text-sm text-fog hover:border-ember hover:text-ember transition-colors">
                      +{a._count.artworks - 4}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-24 rounded-2xl bg-ink text-cream p-10 sm:p-14 text-center grain relative overflow-hidden">
          <h2 className="font-display text-3xl sm:text-4xl">Vous êtes artiste ?</h2>
          <p className="text-fog mt-3 max-w-md mx-auto text-sm">
            Rejoignez Zit'art et donnez de la visibilité à votre travail.
          </p>
          <Link href="/inscription" className="inline-block mt-8 rounded-full bg-ember text-cream px-8 py-4 text-xs uppercase tracking-[0.15em] hover:bg-clay transition-colors">
            Créer mon profil
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
