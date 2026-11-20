"use client";

import { useActionState } from "react";
import { createEvent } from "@/lib/actions/admin";

export default function EventForm() {
  const [state, action, pending] = useActionState<{ error?: string; success?: boolean }, FormData>(createEvent, {});
  return (
    <form action={action} className="grid sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Titre *</label>
        <input name="title" required className="input" />
      </div>
      <div>
        <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Date *</label>
        <input name="date" type="datetime-local" required className="input" />
      </div>
      <div>
        <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Lieu</label>
        <input name="location" className="input" />
      </div>
      <div>
        <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Organisateur</label>
        <input name="organizer" className="input" />
      </div>
      <div>
        <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Lien</label>
        <input name="link" type="url" className="input" placeholder="https://…" />
      </div>
      <div className="sm:col-span-2">
        <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Image (URL)</label>
        <input name="image" className="input" placeholder="/art/evenement-1.svg" />
      </div>
      <div className="sm:col-span-2">
        <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Description</label>
        <textarea name="description" rows={3} className="input resize-none" />
      </div>
      {state.error && <p className="text-sm text-brique sm:col-span-2">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald-700 sm:col-span-2">Événement créé ✓</p>}
      <div className="sm:col-span-2">
        <button disabled={pending} className="rounded-full bg-ink text-cream px-8 py-3.5 text-xs uppercase tracking-[0.15em] hover:bg-ember transition-colors disabled:opacity-50">
          {pending ? "Création…" : "Créer l'événement"}
        </button>
      </div>
    </form>
  );
}
