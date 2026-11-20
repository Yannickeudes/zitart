import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Connexion" };

export default async function Connexion() {
  const session = await getSession();
  if (session) redirect(session.role === "ADMIN" ? "/admin" : session.role === "ARTIST" ? "/espace" : "/favoris");

  return (
    <div className="mx-auto max-w-md px-5 pt-36 pb-24">
      <p className="text-[11px] uppercase tracking-[0.3em] text-clay mb-3">Espace membre</p>
      <h1 className="font-display text-4xl sm:text-5xl">Connexion</h1>
      <p className="text-fog text-sm mt-3">Retrouvez vos favoris et gérez votre profil.</p>
      <div className="mt-10">
        <LoginForm />
      </div>
      <p className="mt-8 text-sm text-fog">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="text-ember underline underline-offset-4">Rejoindre Zit'art</Link>
      </p>
      <div className="mt-10 rounded-xl bg-sand/60 p-5 text-xs text-fog leading-relaxed">
        <p className="font-medium text-ink mb-1">Comptes de démonstration</p>
        <p>admin@zitart.demo / admin1234 — artiste@zitart.demo / artiste1234</p>
      </div>
    </div>
  );
}
