"use client";

import { useActionState } from "react";
import { envoyerLien, type LoginState } from "./actions";
import { btn } from "@/components/ui";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(envoyerLien, { status: "idle", message: "" });

  return (
    <form action={action} className="space-y-3">
      <label htmlFor="email" className="block font-medium">
        Adresse e-mail UNIL
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="prenom.nom@unil.ch"
        className="min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-900"
      />
      <button disabled={pending} className={`${btn} w-full disabled:opacity-60`}>
        {pending ? "Envoi…" : "Recevoir mon lien de connexion"}
      </button>
      {state.message && (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={state.status === "error" ? "text-red-700 dark:text-red-400" : "text-emerald-800 dark:text-emerald-300"}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
