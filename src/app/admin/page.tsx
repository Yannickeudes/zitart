import Link from "next/link";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Tableau de bord" };

export default async function AdminDashboard() {
  const [users, artists, artworks, pending, published, events, messages, categories] = await Promise.all([
    prisma.user.count(),
    prisma.artist.count(),
    prisma.artwork.count(),
    prisma.artwork.count({ where: { status: "EN_ATTENTE" } }),
    prisma.artwork.count({ where: { status: "PUBLIE" } }),
    prisma.event.count(),
    prisma.contactMessage.count({ where: { status: "NOUVEAU" } }),
    prisma.category.count(),
  ]);

  const stats = [
    { label: "Utilisateurs", value: users },
    { label: "Artistes", value: artists },
    { label: "Œuvres totales", value: artworks },
    { label: "En attente", value: pending, href: "/admin/oeuvres?statut=EN_ATTENTE", alert: pending > 0 },
    { label: "Publiées", value: published },
    { label: "Événements", value: events },
    { label: "Messages non lus", value: messages, href: "/admin/messages", alert: messages > 0 },
    { label: "Catégories", value: categories },
  ];

  return (
    <div>
      <h1 className="font-display text-4xl">Tableau de bord</h1>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => {
          const inner = (
            <div className={`rounded-2xl border p-5 ${s.alert ? "border-ember bg-linen" : "border-ink/10 bg-cream"}`}>
              <p className="font-display text-3xl">{s.value}</p>
              <p className="text-xs text-fog uppercase tracking-[0.15em] mt-1">{s.label}</p>
            </div>
          );
          return s.href ? <Link key={s.label} href={s.href}>{inner}</Link> : <div key={s.label}>{inner}</div>;
        })}
      </div>
      {pending > 0 && (
        <div className="mt-8 rounded-2xl bg-ink text-cream p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p><strong>{pending}</strong> œuvre{pending > 1 ? "s" : ""} en attente de validation.</p>
          <Link href="/admin/oeuvres?statut=EN_ATTENTE" className="rounded-full bg-ember text-cream px-6 py-3 text-xs uppercase tracking-[0.15em] hover:bg-clay transition-colors shrink-0">
            Modérer →
          </Link>
        </div>
      )}
    </div>
  );
}
