import { getSessionWithArtist } from "@/lib/auth";
import { redirect } from "next/navigation";
import { updateArtistProfile } from "@/lib/actions/auth";
import ProfileForm from "@/components/ProfileForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mon profil" };

export default async function Profil() {
  const user = await getSessionWithArtist();
  if (!user?.artist) redirect("/connexion");
  return (
    <div>
      <h1 className="font-display text-4xl">Mon profil</h1>
      <p className="text-fog mt-2 text-sm">Votre vitrine publique : /artistes/{user.artist.slug}</p>
      <div className="mt-10 max-w-2xl">
        <ProfileForm action={updateArtistProfile} artist={user.artist} name={user.artist.user.name} email={user.email} />
      </div>
    </div>
  );
}
