"use client";

import { useActionState } from "react";
import { login, type AuthState } from "@/lib/actions/auth";

export default function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(login, {});
  return (
    <form action={action} className="space-y-6">
      <div>
        <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Email</label>
        <input name="email" type="email" required className="input" placeholder="vous@exemple.com" />
      </div>
      <div>
        <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Mot de passe</label>
        <input name="password" type="password" required className="input" placeholder="••••••••" />
      </div>
      {state.error && <p className="text-sm text-brique">{state.error}</p>}
      <button disabled={pending} className="w-full rounded-full bg-ink text-cream py-4 text-xs uppercase tracking-[0.15em] hover:bg-ember transition-colors disabled:opacity-50">
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
