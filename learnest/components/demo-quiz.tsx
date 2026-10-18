"use client";

import { useState } from "react";

// Question d'exemple pour l'accueil. Ce n'est PAS le contenu protégé de content/.
const QUESTION = "On tire une carte dans un jeu de 52 cartes. Sachant que c'est un cœur, quelle est la probabilité que ce soit un roi ?";
const CHOIX = ["1/4", "1/13", "1/52", "4/13"];
const BONNE = 1;
const EXPLICATION = "Parmi les 13 cœurs, un seul est un roi : 1/13. 1/52 oublierait la condition « sachant que c'est un cœur ».";

export default function DemoQuiz() {
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <div className="rounded-3xl bg-white p-5 shadow-xl ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
      <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">Essaie : exemple de question</p>
      <h3 className="mt-2 text-lg font-semibold leading-snug">{QUESTION}</h3>
      <div className="mt-4 grid grid-cols-2 gap-2" role="group" aria-label="Choix de réponse">
        {CHOIX.map((c, i) => {
          let style = "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700";
          if (picked !== null) {
            if (i === BONNE) style = "bg-emerald-500 text-white";
            else if (i === picked) style = "bg-rose-500 text-white";
            else style = "bg-zinc-100 opacity-50 dark:bg-zinc-800";
          }
          return (
            <button
              key={c}
              disabled={picked !== null}
              onClick={() => setPicked(i)}
              className={`min-h-12 rounded-2xl px-3 text-lg font-semibold transition ${style}`}
            >
              {c}
            </button>
          );
        })}
      </div>
      <div className="mt-3 min-h-16 text-sm" aria-live="polite">
        {picked === null ? (
          <p className="text-zinc-500">Choisis une réponse pour voir la correction.</p>
        ) : (
          <p>
            <strong>{picked === BONNE ? "Correct. " : "Raté. "}</strong>
            {EXPLICATION}{" "}
            <button onClick={() => setPicked(null)} className="font-semibold text-violet-600 underline dark:text-violet-400">
              Rejouer
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
