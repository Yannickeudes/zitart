import Image from "next/image";
import { prisma } from "@/lib/db";
import Reveal from "@/components/Reveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Événements",
  description: "Expositions, vernissages, ateliers et rencontres artistiques sur Zit'art.",
};

export default async function Evenements() {
  const events = await prisma.event.findMany({ orderBy: { date: "asc" } });
  const upcoming = events.filter((e) => new Date(e.date) >= new Date(Date.now() - 86400000));
  const past = events.filter((e) => new Date(e.date) < new Date(Date.now() - 86400000));

  return (
    <div className="mx-auto max-w-[1600px] px-5 sm:px-8 pt-32 sm:pt-36 pb-20">
      <Reveal>
        <p className="text-[11px] uppercase tracking-[0.3em] text-clay mb-3">Agenda</p>
        <h1 className="font-display text-5xl sm:text-6xl">Événements & expositions</h1>
        <p className="mt-4 text-fog max-w-xl">Vernissages, ateliers, rencontres — l'art prend vie hors des écrans.</p>
      </Reveal>

      <div className="mt-14 space-y-10">
        {upcoming.length === 0 && <p className="text-fog">Aucun événement à venir pour le moment.</p>}
        {upcoming.map((e, i) => (
          <Reveal key={e.id} delay={i * 60}>
            <article className="group grid md:grid-cols-12 gap-6 items-center rounded-2xl overflow-hidden border border-ink/10 bg-cream hover:border-ember transition-colors">
              {e.image && (
                <div className="md:col-span-5 relative aspect-[16/10] md:aspect-auto md:h-full min-h-[220px]">
                  <Image src={e.image} alt={e.title} fill sizes="(max-width:768px) 100vw, 40vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              )}
              <div className="md:col-span-7 p-6 sm:p-10">
                <p className="text-[11px] uppercase tracking-[0.25em] text-ember">
                  {new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(e.date))}
                </p>
                <h2 className="font-display text-3xl mt-3 group-hover:text-ember transition-colors">{e.title}</h2>
                {e.description && <p className="text-fog mt-3 text-sm leading-relaxed max-w-xl">{e.description}</p>}
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-fog">
                  {e.location && <span>📍 {e.location}</span>}
                  {e.organizer && <span>Organisé par {e.organizer}</span>}
                </div>
                {e.link && (
                  <a href={e.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-6 rounded-full bg-ink text-cream px-6 py-3 text-xs uppercase tracking-[0.15em] hover:bg-ember transition-colors">
                    En savoir plus ↗
                  </a>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {past.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-2xl text-fog mb-8">Événements passés</h2>
          <div className="space-y-4">
            {past.map((e) => (
              <div key={e.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-ink/10 px-6 py-4 opacity-60">
                <div>
                  <p className="font-display text-lg">{e.title}</p>
                  <p className="text-xs text-fog">{e.location} · {e.organizer}</p>
                </div>
                <p className="text-xs text-fog uppercase tracking-[0.15em]">
                  {new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(e.date))}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
