"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, "Message trop court (10 caractères min.)"),
  artworkId: z.string().optional(),
});

export type ContactState = { error?: string; success?: boolean };

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
    artworkId: formData.get("artworkId") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };

  const session = await getSession();
  await prisma.contactMessage.create({
    data: {
      ...parsed.data,
      subject: parsed.data.subject || null,
      artworkId: parsed.data.artworkId || null,
      authorId: session?.id ?? null,
    },
  });
  return { success: true };
}

export async function markMessageRead(id: string) {
  const { requireRole } = await import("@/lib/auth");
  const admin = await requireRole("ADMIN");
  if (!admin) return;
  await prisma.contactMessage.update({ where: { id }, data: { status: "LU" } });
  revalidatePath("/admin/messages");
}
