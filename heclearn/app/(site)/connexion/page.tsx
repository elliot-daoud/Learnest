import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import LoginForm from "./form";

export const metadata: Metadata = { title: "Connexion" };

const ERREURS: Record<string, string> = {
  domaine: "Cette adresse n'est pas autorisée : seules les adresses @unil.ch peuvent se connecter.",
  lien: "Ce lien de connexion est invalide ou a expiré. Demande un nouveau code ci-dessous.",
};

export default async function Connexion({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  if (await getUser()) redirect("/tableau-de-bord");
  const { erreur } = await searchParams;

  return (
    <div className="relative isolate mx-auto max-w-md py-6 sm:py-14">
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-96 overflow-hidden">
        <div className="absolute -left-16 top-0 size-64 rounded-full bg-sky-300/40 blur-3xl" />
        <div className="absolute -right-10 top-16 size-64 rounded-full bg-indigo-300/40 blur-3xl" />
      </div>

      <div className="mb-6 space-y-2 text-center">
        <span aria-hidden className="mx-auto block size-12 rounded-2xl bg-linear-to-br from-cyan-300 via-brand-500 to-indigo-500 shadow-lg shadow-brand-500/30" />
        <h1 className="text-3xl font-bold tracking-tight">Connexion</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Pas de mot de passe : on t'envoie un code par e-mail.</p>
      </div>

      <div className="space-y-4 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-black/5 dark:bg-zinc-900/80 dark:ring-white/10">
        {erreur && ERREURS[erreur] && (
          <p role="alert" className="rounded-xl bg-red-100 p-3 text-sm text-red-900 dark:bg-red-950 dark:text-red-200">
            {ERREURS[erreur]}
          </p>
        )}
        <LoginForm />
      </div>

      <p className="mt-6 text-center text-sm text-zinc-500">
        En te connectant, tu acceptes que ton e-mail et ta progression soient enregistrés. Détails dans la{" "}
        <Link href="/confidentialite" className="underline">
          page confidentialité
        </Link>
        .
      </p>
    </div>
  );
}
