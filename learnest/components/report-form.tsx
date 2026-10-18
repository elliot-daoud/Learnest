"use client";

import { useState } from "react";
import { reportError } from "@/app/actions";

// Lien discret « Signaler une erreur » qui déplie un petit formulaire.
// `questionId` vaut l'id de la question, ou "fiche".
export default function ReportForm({ matiere, chapitre, questionId }: { matiere: string; chapitre: string; questionId: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (state === "sent") return <p className="text-sm text-emerald-800 dark:text-emerald-300">Merci, ton signalement a bien été envoyé.</p>;

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-sm text-zinc-500 underline hover:text-zinc-800 dark:hover:text-zinc-200">
        Signaler une erreur
      </button>
    );
  }

  return (
    <form
      className="space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setState("sending");
        const res = await reportError(matiere, chapitre, questionId, message);
        setState(res.ok ? "sent" : "error");
      }}
    >
      <label htmlFor={`report-${questionId}`} className="block text-sm font-medium">
        Qu'est-ce qui est faux ou peu clair ?
      </label>
      <textarea
        id={`report-${questionId}`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={500}
        required
        rows={3}
        className="w-full rounded-lg border border-zinc-300 bg-white p-2 text-base dark:border-zinc-700 dark:bg-zinc-900"
      />
      <div className="flex items-center gap-3 text-sm">
        <button
          disabled={state === "sending" || !message.trim()}
          className="min-h-10 rounded-lg bg-zinc-800 px-4 text-white disabled:opacity-50 dark:bg-zinc-200 dark:text-zinc-900"
        >
          {state === "sending" ? "Envoi…" : "Envoyer"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="underline">
          Annuler
        </button>
        <span className="ml-auto text-zinc-500">{message.length}/500</span>
      </div>
      {state === "error" && <p role="alert" className="text-sm text-red-700 dark:text-red-400">L'envoi a échoué, réessaie.</p>}
    </form>
  );
}
