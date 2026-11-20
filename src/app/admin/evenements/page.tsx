import { prisma } from "@/lib/db";
import { deleteEvent } from "@/lib/actions/admin";
import EventForm from "@/components/EventForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Événements" };

export default async function AdminEvenements() {
  const events = await prisma.event.findMany({ orderBy: { date: "asc" } });

  return (
    <div>
      <h1 className="font-display text-4xl">Événements</h1>
      <div className="mt-8 rounded-2xl border border-ink/10 bg-cream p-6">
        <h2 className="font-display text-xl mb-6">Nouvel événement</h2>
        <EventForm />
      </div>
      <div className="mt-10 space-y-3">
        {events.map((e) => (
          <div key={e.id} className="flex items-center justify-between rounded-xl border border-ink/10 bg-cream px-5 py-4">
            <div>
              <p className="font-medium">{e.title}</p>
              <p className="text-xs text-fog">
                {new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(e.date))}
                {e.location ? ` · ${e.location}` : ""}
              </p>
            </div>
            <form action={async () => { "use server"; await deleteEvent(e.id); }}>
              <button className="text-xs text-brique link-underline">Supprimer</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
