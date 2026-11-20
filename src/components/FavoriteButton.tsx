"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleFavorite } from "@/lib/actions/favorites";

export default function FavoriteButton({
  artworkId,
  initial,
  className = "",
}: {
  artworkId: string;
  initial: boolean;
  className?: string;
}) {
  const [fav, setFav] = useState(initial);
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
      disabled={pending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        start(async () => {
          const res = await toggleFavorite(artworkId);
          if (res.requiresAuth) {
            router.push("/connexion");
            return;
          }
          if (res.ok) setFav(res.favorited ?? !fav);
        });
      }}
      className={`absolute top-3 right-3 z-10 ${className}`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-all ${
          fav
            ? "bg-ember text-cream"
            : "bg-cream/85 text-ink hover:bg-cream"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </span>
    </button>
  );
}
