"use server";

import { isAllowedEmail } from "@/lib/domains";
import { SITE_URL } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { status: "idle" | "sent" | "error"; message: string };

// La vérification du domaine se fait ici, côté serveur (et une seconde fois dans la base, voir schema.sql).
export async function envoyerLien(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!isAllowedEmail(email)) {
    return { status: "error", message: "Seules les adresses se terminant par @unil.ch sont acceptées." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${SITE_URL}/auth/callback` },
  });
  if (error) {
    return { status: "error", message: "Impossible d'envoyer le lien pour le moment. Réessaie dans quelques minutes." };
  }
  return { status: "sent", message: `Lien envoyé à ${email}. Ouvre ta boîte mail UNIL et clique sur le lien (pense à regarder les spams).` };
}
