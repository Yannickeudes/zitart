import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'équipe Zit'art : demandes d'information, collaborations, expositions.",
};

export default function Contact() {
  return (
    <div className="mx-auto max-w-[1600px] px-5 sm:px-8 pt-32 sm:pt-36 pb-24">
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.3em] text-clay mb-3">Contact</p>
            <h1 className="font-display text-5xl sm:text-6xl leading-tight">
              Parlons de <span className="italic text-ember">création.</span>
            </h1>
            <p className="mt-6 text-fog leading-relaxed max-w-md">
              Une question sur une œuvre, une demande de collaboration, une exposition à organiser ?
              Écrivez-nous — nous répondons sous 48h.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12 space-y-6">
              <div className="rounded-2xl bg-ink text-cream p-7 grain relative overflow-hidden">
                <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Pour les artistes</p>
                <p className="font-display text-2xl mt-2">Rejoignez la plateforme</p>
                <p className="text-fog text-sm mt-2">Vitrame numérique, visibilité, mise en relation.</p>
                <a href="/inscription" className="inline-block mt-4 text-sm text-ember underline underline-offset-4">Créer un compte artiste →</a>
              </div>
              <div className="rounded-2xl border border-ink/10 p-7">
                <p className="text-[11px] uppercase tracking-[0.25em] text-clay">Coordonnées</p>
                <p className="mt-3 text-fog text-sm">bonjour@zitart.art</p>
                <p className="text-fog text-sm">Abidjan · Dakar · Lagos · Paris</p>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <Reveal delay={100}>
            <div className="rounded-3xl border border-ink/10 bg-linen p-8 sm:p-12">
              <h2 className="font-display text-2xl mb-8">Envoyez un message</h2>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
