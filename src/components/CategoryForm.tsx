"use client";

import { useActionState } from "react";
import { createCategory } from "@/lib/actions/admin";

export default function CategoryForm() {
  const [state, action, pending] = useActionState<{ error?: string; success?: boolean }, FormData>(createCategory, {});
  return (
    <form action={action} className="flex flex-col sm:flex-row gap-3 items-end">
      <div className="flex-1 w-full">
        <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Nom</label>
        <input name="name" required className="input" placeholder="Nouvelle discipline…" />
      </div>
      <div className="flex-1 w-full">
        <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Description</label>
        <input name="description" className="input" placeholder="Optionnel" />
      </div>
      <button disabled={pending} className="rounded-full bg-ink text-cream px-6 py-3 text-xs uppercase tracking-[0.15em] hover:bg-ember transition-colors disabled:opacity-50 whitespace-nowrap">
        Ajouter
      </button>
      {state.error && <p className="text-sm text-brique w-full">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald-700 w-full">Catégorie ajoutée ✓</p>}
    </form>
  );
}
