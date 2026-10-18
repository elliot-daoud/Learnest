"use client";

import { useState } from "react";
import { saveAttempt } from "@/app/actions";
import ReportForm from "@/components/report-form";
import { btn, btnGhost, card } from "@/components/ui";
import type { Question } from "@/lib/content";

type Props = { matiere: string; chapitre: string; questions: Question[]; reviewId?: string };

export default function Quiz({ matiere, chapitre, questions, reviewId }: Props) {
  // Lien venant de l'admin (?q=id) : on montre uniquement cette question, corrigée, sans score.
  const [review, setReview] = useState(() => questions.find((q) => q.id === reviewId));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState<"saving" | "ok" | "error">("saving");

  function restart() {
    setReview(undefined);
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  async function next() {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setPicked(null);
      return;
    }
    setDone(true);
    setSaved("saving");
    const res = await saveAttempt(matiere, chapitre, score, questions.length);
    setSaved(res.ok ? "ok" : "error");
  }

  if (done) {
    return (
      <div className={`${card} space-y-3 text-center`} role="status">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Ton score</p>
        <p className="text-4xl font-bold">
          {score} / {questions.length}
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {saved === "saving" && "Enregistrement…"}
          {saved === "ok" && "Score enregistré."}
          {saved === "error" && "Le score n'a pas pu être enregistré."}
        </p>
        <button onClick={restart} className={btn}>
          Refaire le QCM
        </button>
      </div>
    );
  }

  const q = review ?? questions[index];
  const answered = review ? q.bonne_reponse : picked;

  return (
    <div className={`${card} space-y-4`}>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {review ? "Question signalée" : `Question ${index + 1} sur ${questions.length}`}
      </p>
      <h3 className="text-lg font-semibold">{q.question}</h3>

      <div className="space-y-2" role="group" aria-label="Choix de réponse">
        {q.choix.map((choix, i) => {
          const isCorrect = i === q.bonne_reponse;
          const isPicked = i === answered;
          let style = "border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800";
          if (answered !== null) {
            if (isCorrect) style = "border-emerald-600 bg-emerald-50 dark:bg-emerald-950";
            else if (isPicked) style = "border-red-600 bg-red-50 dark:bg-red-950";
            else style = "border-zinc-200 opacity-60 dark:border-zinc-800";
          }
          return (
            <button
              key={i}
              disabled={answered !== null}
              onClick={() => {
                setPicked(i);
                if (i === q.bonne_reponse) setScore((s) => s + 1);
              }}
              className={`flex min-h-12 w-full items-start gap-3 rounded-lg border p-3 text-left ${style}`}
            >
              <span className="font-semibold">{"ABCD"[i]}</span>
              <span>{choix}</span>
              {answered !== null && isCorrect && <span className="ml-auto" aria-label="Bonne réponse">✓</span>}
              {answered !== null && isPicked && !isCorrect && <span className="ml-auto" aria-label="Mauvaise réponse">✗</span>}
            </button>
          );
        })}
      </div>

      {answered !== null && (
        <div className="space-y-3" aria-live="polite">
          <p className="rounded-lg bg-zinc-100 p-3 text-sm dark:bg-zinc-800">
            <strong>{answered === q.bonne_reponse ? "Correct. " : "Raté. "}</strong>
            {q.explication}
          </p>
          <ReportForm key={q.id} matiere={matiere} chapitre={chapitre} questionId={q.id} />
          {review ? (
            <button onClick={restart} className={btnGhost}>
              Faire le QCM complet
            </button>
          ) : (
            <button onClick={next} className={btn}>
              {index + 1 < questions.length ? "Question suivante" : "Voir mon score"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
