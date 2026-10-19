import { notFound } from "next/navigation";
import ListeChapitres from "@/components/liste-chapitres";
import { requireUser } from "@/lib/auth";
import { getChapitresListe, getMatiere } from "@/lib/content";
import { getBestScores } from "@/lib/progress";

export default async function PageMatiere({ params }: { params: Promise<{ matiere: string }> }) {
  await requireUser();
  const { matiere } = await params;
  const m = getMatiere(matiere);
  const chapitres = m ? getChapitresListe(m.slug) : [];
  if (!m || chapitres.length === 0) notFound();

  return <ListeChapitres m={m} chapitres={chapitres} best={await getBestScores()} />;
}
