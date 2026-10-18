import { createClient } from "@/lib/supabase/server";

export type Best = { score: number; total: number };

// Meilleur score de l'utilisateur connecté par chapitre, clé = "matiere/chapitre".
export async function getBestScores(): Promise<Map<string, Best>> {
  const supabase = await createClient();
  const { data } = await supabase.from("qcm_attempts").select("matiere, chapitre, score, total");
  const best = new Map<string, Best>();
  for (const a of data ?? []) {
    const key = `${a.matiere}/${a.chapitre}`;
    const cur = best.get(key);
    if (!cur || a.score / a.total > cur.score / cur.total) best.set(key, { score: a.score, total: a.total });
  }
  return best;
}
