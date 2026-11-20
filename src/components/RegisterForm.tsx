"use client";

import { useActionState, useState } from "react";
import { register, type AuthState } from "@/lib/actions/auth";

export default function RegisterForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(register, {});
  const [role, setRole] = useState<"VISITOR" | "ARTIST">("VISITOR");

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="role" value={role} />
      <div className="grid grid-cols-2 gap-3">
        {(["VISITOR", "ARTIST"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`rounded-2xl border p-4 text-left transition-all ${
              role === r ? "border-ember bg-linen" : "border-ink/15 hover:border-ink/40"
            }`}
          >
            <p className="font-display text-lg">{r === "ARTIST" ? "Artiste" : "Visiteur"}</p>
            <p className="text-xs text-fog mt-1">
              {r === "ARTIST" ? "Publier et gérer mes œuvres" : "Découvrir et sauvegarder"}
            </p>
          </button>
        ))}
      </div>
      <div>
        <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Nom / Nom artistique</label>
        <input name="name" required className="input" placeholder="Votre nom" />
      </div>
      <div>
        <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Email</label>
        <input name="email" type="email" required className="input" placeholder="vous@exemple.com" />
      </div>
      <div>
        <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Mot de passe</label>
        <input name="password" type="password" required minLength={8} className="input" placeholder="8 caractères minimum" />
      </div>
      {state.error && <p className="text-sm text-brique">{state.error}</p>}
      <button disabled={pending} className="w-full rounded-full bg-ink text-cream py-4 text-xs uppercase tracking-[0.15em] hover:bg-ember transition-colors disabled:opacity-50">
        {pending ? "Création…" : "Créer mon compte"}
      </button>
    </form>
  );
}
