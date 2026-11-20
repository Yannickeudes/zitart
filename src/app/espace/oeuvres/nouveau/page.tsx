import { prisma } from "@/lib/db";
import { getSessionWithArtist } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createArtwork } from "@/lib/actions/artworks";
import ArtworkForm from "@/components/ArtworkForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ajouter une œuvre" };

export default async function Nouveau() {
  const user = await getSessionWithArtist();
  if (!user?.artist) redirect("/connexion");
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="font-display text-4xl">Ajouter une œuvre</h1>
      <p className="text-fog mt-2 text-sm">Elle sera soumise pour validation avant publication.</p>
      <div className="mt-10">
        <ArtworkForm action={createArtwork} categories={categories} />
      </div>
    </div>
  );
}
