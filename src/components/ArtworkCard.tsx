import Link from "next/link";
import Image from "next/image";
import type { Artwork, Artist, Category } from "@prisma/client";
import { formatPrice, AVAILABILITY_LABELS } from "@/lib/utils";
import FavoriteButton from "./FavoriteButton";

type ArtworkWith = Artwork & { artist: Artist & { user: { name: string } }; category: Category };

export default function ArtworkCard({
  artwork,
  favorited = false,
  large = false,
}: {
  artwork: ArtworkWith;
  favorited?: boolean;
  large?: boolean;
}) {
  return (
    <article className="group relative">
      <Link href={`/oeuvres/${artwork.slug}`} className="block">
        <div className={`relative overflow-hidden bg-sand ${large ? "aspect-[4/5]" : "aspect-[4/5]"}`}>
          <Image
            src={artwork.image}
            alt={artwork.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-500" />
          <span className="absolute top-3 left-3 rounded-full bg-cream/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-ink">
            {artwork.category.name}
          </span>
          {artwork.availability !== "DISPONIBLE" && (
            <span className="absolute top-3 right-3 rounded-full bg-ink/80 text-cream px-3 py-1 text-[10px] uppercase tracking-[0.15em]">
              {AVAILABILITY_LABELS[artwork.availability]}
            </span>
          )}
        </div>
      </Link>
      <FavoriteButton artworkId={artwork.id} initial={favorited} />
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <Link href={`/oeuvres/${artwork.slug}`}>
            <h3 className={`font-display leading-tight group-hover:text-ember transition-colors ${large ? "text-2xl" : "text-lg"}`}>
              {artwork.title}
            </h3>
          </Link>
          <Link href={`/artistes/${artwork.artist.slug}`} className="text-sm text-fog hover:text-ember transition-colors">
            {artwork.artist.user.name}
          </Link>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-medium">{formatPrice(artwork.price)}</p>
          {artwork.year && <p className="text-xs text-fog">{artwork.year}</p>}
        </div>
      </div>
    </article>
  );
}
