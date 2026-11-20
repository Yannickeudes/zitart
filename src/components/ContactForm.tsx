"use client";

import { useActionState } from "react";
import { sendContact, type ContactState } from "@/lib/actions/contact";

export default function ContactForm({
  artworkId,
  artistName,
  compact = false,
}: {
  artworkId?: string;
  artistName?: string;
  compact?: boolean;
}) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, {});

  if (state.success) {
    return (
      <div className="rounded-2xl border border-ember/40 bg-linen p-6">
        <p className="font-display text-xl">Message envoyé ✓</p>
        <p className="text-sm text-fog mt-1">
          {artistName ? `${artistName} vous répondra rapidement.` : "L'équipe Zit'art vous répondra rapidement."}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className={compact ? "space-y-4" : "max-w-2xl mx-auto space-y-6"}>
      {artworkId && <input type="hidden" name="artworkId" value={artworkId} />}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Nom</label>
          <input name="name" required className="input" placeholder="Votre nom" />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Email</label>
          <input name="email" type="email" required className="input" placeholder="vous@exemple.com" />
        </div>
      </div>
      {!compact && (
        <div>
          <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Sujet</label>
          <input name="subject" className="input" placeholder="Objet de votre message" />
        </div>
      )}
      <div>
        <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">
          Message {artistName ? `à ${artistName}` : ""}
        </label>
        <textarea name="message" required rows={compact ? 3 : 6} className="input resize-none" placeholder="Décrivez votre demande…" />
      </div>
      {state.error && <p className="text-sm text-brique">{state.error}</p>}
      <button
        disabled={pending}
        className="rounded-full bg-ink text-cream px-8 py-3.5 text-xs uppercase tracking-[0.15em] hover:bg-ember transition-colors disabled:opacity-50"
      >
        {pending ? "Envoi…" : "Envoyer"}
      </button>
    </form>
  );
}
