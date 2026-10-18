"use client";

import { useActionState, useEffect, useState } from "react";
import { envoyerLien, verifierCode, type CodeState, type LoginState } from "./actions";

const input =
  "min-h-12 w-full rounded-xl border border-zinc-300 bg-white px-4 text-lg outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-900";
const primary =
  "inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-brand-600 px-5 text-lg font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 disabled:opacity-60";

export default function LoginForm() {
  const [state, send, sending] = useActionState<LoginState, FormData>(envoyerLien, { status: "idle", message: "" });
  const [code, verify, verifying] = useActionState<CodeState, FormData>(verifierCode, { message: "" });
  const [attente, setAttente] = useState(0);

  // Délai avant de pouvoir redemander un e-mail.
  useEffect(() => {
    if (state.status !== "sent") return;
    setAttente(30);
    const id = setInterval(() => setAttente((s) => (s <= 1 ? (clearInterval(id), 0) : s - 1)), 1000);
    return () => clearInterval(id);
  }, [state]);

  if (state.status === "sent" && state.email) {
    return (
      <div className="space-y-5">
        <div className="space-y-2 text-center">
          <div aria-hidden className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-100 text-2xl dark:bg-brand-950">
            ✉️
          </div>
          <h2 className="text-xl font-bold">Entre ton code</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Nous avons envoyé un code à <strong className="break-all">{state.email}</strong>. Il arrive en quelques secondes.
          </p>
        </div>

        <form action={verify} className="space-y-3">
          <input type="hidden" name="email" value={state.email} />
          <label htmlFor="code" className="sr-only">
            Code reçu par e-mail
          </label>
          <input
            id="code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9 ]*"
            maxLength={9}
            required
            autoFocus
            placeholder="Code reçu"
            className={`${input} text-center text-3xl tracking-[0.3em] placeholder:text-lg placeholder:tracking-normal`}
          />
          <button disabled={verifying} className={primary}>
            {verifying ? "Vérification…" : "Me connecter"}
          </button>
          {code.message && (
            <p role="alert" className="text-sm text-red-700 dark:text-red-400">
              {code.message}
            </p>
          )}
        </form>

        <div className="flex items-center justify-between gap-3 text-sm">
          <form action={send}>
            <input type="hidden" name="email" value={state.email} />
            <button disabled={attente > 0 || sending} className="font-medium text-brand-700 underline disabled:opacity-50 dark:text-brand-300">
              {attente > 0 ? `Renvoyer le code (${attente} s)` : "Renvoyer le code"}
            </button>
          </form>
          <a href="/connexion" className="text-zinc-600 underline dark:text-zinc-400">
            Changer d'adresse
          </a>
        </div>
      </div>
    );
  }

  return (
    <form action={send} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="block font-medium">
          Adresse e-mail UNIL
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoFocus
          autoComplete="email"
          inputMode="email"
          placeholder="prenom.nom@unil.ch"
          aria-describedby="email-aide"
          className={input}
        />
        <p id="email-aide" className="text-sm text-zinc-500">
          Seules les adresses @unil.ch peuvent se connecter.
        </p>
      </div>
      <button disabled={sending} className={primary}>
        {sending ? "Envoi…" : "Recevoir mon code"}
      </button>
      {state.status === "error" && (
        <p role="alert" className="rounded-xl bg-red-100 p-3 text-red-900 dark:bg-red-950 dark:text-red-200">
          {state.message}
        </p>
      )}
    </form>
  );
}
