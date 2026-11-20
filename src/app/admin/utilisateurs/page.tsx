import { prisma } from "@/lib/db";
import { setUserRole } from "@/lib/actions/admin";
import { getSession } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Utilisateurs" };

export default async function AdminUsers() {
  const session = await getSession();
  const users = await prisma.user.findMany({
    include: { artist: true, _count: { select: { favorites: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Utilisateurs</h1>
      <div className="mt-8 rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-[11px] uppercase tracking-[0.15em] text-fog bg-cream">
              <th className="px-5 py-3">Nom</th>
              <th className="px-5 py-3 hidden sm:table-cell">Email</th>
              <th className="px-5 py-3">Rôle</th>
              <th className="px-5 py-3 hidden md:table-cell">Inscrit le</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-ink/5 last:border-0 bg-cream">
                <td className="px-5 py-3 font-medium">
                  {u.name}
                  {u.artist && <span className="block text-xs text-fog font-normal">{u.artist.slug}</span>}
                </td>
                <td className="px-5 py-3 hidden sm:table-cell text-fog">{u.email}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.15em] ${
                    u.role === "ADMIN" ? "bg-ink text-cream" : u.role === "ARTIST" ? "bg-ember/15 text-ember" : "bg-sand text-fog"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 hidden md:table-cell text-fog">
                  {new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(u.createdAt))}
                </td>
                <td className="px-5 py-3">
                  {u.id !== session?.id && (
                    <div className="flex gap-2 justify-end">
                      {u.role !== "ARTIST" && u.role !== "ADMIN" && (
                        <form action={async () => { "use server"; await setUserRole(u.id, "ARTIST"); }}>
                          <button className="text-xs text-ember link-underline">→ Artiste</button>
                        </form>
                      )}
                      {u.role !== "ADMIN" && (
                        <form action={async () => { "use server"; await setUserRole(u.id, "ADMIN"); }}>
                          <button className="text-xs text-fog link-underline">→ Admin</button>
                        </form>
                      )}
                      {u.role !== "VISITOR" && (
                        <form action={async () => { "use server"; await setUserRole(u.id, "VISITOR"); }}>
                          <button className="text-xs text-fog link-underline">→ Visiteur</button>
                        </form>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
