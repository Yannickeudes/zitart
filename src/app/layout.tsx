import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/NavServer";
import Footer from "@/components/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Zit'art — L'art s'exprime. Zit'art le révèle.",
    template: "%s · Zit'art",
  },
  description:
    "Zit'art est la plateforme de découverte et de valorisation des artistes africains et de leurs créations : peinture, sculpture, photographie, art numérique et artisanat.",
  openGraph: {
    title: "Zit'art — L'art s'exprime. Zit'art le révèle.",
    description: "Découvrez les artistes, explorez leurs univers et soutenez la création africaine contemporaine.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-cream text-ink">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
