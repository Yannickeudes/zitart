import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import RegisterForm from "@/components/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Rejoindre Zit'art" };

export default async function Inscription() {
  const session = await getSession();
  if (session) redirect("/");

  return (
    <div className="mx-auto max-w-md px-5 pt-36 pb-24">
      <p className="text-[11px] uppercase tracking-[0.3em] text-clay mb-3">Rejoindre</p>
      <h1 className="font-display text-4xl sm:text-5xl">Créer un compte</h1>
      <p className="text-fog text-sm mt-3">Visiteur ou artiste — choisissez votre place sur Zit'art.</p>
      <div className="mt-10">
        <RegisterForm />
      </div>
      <p className="mt-8 text-sm text-fog">
        Déjà inscrit ? <Link href="/connexion" className="text-ember underline underline-offset-4">Se connecter</Link>
      </p>
    </div>
  );
}
