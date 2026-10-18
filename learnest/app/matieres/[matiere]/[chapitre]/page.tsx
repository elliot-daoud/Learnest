import "katex/dist/katex.min.css";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { requireUser } from "@/lib/auth";
import { formatDate, getChapitre, getMatiere } from "@/lib/content";
import { BackLink, VerifiedBadge } from "@/components/ui";
import Quiz from "./quiz";
import ReportFiche from "./report-fiche";

export default async function PageChapitre({
  params,
  searchParams,
}: {
  params: Promise<{ matiere: string; chapitre: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  await requireUser();
  const { matiere, chapitre } = await params;
  const { q } = await searchParams;
  const m = getMatiere(matiere);
  const c = m && getChapitre(matiere, chapitre);
  if (!m || !c) notFound();

  const annee = c.dateVerification.slice(0, 4);

  return (
    <article className="space-y-6">
      <BackLink href={`/matieres/${m.slug}`}>{m.nom}</BackLink>

      <header className="space-y-2">
        <h1 className="text-2xl font-bold">{c.titre}</h1>
        {c.verifie ? (
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <VerifiedBadge par={c.verifiePar} annee={annee} />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Dernière vérification : {formatDate(c.dateVerification)}
            </span>
          </p>
        ) : (
          <p className="rounded-lg bg-amber-100 p-2 text-sm text-amber-900">Brouillon non vérifié (visible en local uniquement)</p>
        )}
      </header>

      <div className="prose prose-zinc max-w-none dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
          {c.contenu}
        </ReactMarkdown>
      </div>

      <footer className="space-y-2 border-t border-zinc-200 pt-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
        <p>
          {c.genereAvecIa ? "Premier jet assisté par IA · " : ""}
          {c.verifie ? `Vérifié par ${c.verifiePar} · Dernière vérification ${formatDate(c.dateVerification)}` : "Non vérifié"}
        </p>
        <ReportFiche matiere={m.slug} chapitre={c.slug} />
      </footer>

      {c.questions.length > 0 && (
        <section aria-labelledby="qcm" className="space-y-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <h2 id="qcm" className="text-xl font-semibold">
            QCM du chapitre
          </h2>
          <Quiz matiere={m.slug} chapitre={c.slug} questions={c.questions} reviewId={q} />
        </section>
      )}
    </article>
  );
}
