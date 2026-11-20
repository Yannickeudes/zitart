export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatPrice(price: number | null | undefined): string {
  if (price == null) return "Prix sur demande";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(price);
}

export const AVAILABILITY_LABELS: Record<string, string> = {
  DISPONIBLE: "Disponible",
  RESERVE: "Réservé",
  VENDU: "Vendu",
};

export const STATUS_LABELS: Record<string, string> = {
  BROUILLON: "Brouillon",
  EN_ATTENTE: "En attente",
  PUBLIE: "Publié",
  REFUSE: "Refusé",
};
