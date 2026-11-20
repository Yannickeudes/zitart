# Zit'art

> **L'art s'exprime. Zit'art le révèle.**

Plateforme de découverte et de valorisation des artistes africains et de leurs créations : peinture, sculpture, photographie, art numérique, artisanat, design et mode.

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS 4** — direction artistique sur mesure (encre, crème, terre, orange brûlé)
- **Prisma 6 + SQLite** (bascule PostgreSQL possible via `DATABASE_URL`)
- **Auth maison** : sessions JWT signées (`jose`), mots de passe bcrypt, rôles `VISITOR / ARTIST / ADMIN`
- **Uploads** : images vers `public/uploads` via route API

## Démarrage

```bash
npm install
npx prisma db push
npm run db:seed      # données de démonstration
npm run dev          # http://localhost:3000
```

Ou en production :

```bash
npm run build && npm start
```

## Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | `admin@zitart.demo` | `admin1234` |
| Artiste | `artiste@zitart.demo` | `artiste1234` |
| Visiteur | `visiteur@zitart.demo` | `visiteur1234` |

> Les artistes et œuvres seedés sont **fictifs** (avatars et œuvres SVG génératifs dans `public/art/`, régénérables via `npm run art:gen`).

## Fonctionnalités

- **Public** : accueil éditorial, galerie (recherche, filtres catégorie/artiste, tri, pagination), fiche œuvre, profils artistes, événements, contact, 404 soignée, SEO/Open Graph.
- **Visiteur** : inscription, connexion, favoris.
- **Artiste** (`/espace`) : profil public, CRUD œuvres avec upload d'image, œuvres soumises en `EN_ATTENTE` de modération, tableau de bord (vues, favoris).
- **Admin** (`/admin`) : statistiques, modération des œuvres (approuver/refuser), mise en vedette artistes & œuvres, gestion catégories, événements, messages, rôles utilisateurs.

## Structure

```
src/
  app/            routes (pages + api/upload + api/auth/logout)
  components/     Navbar, Footer, ArtworkCard, formulaires…
  lib/
    db.ts         client Prisma
    auth.ts       sessions JWT + helpers rôles
    actions/      server actions (auth, artworks, admin, contact, favorites)
    utils.ts      slug, formats
prisma/           schema.prisma + seed.ts
scripts/          gen-art.mjs (œuvres SVG génératives)
public/art/       visuels de démonstration générés
```

## Variables d'environnement

Voir `.env.example`. Points clés :

- `DATABASE_URL` — `file:./dev.db` (SQLite) ou `postgresql://…`
- `AUTH_SECRET` — **à changer en production**
- `NEXT_PUBLIC_SITE_URL` — URL publique (OG, uploads)

## Passage à PostgreSQL

1. `provider = "postgresql"` dans `prisma/schema.prisma`
2. `DATABASE_URL="postgresql://user:pass@host:5432/zitart"`
3. `npx prisma db push && npm run db:seed`

## Feuille de route (post-MVP)

- Paiements / commandes d'œuvres, messagerie interne
- Notifications email (Resend), rate-limiting
- Cache Redis, CDN images (Cloudinary/S3)
- i18n, mode sombre
