import type { Metadata } from "next";
import LoginForm from "./form";

export const metadata: Metadata = { title: "Connexion" };

const ERREURS: Record<string, string> = {
  domaine: "Cette adresse n'est pas autorisée : seules les adresses @unil.ch peuvent se connecter.",
  lien: "Ce lien de connexion est invalide ou a expiré. Demande-en un nouveau.",
};

export default async function Connexion({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const { erreur } = await searchParams;

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Connexion</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Pas de mot de passe : entre ton adresse @unil.ch et on t'envoie un lien de connexion.
      </p>
      {erreur && ERREURS[erreur] && (
        <p role="alert" className="rounded-lg bg-red-100 p-3 text-red-900 dark:bg-red-950 dark:text-red-200">
          {ERREURS[erreur]}
        </p>
      )}
      <LoginForm />
    </div>
  );
}
