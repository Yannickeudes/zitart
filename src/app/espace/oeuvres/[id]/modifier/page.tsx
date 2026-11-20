import { prisma } from "@/lib/db";
import { getSessionWithArtist } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { updateArtwork } from "@/lib/actions/artworks";
import ArtworkForm from "@/components/ArtworkForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Modifier une œuvre" };

export default async function Modifier({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionWithArtist();
  if (!user?.artist) redirect("/connexion");

  const [artwork, categories] = await Promise.all([
    prisma.artwork.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!artwork || artwork.artistId !== user.artist.id) notFound();

  const bound = updateArtwork.bind(null, id);
  return (
    <div>
      <h1 className="font-display text-4xl">Modifier « {artwork.title} »</h1>
      <p className="text-fog mt-2 text-sm">Statut actuel : {artwork.status}</p>
      <div className="mt-10">
        <ArtworkForm
          action={bound}
          categories={categories}
          artwork={{
            title: artwork.title,
            description: artwork.description,
            image: artwork.image,
            categoryId: artwork.categoryId,
            year: artwork.year,
            techniques: artwork.techniques,
            dimensions: artwork.dimensions,
            price: artwork.price,
            availability: artwork.availability,
          }}
        />
      </div>
    </div>
  );
}
