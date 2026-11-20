"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function toggleFavorite(artworkId: string) {
  const session = await getSession();
  if (!session) return { ok: false, requiresAuth: true };

  const existing = await prisma.favorite.findUnique({
    where: { userId_artworkId: { userId: session.id, artworkId } },
  });
  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    revalidatePath("/favoris");
    return { ok: true, favorited: false };
  }
  await prisma.favorite.create({ data: { userId: session.id, artworkId } });
  revalidatePath("/favoris");
  return { ok: true, favorited: true };
}
