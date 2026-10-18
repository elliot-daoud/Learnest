// Domaines e-mail autorisés. Pour ouvrir à d'autres écoles : ajouter "unige.ch", "epfl.ch"…
// ⚠️ Faire la même chose dans la table `allowed_email_domains` (voir supabase/schema.sql),
// c'est elle qui bloque les inscriptions directement dans la base.
const BASE_DOMAINS = ["unil.ch"];

// Hors production uniquement : EXTRA_ALLOWED_DOMAINS="gmail.com" dans .env.local pour tester
// avec une autre adresse. Ignoré en production.
const EXTRA =
  process.env.NODE_ENV !== "production"
    ? (process.env.EXTRA_ALLOWED_DOMAINS ?? "").split(",").map((d) => d.trim().toLowerCase()).filter(Boolean)
    : [];

export const ALLOWED_DOMAINS = [...BASE_DOMAINS, ...EXTRA];

export function isAllowedEmail(email: string): boolean {
  const parts = email.trim().toLowerCase().split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  return /^[^\s@]+$/.test(local) && ALLOWED_DOMAINS.includes(domain);
}
