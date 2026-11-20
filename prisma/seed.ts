import { PrismaClient, Role, ArtworkStatus, Availability } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ART_IMAGES = Array.from({ length: 36 }, (_, i) => `/art/oeuvre-${String(i + 1).padStart(2, "0")}.svg`);

const ARTISTS = [
  {
    slug: "awa-kone", name: "Awa Koné", email: "awa@zitart.demo",
    bio: "Peintre et plasticienne based à Abidjan, Awa explore les textures de la terre rouge et les motifs de tissage baoulé pour créer des toiles qui racontent la mémoire des femmes de sa famille. Son travail a été exposé à la Fondation Zinsou et à la Biennale de Dakar.",
    location: "Abidjan, Côte d'Ivoire", disciplines: "Peinture, Collage",
    website: "", instagram: "@awa.kone.art", twitter: "", avatar: "/art/avatars/avatar-1.svg",
    artworks: [
      { title: "Terre de Grand-Bassam", description: "Toile acrylique et pigments naturels sur lin. Une marche le long du littoral, entre lumière et mémoire.", category: "Peinture", year: 2024, techniques: "Acrylique, pigments", dimensions: "120 × 160 cm", price: 450000, img: 0 },
      { title: "Totem III", description: "Série totem : figures monumentales inspirées des strombolis et des masques dan.", category: "Peinture", year: 2023, techniques: "Acrylique sur toile", dimensions: "100 × 100 cm", price: 380000, img: 1 },
      { title: "Fragments de pagne", description: "Collage de tissus wax et acrylique. Le pagne comme document d'histoire.", category: "Peinture", year: 2024, techniques: "Collage, acrylique", dimensions: "80 × 80 cm", price: null, img: 2 },
    ],
  },
  {
    slug: "moussa-diallo", name: "Moussa Diallo", email: "moussa@zitart.demo",
    bio: "Sculpteur sénégalais, Moussa travaille le bois de tek et la terre cuite pour donner forme à des silhouettes qui dialoguent avec la sculpture africaine contemporaine. Il enseigne la sculpture à l'Université Cheikh Anta Diop.",
    location: "Dakar, Sénégal", disciplines: "Sculpture, Céramique",
    website: "", instagram: "@moussa.diallo.sculpteur", twitter: "", avatar: "/art/avatars/avatar-2.svg",
    artworks: [
      { title: "Ange de la delta", description: "Bois de tek poli, 180 cm. Figure debout entre figuration et abstraction.", category: "Sculpture", year: 2023, techniques: "Bois de tek", dimensions: "180 × 45 × 45 cm", price: 1200000, img: 3 },
      { title: "Vase Ndop", description: "Terre cuite engobée, cuisson bois. Réinterprétation de la poterie royale bamoum.", category: "Artisanat", year: 2024, techniques: "Céramique", dimensions: "35 × 28 cm", price: 85000, img: 4 },
    ],
  },
  {
    slug: "nia-okafor", name: "Nia Okafor", email: "nia@zitart.demo",
    bio: "Illustratrice nigériane basée à Lagos, Nia mêle illustration numérique et techniques mixtes pour explorer l'identité, la mode et la culture pop africaine. Ses visuels circulent dans la presse internationale.",
    location: "Lagos, Nigeria", disciplines: "Illustration, Art numérique",
    website: "", instagram: "@nia.draws", twitter: "@niadraws", avatar: "/art/avatars/avatar-3.svg",
    artworks: [
      { title: "Saxophone City", description: "Illustration numérique — Lagos nocturne, jazz et néons.", category: "Illustration", year: 2024, techniques: "Illustration numérique", dimensions: "Format digital", price: null, img: 5 },
      { title: "Ankara patterns", description: "Série de motifs textiles réinterprétés en illustration vectorielle.", category: "Art numérique", year: 2023, techniques: "Vectoriel", dimensions: "Éditions de 50", price: 150000, img: 6 },
    ],
  },
  {
    slug: "kofi-mensah", name: "Kofi Mensah", email: "kofi@zitart.demo",
    bio: "Photographe documentaire ghanéen, Kofi capture les marchés, les rites et les rituels quotidiens de l'Afrique de l'Ouest. Son travail a été publié par des rédactions européennes et africaines.",
    location: "Accra, Ghana", disciplines: "Photographie",
    website: "", instagram: "@kofi.frames", twitter: "", avatar: "/art/avatars/avatar-4.svg",
    artworks: [
      { title: "Marché de Kaneshie", description: "Tirage argentique, série documentaire sur les commerçants d'Accra.", category: "Photographie", year: 2023, techniques: "Tirage argentique", dimensions: "50 × 70 cm", price: 320000, img: 7 },
      { title: "Les funéraillesroyales", description: "Photo documentaire — festival Ashanti, Ghana.", category: "Photographie", year: 2024, techniques: "Numérique, RAW", dimensions: "60 × 90 cm", price: 410000, img: 8 },
    ],
  },
  {
    slug: "sara-el-amrani", name: "Sara El Amrani", email: "sara@zitart.demo",
    bio: "Designer et artiste textile marocaine, Sara transforme les motifs amazighs et les techniques du tissage en installations et objets d'art contemporain. Basée entre Marrakech et Paris.",
    location: "Marrakech, Maroc", disciplines: "Design, Artisanat",
    website: "", instagram: "@sara.weaves", twitter: "", avatar: "/art/avatars/avatar-5.svg",
    artworks: [
      { title: "Berbère // 04", description: "Tapisserie de laine et chanvre, motifs amazighs réinterprétés.", category: "Artisanat", year: 2024, techniques: "Tissage, laine", dimensions: "200 × 300 cm", price: 950000, img: 9 },
      { title: "Ligne de fracture", description: "Installation de fils de coton teintés — recherche sur les coutures de l'identité.", category: "Design", year: 2023, techniques: "Installation textile", dimensions: "Variable", price: null, img: 10 },
    ],
  },
  {
    slug: "jean-bosco-nkurunziza", name: "Jean-Bosco Nkurunziza", email: "jb@zitart.demo",
    bio: "Artiste numérique burundais, Jean-Bosco crée des mondes visuels mêlant motifs traditionnels, glitch et couleurs chaudes. Son travail explore la mémoire numérique d'un continent en mouvement.",
    location: "Bujumbura, Burundi", disciplines: "Art numérique, Peinture",
    website: "", instagram: "@jb.nk.design", twitter: "", avatar: "/art/avatars/avatar-6.svg",
    artworks: [
      { title: "Glitch", description: "Art numérique génératif — corruption volontaire d'images d'archives.", category: "Art numérique", year: 2024, techniques: "Génératif, NFT-ready", dimensions: "Format digital", price: null, img: 11 },
      { title: "Horizon 2040", description: "Peinture acrylique et aérosol sur toile.", category: "Peinture", year: 2023, techniques: "Acrylique, aérosol", dimensions: "140 × 100 cm", price: 520000, img: 12 },
    ],
  },
];

