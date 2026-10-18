// Domaines e-mail autorisés. Pour ouvrir à d'autres écoles : ajouter "unige.ch", "epfl.ch"…
// ⚠️ Faire la même chose dans la table `allowed_email_domains` (voir supabase/schema.sql),
// c'est elle qui bloque les inscriptions directement dans la base.
export const ALLOWED_DOMAINS = ["unil.ch"];

export function isAllowedEmail(email: string): boolean {
  const parts = email.trim().toLowerCase().split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  return /^[^\s@]+$/.test(local) && ALLOWED_DOMAINS.includes(domain);
}
