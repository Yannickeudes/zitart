"use client";

import { useActionState, useRef, useState } from "react";
import type { ArtworkState } from "@/lib/actions/artworks";

type Category = { id: string; name: string };
type Artwork = {
  title: string;
  description: string | null;
  image: string;
  categoryId: string;
  year: number | null;
  techniques: string | null;
  dimensions: string | null;
  price: number | null;
  availability: string;
};

export default function ArtworkForm({
  action,
  categories,
  artwork,
}: {
  action: (prev: ArtworkState, formData: FormData) => Promise<ArtworkState>;
  categories: Category[];
  artwork?: Artwork;
}) {
  const [state, formAction, pending] = useActionState<ArtworkState, FormData>(action, {});
  const [image, setImage] = useState(artwork?.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (res.ok && data.url) setImage(data.url);
    else setUploadError(data.error ?? "Échec de l'envoi.");
  }

  return (
    <form action={formAction} className="space-y-8 max-w-3xl">
      <input type="hidden" name="image" value={image} />

      {/* Image */}
      <div>
        <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-2">Image de l'œuvre *</label>
        <div className="flex gap-6 items-start flex-wrap">
          <div className="relative w-40 aspect-[4/5] bg-sand rounded-xl overflow-hidden shrink-0">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-fog text-xs text-center px-3">Aucune image</div>
            )}
          </div>
          <div className="flex-1 min-w-[200px]">
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="rounded-full border border-ink/20 px-6 py-3 text-xs uppercase tracking-[0.15em] hover:border-ember hover:text-ember transition-colors disabled:opacity-50"
            >
              {uploading ? "Envoi…" : image ? "Changer l'image" : "Choisir une image"}
            </button>
            <p className="text-xs text-fog mt-3">JPG, PNG, WebP — 8 Mo max.</p>
            {uploadError && <p className="text-xs text-brique mt-2">{uploadError}</p>}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="sm:col-span-2">
          <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Titre *</label>
          <input name="title" required defaultValue={artwork?.title} className="input" placeholder="Nom de l'œuvre" />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Catégorie *</label>
          <select name="categoryId" required defaultValue={artwork?.categoryId} className="input">
            <option value="">Choisir…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Année</label>
          <input name="year" type="number" min={1900} max={2100} defaultValue={artwork?.year ?? ""} className="input" placeholder="2025" />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Techniques</label>
          <input name="techniques" defaultValue={artwork?.techniques ?? ""} className="input" placeholder="Acrylique, collage…" />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Dimensions</label>
          <input name="dimensions" defaultValue={artwork?.dimensions ?? ""} className="input" placeholder="100 × 80 cm" />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Prix (FCFA)</label>
          <input name="price" type="number" min={0} step="any" defaultValue={artwork?.price ?? ""} className="input" placeholder="Laisser vide = sur demande" />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Disponibilité</label>
          <select name="availability" defaultValue={artwork?.availability ?? "DISPONIBLE"} className="input">
            <option value="DISPONIBLE">Disponible</option>
            <option value="RESERVE">Réservé</option>
            <option value="VENDU">Vendu</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-[11px] uppercase tracking-[0.2em] text-fog block mb-1">Description</label>
          <textarea name="description" rows={5} defaultValue={artwork?.description ?? ""} className="input resize-none" placeholder="L'histoire derrière l'œuvre, la technique, l'inspiration…" />
        </div>
      </div>

      {state.error && <p className="text-sm text-brique">{state.error}</p>}
      {!image && <p className="text-sm text-ember">Une image est requise pour soumettre l'œuvre.</p>}

      <button
        disabled={pending || !image}
        className="rounded-full bg-ink text-cream px-10 py-4 text-xs uppercase tracking-[0.15em] hover:bg-ember transition-colors disabled:opacity-50"
      >
        {pending ? "Enregistrement…" : artwork ? "Enregistrer les modifications" : "Soumettre l'œuvre"}
      </button>
      <p className="text-xs text-fog">Les nouvelles œuvres sont examinées par l'équipe Zit'art avant publication.</p>
    </form>
  );
}
