"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import type { ArtworkStatus } from "@prisma/client";

async function admin() {
  return requireRole("ADMIN");
}

export async function setArtworkStatus(id: string, status: ArtworkStatus) {
  if (!(await admin())) return { error: "Accès refusé." };
  const a = await prisma.artwork.findUnique({ where: { id } });
  if (!a) return { error: "Introuvable." };
  await prisma.artwork.update({ where: { id }, data: { status } });
  revalidatePath("/admin/oeuvres");
  revalidatePath("/galerie");
  revalidatePath(`/oeuvres/${a.slug}`);
  return { ok: true };
}

export async function deleteArtworkAdmin(id: string) {
  if (!(await admin())) return { error: "Accès refusé." };
  await prisma.artwork.delete({ where: { id } });
  revalidatePath("/admin/oeuvres");
  revalidatePath("/galerie");
  return { ok: true };
}

export async function toggleFeaturedArtwork(id: string) {
  if (!(await admin())) return { error: "Accès refusé." };
  const a = await prisma.artwork.findUnique({ where: { id } });
  if (!a) return { error: "Introuvable." };
  await prisma.artwork.update({ where: { id }, data: { featured: !a.featured } });
  revalidatePath("/admin/oeuvres");
  revalidatePath("/");
  return { ok: true };
}

export async function toggleFeaturedArtist(id: string) {
  if (!(await admin())) return { error: "Accès refusé." };
  const a = await prisma.artist.findUnique({ where: { id } });
  if (!a) return { error: "Introuvable." };
  await prisma.artist.update({ where: { id }, data: { featured: !a.featured } });
  revalidatePath("/admin/artistes");
  revalidatePath("/");
  revalidatePath("/artistes");
  return { ok: true };
}

const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().max(300).optional(),
});

export async function createCategory(_prev: { error?: string; success?: boolean }, formData: FormData) {
  if (!(await admin())) return { error: "Accès refusé." };
  const parsed = categorySchema.safeParse({ name: formData.get("name"), description: formData.get("description") || undefined });
  if (!parsed.success) return { error: "Nom requis" };
  const slug = slugify(parsed.data.name);
  try {
    await prisma.category.create({
      data: { name: parsed.data.name, slug, description: parsed.data.description || null },
    });
  } catch {
    return { error: "Cette catégorie existe déjà." };
  }
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  if (!(await admin())) return { error: "Accès refusé." };
  const count = await prisma.artwork.count({ where: { categoryId: id } });
  if (count > 0) return { error: `Impossible : ${count} œuvre(s) utilisent cette catégorie.` };
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  return { ok: true };
}

const eventSchema = z.object({
  title: z.string().min(2, "Titre requis"),
  description: z.string().max(4000).optional(),
  image: z.string().optional(),
  date: z.string().min(1, "Date requise"),
  location: z.string().max(200).optional(),
  organizer: z.string().max(200).optional(),
  link: z.string().url().optional().or(z.literal("")),
});

export async function createEvent(_prev: { error?: string; success?: boolean }, formData: FormData) {
  if (!(await admin())) return { error: "Accès refusé." };
  const parsed = eventSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  const d = parsed.data;
  const slug = `${slugify(d.title)}-${Date.now().toString(36)}`;
  await prisma.event.create({
    data: {
      title: d.title, slug, description: d.description || null,
      image: d.image || null, date: new Date(d.date),
      location: d.location || null, organizer: d.organizer || null,
      link: d.link || null,
    },
  });
  revalidatePath("/evenements");
  revalidatePath("/admin/evenements");
  return { success: true };
}

export async function deleteEvent(id: string) {
  if (!(await admin())) return { error: "Accès refusé." };
  await prisma.event.delete({ where: { id } });
  revalidatePath("/evenements");
  revalidatePath("/admin/evenements");
  return { ok: true };
}

export async function setUserRole(userId: string, role: "VISITOR" | "ARTIST" | "ADMIN") {
  const session = await admin();
  if (!session) return { error: "Accès refusé." };
  if (userId === session.id && role !== "ADMIN") return { error: "Vous ne pouvez pas retirer votre propre rôle admin." };
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/utilisateurs");
  return { ok: true };
}
