import { prisma } from "@/lib/db";
import { markMessageRead } from "@/lib/actions/contact";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Messages" };

export default async function AdminMessages() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Messages de contact</h1>
      <div className="mt-8 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`rounded-2xl border p-6 ${m.status === "NOUVEAU" ? "border-ember/50 bg-linen" : "border-ink/10 bg-cream"}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="font-medium">{m.name} <span className="text-fog font-normal">&lt;{m.email}&gt;</span></p>
                {m.subject && <p className="text-sm text-fog mt-1">{m.subject}</p>}
                <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">{m.message}</p>
                <p className="text-xs text-fog mt-3">
                  {new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(m.createdAt))}
                  {m.artworkId && " · lié à une œuvre"}
                </p>
              </div>
              {m.status === "NOUVEAU" && (
                <form action={async () => { "use server"; await markMessageRead(m.id); }}>
                  <button className="rounded-full border border-ink/20 px-4 py-2 text-xs uppercase tracking-[0.15em] hover:border-ember hover:text-ember transition-colors whitespace-nowrap">
                    Marquer lu
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-fog text-sm py-10 text-center">Aucun message.</p>}
      </div>
    </div>
  );
}
