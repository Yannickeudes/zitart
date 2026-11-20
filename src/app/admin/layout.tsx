import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/oeuvres", label: "Œuvres" },
  { href: "/admin/artistes", label: "Artistes" },
  { href: "/admin/categories", label: "Catégories" },
  { href: "/admin/evenements", label: "Événements" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/utilisateurs", label: "Utilisateurs" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/connexion");
  if (session.role !== "ADMIN") redirect("/");

  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-28 sm:pt-32 pb-20">
      <div className="flex flex-col md:flex-row gap-10">
        <aside className="md:w-56 shrink-0">
          <p className="text-[11px] uppercase tracking-[0.3em] text-clay mb-2">Administration</p>
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-full md:rounded-lg px-4 py-2.5 text-sm hover:bg-sand transition-colors">
                {n.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
