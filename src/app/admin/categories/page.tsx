import { prisma } from "@/lib/db";
import { deleteCategory } from "@/lib/actions/admin";
import CategoryForm from "@/components/CategoryForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Catégories" };

export default async function AdminCategories() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { artworks: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Catégories</h1>
      <div className="mt-8 rounded-2xl border border-ink/10 bg-cream p-6">
        <CategoryForm />
      </div>
      <div className="mt-8 space-y-3">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-xl border border-ink/10 bg-cream px-5 py-4">
            <div>
              <p className="font-medium">{c.name} <span className="text-fog text-xs">/{c.slug}</span></p>
              {c.description && <p className="text-xs text-fog">{c.description}</p>}
            </div>
            <div className="flex items-center gap-5 text-sm">
              <span className="text-fog">{c._count.artworks} œuvre{c._count.artworks > 1 ? "s" : ""}</span>
              <form action={async () => { "use server"; await deleteCategory(c.id); }}>
                <button className="text-xs text-brique link-underline">Supprimer</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
