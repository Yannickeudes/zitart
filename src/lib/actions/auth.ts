"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession, destroySession, getSessionWithArtist } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export type AuthState = { error?: string };

const registerSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
  role: z.enum(["VISITOR", "ARTIST"]).default("VISITOR"),
});

export async function register(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role") ?? "VISITOR",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides" };

  const { name, email, password, role } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { error: "Un compte existe déjà avec cet email." };

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role },
  });

  if (role === "ARTIST") {
    const base = slugify(name) || `artiste-${user.id.slice(-6)}`;
    let slug = base;
    let i = 1;
    while (await prisma.artist.findUnique({ where: { slug } })) {
      slug = `${base}-${i++}`;
    }
    await prisma.artist.create({
      data: { slug, userId: user.id, bio: "" },
    });
  }

  await createSession({ id: user.id, name: user.name, email: user.email, role: user.role });
  redirect(role === "ARTIST" ? "/espace/profil" : "/");
}

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Email ou mot de passe incorrect." };
  }
  let artistSlug: string | undefined;
  if (user.role === "ARTIST") {
    const artist = await prisma.artist.findUnique({ where: { userId: user.id } });
    artistSlug = artist?.slug;
  }
  await createSession({ id: user.id, name: user.name, email: user.email, role: user.role, artistSlug });
  if (user.role === "ADMIN") redirect("/admin");
  if (user.role === "ARTIST") redirect("/espace");
  redirect("/favoris");
}

export async function logout() {
  await destroySession();
  redirect("/");
}

export async function updateArtistProfile(_prev: { error?: string; success?: boolean }, formData: FormData) {
  const user = await getSessionWithArtist();
  if (!user?.artist) return { error: "Profil artiste introuvable." };

  const bio = String(formData.get("bio") ?? "").slice(0, 4000);
  const location = String(formData.get("location") ?? "").slice(0, 200);
  const disciplines = String(formData.get("disciplines") ?? "").slice(0, 300);
  const website = String(formData.get("website") ?? "").slice(0, 300);
  const instagram = String(formData.get("instagram") ?? "").slice(0, 100);
  const twitter = String(formData.get("twitter") ?? "").slice(0, 100);
  const avatar = String(formData.get("avatar") ?? "").slice(0, 300);

  await prisma.artist.update({
    where: { id: user.artist.id },
    data: {
      bio, location, disciplines, website, instagram, twitter,
      ...(avatar ? { avatar } : {}),
    },
  });
  return { success: true };
}
