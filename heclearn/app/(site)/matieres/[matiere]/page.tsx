import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getChapitres, getMatiere } from "@/lib/content";
import { getBestScores } from "@/lib/progress";
import { BackLink, card } from "@/components/ui";

export default async function PageMatiere({ params }: { params: Promise<{ matiere: string }> }) {
  await requireUser();
  const { matiere } = await params;
  const m = getMatiere(matiere);
  if (!m || m.statut !== "disponible") notFound();

  const chapitres = getChapitres(m.slug);
  const best = await getBestScores();

  return (
    <div className="space-y-6">
      <BackLink href="/tableau-de-bord">Tableau de bord</BackLink>
      <div>
        <h1 className="text-2xl font-bold">{m.nom}</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {m.semestre} · {m.ects} ECTS · {m.examen}
        </p>
      </div>

      {chapitres.length === 0 ? (
        <p className={card}>Les premiers chapitres arrivent bientôt.</p>
      ) : (
        <ul className="space-y-2">
          {chapitres.map((c) => {
            const b = best.get(`${m.slug}/${c.slug}`);
            return (
              <li key={c.slug}>
                <Link href={`/matieres/${m.slug}/${c.slug}`} className={`${card} flex items-center justify-between gap-3 hover:border-brand-600`}>
                  <span className="font-medium">{c.titre}</span>
                  <span className="shrink-0 text-sm text-zinc-600 dark:text-zinc-400">
                    {c.questions.length === 0 ? "Fiche" : b ? `Meilleur : ${b.score}/${b.total}` : `QCM : ${c.questions.length} questions`}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
