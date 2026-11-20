import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { toggleFeaturedArtist } from "@/lib/actions/admin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Artistes" };

export default async function AdminArtistes() {
  const artists = await prisma.artist.findMany({
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { artworks: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Artistes</h1>
      <div className="mt-8 space-y-4">
        {artists.map((a) => (
          <div key={a.id} className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-cream p-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-sand shrink-0">
              {a.avatar ? (
                <Image src={a.avatar} alt={a.user.name} fill sizes="56px" className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center font-display text-xl text-fog">{a.user.name.charAt(0)}</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Link href={`/artistes/${a.slug}`} className="font-display text-lg hover:text-ember transition-colors">{a.user.name}</Link>
              <p className="text-xs text-fog truncate">{a.user.email} · {a.location ?? "—"} · {a._count.artworks} œuvres</p>
            </div>
            <form action={async () => { "use server"; await toggleFeaturedArtist(a.id); }}>
              <button className={`rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.15em] border transition-colors ${
                a.featured ? "bg-ember text-cream border-ember" : "border-ink/20 hover:border-ember"
              }`}>
                {a.featured ? "★ Vedette" : "Mettre en vedette"}
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
