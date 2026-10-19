import { notFound } from "next/navigation";
import ListeChapitres from "@/components/liste-chapitres";
import { getChapitresListe, getMatiere } from "@/lib/content";

// Aperçu sans connexion, uniquement en local (en ligne : 404, sauf si APERCU_LOCAL=1 est défini).
export default async function Apercu({ params }: { params: Promise<{ matiere: string }> }) {
  if (process.env.NODE_ENV === "production" && process.env.APERCU_LOCAL !== "1") notFound();
  const { matiere } = await params;
  const m = getMatiere(matiere);
  const chapitres = m ? getChapitresListe(m.slug) : [];
  if (!m || chapitres.length === 0) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <ListeChapitres m={m} chapitres={chapitres} best={new Map()} />
    </div>
  );
}
