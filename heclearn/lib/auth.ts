import { notFound, redirect } from "next/navigation";
import { isAllowedEmail } from "@/lib/domains";
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

export async function requireAdmin() {
  const user = await requireUser();
  const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!admin || user.email!.toLowerCase() !== admin) notFound();
  return user;
}
