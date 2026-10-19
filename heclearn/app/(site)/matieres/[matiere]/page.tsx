import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getChapitresListe, getMatiere } from "@/lib/content";
import { getBestScores } from "@/lib/progress";
import { BackLink, card } from "@/components/ui";

export default async function PageMatiere({ params }: { params: Promise<{ matiere: string }> }) {
  await requireUser();
  const { matiere } = await params;
  const m = getMatiere(matiere);
  const chapitres = m ? getChapitresListe(m.slug) : [];
  if (!m || chapitres.length === 0) notFound();

  const best = await getBestScores();

  return (
    <div className="space-y-6">
      <BackLink href="/tableau-de-bord">Tableau de bord</BackLink>
      <div>
        <h1 className="text-2xl font-bold">{m.nom}</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Module {m.module} · {m.semestre} · {m.ects} ECTS · {m.examen}
        </p>
      </div>

      <h2 className="font-semibold">Choisis un chapitre</h2>
      <ol className="space-y-2">
        {chapitres.map((c, i) => {
          const b = best.get(`${m.slug}/${c.slug}`);
          const numero = (
            <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-800 dark:bg-brand-950 dark:text-brand-200">
              {i + 1}
            </span>
          );
          if (!c.ouvert) {
            return (
              <li key={c.slug} className={`${card} flex items-center gap-3 opacity-60`}>
                {numero}
                <span className="font-medium">{c.titre}</span>
                <span className="ml-auto shrink-0 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  Bientôt
                </span>
              </li>
            );
          }
          return (
            <li key={c.slug}>
              <Link href={`/matieres/${m.slug}/${c.slug}`} className={`${card} flex items-center gap-3 hover:border-brand-500`}>
                {numero}
                <span className="font-medium">{c.titre}</span>
                <span className="ml-auto shrink-0 text-sm text-zinc-600 dark:text-zinc-400">
                  {c.nbQuestions === 0 ? "Fiche" : b ? `Meilleur : ${b.score}/${b.total}` : `QCM : ${c.nbQuestions} questions`}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