const EXTRA_ARTWORKS: { title: string; description: string; category: string; year: number; techniques: string; dimensions: string; price: number | null; img: number; artist: number; status?: ArtworkStatus }[] = [
  { title: "Éclat minéral", description: "Acrylique et sable sur toile — textures minérales des carrières du Sahel.", category: "Peinture", year: 2024, techniques: "Acrylique, sable", dimensions: "90 × 90 cm", price: 280000, artist: 0, img: 13 },
  { title: "Mère nourricière", description: "Sculpture bronze patiné — hommage aux figures maternelles.", category: "Sculpture", year: 2023, techniques: "Bronze", dimensions: "60 cm", price: 750000, artist: 1, img: 14 },
  { title: "Studio Sessions", description: "Série de croquis digitaux — coulisses du processus créatif.", category: "Illustration", year: 2024, techniques: "Crayon numérique", dimensions: "Format digital", price: null, artist: 2, img: 15 },
  { title: "Lumière d'Obudu", description: "Photo couleur — montagne des dieux d'Obudu, Nigeria.", category: "Photographie", year: 2023, techniques: "Hasselblad", dimensions: "70 × 50 cm", price: 290000, artist: 3, img: 16 },
  { title: "Tissage des dunes", description: "Tapisserie contemporaine inspirée des motifs sahariens.", category: "Artisanat", year: 2024, techniques: "Laine, coton", dimensions: "180 × 240 cm", price: 680000, artist: 4, img: 17 },
  { title: "Néon baoulé", description: "Composition digitale — néons et symboles akan.", category: "Art numérique", year: 2024, techniques: "3D, néon", dimensions: "Format digital", price: null, artist: 5, img: 18 },
  { title: "Femme au pagne jaune", description: "Portrait acrylique — figure frontale, regard direct.", category: "Peinture", year: 2023, techniques: "Acrylique", dimensions: "100 × 80 cm", price: 340000, artist: 0, img: 19 },
  { title: "Griot numérique", description: "Portrait génératif d'un griot — données, sons et visuels.", category: "Art numérique", year: 2024, techniques: "Génératif", dimensions: "Format digital", price: null, artist: 5, img: 20 },
  { title: "Cercle de feu", description: "Photo en lumière longue — cérémonie nocturne, Bénin.", category: "Photographie", year: 2024, techniques: "Pose longue", dimensions: "80 × 60 cm", price: 360000, artist: 3, img: 21 },
  { title: "Tissu de l'oubli", description: "Installation textile suspendue — tissus usés et réparés.", category: "Design", year: 2023, techniques: "Installation", dimensions: "Variable", price: null, artist: 4, img: 22 },
  { title: "Totem V", description: "Bois et fer forgé — série totem, cinquième itération.", category: "Sculpture", year: 2024, techniques: "Bois, fer", dimensions: "200 × 50 × 50 cm", price: 1100000, artist: 1, img: 23 },
  { title: "Marché aux couleurs", description: "Illustration éditoriale — marché de Dantokpa, Cotonou.", category: "Illustration", year: 2024, techniques: "Encre, numérique", dimensions: "Format digital", price: 90000, artist: 2, img: 24 },
  { title: "Pagne royal", description: "Acrylique sur toile — reproduction contemporaine d'un bogolan.", category: "Peinture", year: 2023, techniques: "Acrylique", dimensions: "110 × 140 cm", price: 420000, artist: 0, img: 25 },
  { title: "Ciel de Ouagadougou", description: "Photo paysage — ciel orageux sur la capitale burkinabè.", category: "Photographie", year: 2024, techniques: "Numérique", dimensions: "60 × 90 cm", price: 240000, artist: 3, img: 26 },
  { title: "Brouillon #07", description: "Croquis à l'encre — étude pour une future toile.", category: "Dessin", year: 2024, techniques: "Encre", dimensions: "A4", price: null, artist: 0, status: ArtworkStatus.BROUILLON, img: 27 },
  { title: "Prototype dentelle", description: "Maquette de bijou en fibres naturelles — pièce unique.", category: "Artisanat", year: 2024, techniques: "Fibres, laiton", dimensions: "15 × 15 cm", price: 45000, artist: 4, status: ArtworkStatus.EN_ATTENTE, img: 28 },
];

