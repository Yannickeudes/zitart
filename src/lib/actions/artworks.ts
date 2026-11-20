"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionWithArtist } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import type { ArtworkStatus, Availability } from "@prisma/client";

const artworkSchema = z.object({
  title: z.string().min(2, "Titre requis"),
  description: z.string().max(4000).optional(),
  image: z.string().min(1, "Image requise"),
  categoryId: z.string().min(1, "Catégorie requise"),
  year: z.coerce.number().int().min(1900).max(2100).optional().or(z.literal("")),
  techniques: z.string().max(300).optional(),
  dimensions: z.string().max(200).optional(),
  price: z.coerce.number().min(0).optional().or(z.literal("")),
  availability: z.enum(["DISPONIBLE", "RESERVE", "VENDU"]).default("DISPONIBLE"),
});

export type ArtworkState = { error?: string };

async function uniqueSlug(title: string, excludeId?: string) {
  const base = slugify(title) || "oeuvre";
  let slug = base;
  let i = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const found = await prisma.artwork.findUnique({ where: { slug } });
    if (!found || found.id === excludeId) return slug;
    slug = `${base}-${i++}`;
  }
}

export async function createArtwork(_prev: ArtworkState, formData: FormData): Promise<ArtworkState> {
  const user = await getSessionWithArtist();
  if (!user?.artist) return { error: "Vous devez être connecté en tant qu'artiste." };

  const parsed = artworkSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  const d = parsed.data;

  const slug = await uniqueSlug(d.title);
  await prisma.artwork.create({
    data: {
      title: d.title,
      slug,
      description: d.description || null,
      image: d.image,
      categoryId: d.categoryId,
      year: typeof d.year === "number" ? d.year : null,
      techniques: d.techniques || null,
      dimensions: d.dimensions || null,
      price: typeof d.price === "number" ? d.price : null,
      availability: d.availability as Availability,
      status: "EN_ATTENTE",
      artistId: user.artist.id,
    },
  });
  revalidatePath("/espace/oeuvres");
  revalidatePath("/galerie");
  redirect("/espace/oeuvres?created=1");
}

export async function updateArtwork(id: string, _prev: ArtworkState, formData: FormData): Promise<ArtworkState> {
  const user = await getSessionWithArtist();
  if (!user?.artist) return { error: "Accès refusé." };

  const existing = await prisma.artwork.findUnique({ where: { id } });
  if (!existing || existing.artistId !== user.artist.id) return { error: "Œuvre introuvable." };

  const parsed = artworkSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  const d = parsed.data;

  const slug = await uniqueSlug(d.title, id);
  await prisma.artwork.update({
    where: { id },
    data: {
      title: d.title,
      slug,
      description: d.description || null,
      image: d.image,
      categoryId: d.categoryId,
      year: typeof d.year === "number" ? d.year : null,
      techniques: d.techniques || null,
      dimensions: d.dimensions || null,
      price: typeof d.price === "number" ? d.price : null,
      availability: d.availability as Availability,
      // Une œuvre déjà publiée repasse en attente si le contenu change fortement ? On garde le statut.
      status: existing.status === "PUBLIE" ? ("PUBLIE" as ArtworkStatus) : ("EN_ATTENTE" as ArtworkStatus),
    },
  });
  revalidatePath("/espace/oeuvres");
  revalidatePath(`/oeuvres/${existing.slug}`);
  revalidatePath("/galerie");
  redirect("/espace/oeuvres?updated=1");
}

export async function deleteArtwork(id: string) {
  const user = await getSessionWithArtist();
  if (!user?.artist) return { error: "Accès refusé." };
  const existing = await prisma.artwork.findUnique({ where: { id } });
  if (!existing || existing.artistId !== user.artist.id) return { error: "Œuvre introuvable." };
  await prisma.artwork.delete({ where: { id } });
  revalidatePath("/espace/oeuvres");
  revalidatePath("/galerie");
  return { ok: true };
}
