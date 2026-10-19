import "katex/dist/katex.min.css";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { accesContenu } from "@/lib/auth";
import { getChapitre, getMatiere } from "@/lib/content";
import { BackLink, btn, btnGhost } from "@/components/ui";
import Quiz from "./quiz";
import ReportFiche from "./report-fiche";

export default async function PageChapitre({
  params,
  searchParams,
}: {
  params: Promise<{ matiere: string; chapitre: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await accesContenu();
  const { matiere, chapitre } = await params;
  const { q } = await searchParams;
  const m = getMatiere(matiere);
  const c = m && getChapitre(matiere, chapitre);
  if (!m || !c) notFound();

  return (
    <article className="space-y-6">
      <BackLink href={`/matieres/${m.slug}`}>{m.nom}</BackLink>

      <header className="space-y-2">
        <h1 className="text-2xl font-bold">{c.titre}</h1>
        {!c.publie && (
          <p className="rounded-lg bg-amber-100 p-2 text-sm text-amber-900">Brouillon (visible en local uniquement)</p>
        )}
      </header>

      <div className="prose prose-zinc max-w-none dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
          {c.contenu}
        </ReactMarkdown>
      </div>

      {c.pdf && (
        <section aria-labelledby="pdf" className="space-y-3">
          <h2 id="pdf" className="text-xl font-semibold">
            Fiche de révision (PDF)
          </h2>
          <div className="flex flex-wrap gap-3">
            <a href={`/api/fiche/${m.slug}/${c.slug}`} target="_blank" rel="noopener" className={btn}>
              Ouvrir le PDF
            </a>
            <a href={`/api/fiche/${m.slug}/${c.slug}?telecharger`} className={btnGhost}>
              Télécharger
            </a>
          </div>
          <iframe
            src={`/api/fiche/${m.slug}/${c.slug}#view=FitH`}
            title={`Fiche PDF : ${c.titre}`}
            className="hidden h-[80vh] w-full rounded-xl border border-zinc-200 md:block dark:border-zinc-800"
          />
        </section>
      )}

      <footer className="border-t border-zinc-200 pt-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
        <ReportFiche matiere={m.slug} chapitre={c.slug} connecte={!!user} />
      </footer>

      {c.questions.length > 0 && (
        <section aria-labelledby="qcm" className="space-y-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <h2 id="qcm" className="text-xl font-semibold">
            QCM du chapitre
          </h2>
          <Quiz matiere={m.slug} chapitre={c.slug} questions={c.questions} reviewId={q} connecte={!!user} />
        </section>
      )}
    </article>
  );
}
