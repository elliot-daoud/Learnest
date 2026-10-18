"use server";

import { redirect } from "next/navigation";
import { isAllowedEmail } from "@/lib/domains";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { status: "idle" | "sent" | "error"; message: string; email?: string };
export type CodeState = { message: string };

const DOMAINE_REFUSE = "Seules les adresses se terminant par @unil.ch sont acceptées.";

// La vérification du domaine se fait ici, côté serveur (et une seconde fois dans la base, voir schema.sql).
export async function envoyerLien(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!isAllowedEmail(email)) return { status: "error", message: DOMAINE_REFUSE };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) {
    return { status: "error", message: "Impossible d'envoyer l'e-mail pour le moment. Réessaie dans quelques minutes." };
  }
  return { status: "sent", message: "", email };
}

// Connexion par code à chiffres reçu par e-mail : pas de lien, donc aucun souci de navigateur
// (appli Mail, navigateur intégré…) sur téléphone.
export async function verifierCode(_prev: CodeState, formData: FormData): Promise<CodeState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const token = String(formData.get("code") ?? "").replace(/\s/g, "");

  if (!isAllowedEmail(email)) return { message: DOMAINE_REFUSE };
  if (!/^\d{6,8}$/.test(token)) return { message: "Le code est composé de chiffres uniquement." };

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
  if (error) return { message: "Code incorrect ou expiré. Demande un nouvel e-mail." };

  const { data } = await supabase.auth.getUser();
  if (!data.user?.email || !isAllowedEmail(data.user.email)) {
    await supabase.auth.signOut();
    return { message: DOMAINE_REFUSE };
  }
  redirect("/tableau-de-bord");
}
