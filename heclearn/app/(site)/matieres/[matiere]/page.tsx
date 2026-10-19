import { notFound } from "next/navigation";
import ListeChapitres from "@/components/liste-chapitres";
import { accesContenu } from "@/lib/auth";
import { getChapitresListe, getMatiere } from "@/lib/content";
import { getBestScores } from "@/lib/progress";

export default async function PageMatiere({ params }: { params: Promise<{ matiere: string }> }) {
  const user = await accesContenu();
  const { matiere } = await params;
  const m = getMatiere(matiere);
  const chapitres = m ? getChapitresListe(m.slug) : [];
  if (!m || chapitres.length === 0) notFound();

  return <ListeChapitres m={m} chapitres={chapitres} best={user ? await getBestScores() : new Map()} connecte={!!user} />;
}