const CATEGORIES = [
  { name: "Peinture", slug: "peinture", description: "Toiles, acrylique, pigments naturels" },
  { name: "Illustration", slug: "illustration", description: "Œuvres graphiques et éditoriales" },
  { name: "Dessin", slug: "dessin", description: "Croquis, encre, techniques mixtes" },
  { name: "Photographie", slug: "photographie", description: "Photo documentaire et artistique" },
  { name: "Sculpture", slug: "sculpture", description: "Bois, bronze, terre, métal" },
  { name: "Artisanat", slug: "artisanat", description: "Tissage, céramique, objets" },
  { name: "Art numérique", slug: "art-numerique", description: "Génératif, 3D, digital" },
  { name: "Design", slug: "design", description: "Design textile, installations, objets" },
  { name: "Mode", slug: "mode", description: "Créations vestimentaires" },
];

const EVENTS = [
  { title: "Nuit des ateliers ouverts", description: "Rencontrez les artistes dans leurs ateliers. Entrée libre sur réservation.", date: new Date("2026-12-05T18:00:00"), location: "Abidjan — Plateau", organizer: "Zit'art", image: "/art/evenement-1.svg" },
  { title: "Vernissage — Awa Koné", description: "Vernissage de la série « Terres » d'Awa Koné à la galerie du 5e étage.", date: new Date("2026-12-12T19:00:00"), location: "Dakar — Almadies", organizer: "Galerie Zinsou", image: "/art/evenement-2.svg" },
  { title: "Rencontre : art et mémoire", description: "Table ronde avec Awa Koné, Moussa Diallo et Jean-Bosco Nkurunziza.", date: new Date("2027-01-16T17:30:00"), location: "En ligne + Paris", organizer: "Zit'art", image: "/art/evenement-3.svg" },
  { title: "Atelier tissage — Sara El Amrani", description: "Initiation aux techniques de tissage amazigh en fibres naturelles.", date: new Date("2027-01-24T10:00:00"), location: "Marrakech — Médina", organizer: "Atelier Sara", image: "/art/evenement-4.svg" },
  { title: "Exposition collective « Nouvelles signatures »", description: "Six artistes émergents africains exposés pour la première fois ensemble.", date: new Date("2027-02-14T18:00:00"), location: "Lagos — Yaba", organizer: "Zit'art × Re:define", image: "/art/evenement-5.svg" },
  { title: "Portes ouvertes studio Kofi Mensah", description: "Découvrez les coulisses du travail photographique de Kofi Mensah.", date: new Date("2027-02-28T11:00:00"), location: "Accra — Osu", organizer: "Studio Kofi", image: "/art/evenement-6.svg" },
];

