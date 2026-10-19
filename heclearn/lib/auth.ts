import { notFound, redirect } from "next/navigation";
import { isAllowedEmail } from "@/lib/domains";
import { LOGIN_REQUIRED } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";

export async function getUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  return user?.email && isAllowedEmail(user.email) ? user : null;
}

// À appeler en tête de chaque page ou action protégée.
export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/connexion");
  return user;
}

// Pour les pages de contenu : redirige vers la connexion seulement si REQUIRE_LOGIN n'est pas désactivé.
// Renvoie l'utilisateur connecté, ou null en lecture libre.
export async function accesContenu() {
  return LOGIN_REQUIRED ? requireUser() : getUser();
}

export async function requireAdmin() {
  const user = await requireUser();
  const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!admin || user.email!.toLowerCase() !== admin) notFound();
  return user;
}
