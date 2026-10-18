"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getChapitre } from "@/lib/content";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function saveAttempt(matiere: string, chapitre: string, score: number, total: number) {
  await requireUser();
  const fiche = getChapitre(matiere, chapitre);
  if (!fiche || total !== fiche.questions.length || !Number.isInteger(score) || score < 0 || score > total) {
    return { ok: false };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("qcm_attempts").insert({ matiere, chapitre, score, total });
  return { ok: !error };
}

export async function reportError(matiere: string, chapitre: string, questionId: string, message: string) {
  await requireUser();
  const text = message.trim().slice(0, 500);
  const fiche = getChapitre(matiere, chapitre);
  const validTarget = questionId === "fiche" || fiche?.questions.some((q) => q.id === questionId);
  if (!text || !fiche || !validTarget) return { ok: false };

  const supabase = await createClient();
  const { error } = await supabase
    .from("error_reports")
    .insert({ matiere, chapitre, question_id: questionId, message: text });
  return { ok: !error };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

// Supprime le compte : les lignes liées (profil, scores, signalements) partent en cascade.
export async function deleteAccount() {
  const user = await requireUser();
  const { error } = await createServiceClient().auth.admin.deleteUser(user.id);
  if (error) throw new Error("La suppression du compte a échoué.");
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/?compte=supprime");
}
