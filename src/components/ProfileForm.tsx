"use client";

import { useActionState, useRef, useState } from "react";
import type { Artist } from "@prisma/client";

type State = { error?: string; success?: boolean };

export default function ProfileForm({
  action,
  artist,
  name,
  email,
}: {
  action: (prev: State, formData: FormData) => Promise<State>;
  artist: Artist;
  name: string;
  email: string;
}) {
  const [state, formAction, pending] = useActionState<State, FormData>(action, {});
  const [avatar, setAvatar] = useState(artist.avatar ?? "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (res.ok && data.url) setAvatar(data.url);
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="avatar" value={avatar} />

      <div className="flex items-center gap-5">
        <div className="relative w-20 h-20 rounded-full bg-sand overflow-hidden shrink-0">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-display text-2xl text-fog">{name.charAt(0)}</div>
          )}
        </div>
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="rounded-full border border-ink/20 px-5 py-2.5 text-xs uppercase tracking-[0.15em] hover:border-ember hover:text-ember transition-colors disabled:opacity-50">
            {uploading ? "Envoi…" : "Changer la photo"}
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div>
          <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Nom affiché</label>
          <input value={name} disabled className="input opacity-60" />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Email</label>
          <input value={email} disabled className="input opacity-60" />
        </div>
      </div>

      <div>
        <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Biographie</label>
        <textarea name="bio" rows={6} defaultValue={artist.bio ?? ""} className="input resize-none" placeholder="Votre parcours, votre démarche artistique…" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Localisation</label>
          <input name="location" defaultValue={artist.location ?? ""} className="input" placeholder="Ville, pays" />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Disciplines</label>
          <input name="disciplines" defaultValue={artist.disciplines ?? ""} className="input" placeholder="Peinture, sculpture…" />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Instagram</label>
          <input name="instagram" defaultValue={artist.instagram ?? ""} className="input" placeholder="@votrecompte" />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Twitter / X</label>
          <input name="twitter" defaultValue={artist.twitter ?? ""} className="input" placeholder="@votrecompte" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Site web</label>
          <input name="website" defaultValue={artist.website ?? ""} className="input" placeholder="https://…" />
        </div>
      </div>

      {state.error && <p className="text-sm text-brique">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald-700">Profil enregistré ✓</p>}

      <button disabled={pending} className="rounded-full bg-ink text-cream px-10 py-4 text-xs uppercase tracking-[0.15em] hover:bg-ember transition-colors disabled:opacity-50">
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
