import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { getSessionWithArtist } from "@/lib/auth";

const MAX_SIZE = 8 * 1024 * 1024; // 8 Mo
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

export async function POST(req: NextRequest) {
  const user = await getSessionWithArtist();
  if (!user || user.role !== "ARTIST") {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Format non supporté (jpg, png, webp, gif, svg)." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Fichier trop volumineux (8 Mo max)." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const safe = `u${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${["jpg","jpeg","png","webp","gif","svg"].includes(ext) ? ext : "jpg"}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, safe), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/uploads/${safe}` });
}