async function main() {
  console.log("Nettoyage…");
  await prisma.contactMessage.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.artwork.deleteMany();
  await prisma.event.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const hash = (p: string) => bcrypt.hashSync(p, 10);

  const admin = await prisma.user.create({
    data: { name: "Admin Zit'art", email: "admin@zitart.demo", passwordHash: hash("admin1234"), role: Role.ADMIN },
  });

  const artistUser = await prisma.user.create({
    data: { name: "Awa Koné", email: "artiste@zitart.demo", passwordHash: hash("artiste1234"), role: Role.ARTIST },
  });

  const visitor = await prisma.user.create({
    data: { name: "Visiteur Démo", email: "visiteur@zitart.demo", passwordHash: hash("visiteur1234"), role: Role.VISITOR },
  });

  // Artistes démo (sauf Awa qui a un vrai compte)
  const artistIds: string[] = [];
  for (const a of ARTISTS) {
    const isAwa = a.slug === "awa-kone";
    const user = isAwa
      ? artistUser
      : await prisma.user.create({
          data: { name: a.name, email: a.email, passwordHash: hash("demo1234"), role: Role.ARTIST },
        });
    const artist = await prisma.artist.create({
      data: {
        slug: a.slug, userId: user.id, bio: a.bio, location: a.location,
        disciplines: a.disciplines, website: a.website, instagram: a.instagram,
        twitter: a.twitter, avatar: a.avatar, featured: isAwa || a.slug === "moussa-diallo",
      },
    });
    artistIds.push(artist.id);
  }

  const catMap = new Map<string, string>();
  for (const c of CATEGORIES) {
    const cat = await prisma.category.create({ data: { name: c.name, slug: c.slug, description: c.description } });
    catMap.set(c.name, cat.id);
  }

  // Œuvres des artistes
  let imgIdx = 0;
  for (let i = 0; i < ARTISTS.length; i++) {
    for (const w of ARTISTS[i].artworks) {
      const status = ARTISTS[i].slug === "awa-kone" && w.title === "Fragments de pagne" ? ArtworkStatus.EN_ATTENTE : ArtworkStatus.PUBLIE;
      await prisma.artwork.create({
        data: {
          title: w.title, slug: `${ARTISTS[i].slug}-${w.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
          description: w.description, image: ART_IMAGES[w.img], year: w.year,
          techniques: w.techniques, dimensions: w.dimensions,
          price: w.price ?? null, availability: w.price ? Availability.DISPONIBLE : Availability.DISPONIBLE,
          status, featured: w.img === 0 || w.img === 3,
          artistId: artistIds[i], categoryId: catMap.get(w.category)!,
          views: 40 + ((w.img * 37) % 500),
        },
      });
    }
  }

  // Œuvres supplémentaires réparties entre artistes
  for (const w of EXTRA_ARTWORKS) {
    const artist = ARTISTS[w.artist];
    const artistId = artistIds[w.artist];
    await prisma.artwork.create({
      data: {
        title: w.title, slug: `extra-${w.img}-${w.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
        description: w.description, image: ART_IMAGES[w.img], year: w.year,
        techniques: w.techniques, dimensions: w.dimensions, price: w.price,
        status: w.status ?? ArtworkStatus.PUBLIE,
        availability: w.price ? (w.img % 7 === 0 ? Availability.RESERVE : Availability.DISPONIBLE) : Availability.DISPONIBLE,
        artistId, categoryId: catMap.get(w.category)!,
        views: 20 + ((w.img * 53) % 400),
      },
    });
  }

  for (const e of EVENTS) {
    await prisma.event.create({
      data: {
        title: e.title, slug: e.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        description: e.description, image: e.image, date: e.date, location: e.location,
        organizer: e.organizer,
      },
    });
  }

  // Quelques favoris pour le visiteur démo
  const published = await prisma.artwork.findMany({ where: { status: ArtworkStatus.PUBLIE }, take: 3 });
  for (const a of published) {
    await prisma.favorite.create({ data: { userId: visitor.id, artworkId: a.id } });
  }

  console.log(`Seed OK : ${ARTISTS.length} artistes, ${CATEGORIES.length} catégories, ${await prisma.artwork.count()} œuvres, ${EVENTS.length} événements.`);
  console.log("Comptes : admin@zitart.demo / admin1234 | artiste@zitart.demo / artiste1234 | visiteur@zitart.demo / visiteur1234");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
