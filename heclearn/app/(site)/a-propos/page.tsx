import type { Metadata } from "next";
import { CONTACT_EMAIL, FOUNDER_NAME } from "@/lib/site";

export const metadata: Metadata = { title: "À propos" };

export default function APropos() {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert">
      <h1>À propos</h1>

      <h2>Qui fait HecLearn ?</h2>
      <p>{FOUNDER_NAME}</p>

      <h2>Ce qu'on propose</h2>
      <p>
        Des fiches par chapitre et des QCM corrigés pour la 1re année de HEC Lausanne, gratuits pour les étudiants et accessibles avec une
        adresse @unil.ch. Une erreur ? Chaque question a un lien « Signaler une erreur ».
      </p>

      <h2>Ce que HecLearn n'est pas</h2>
      <p>
        HecLearn est un projet indépendant. <strong>Ce n'est pas un service officiel de l'UNIL ou de HEC Lausanne</strong>, et il n'est ni
        approuvé ni soutenu par eux. Nos fiches ne remplacent pas le cours.
      </p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </div>
  );
}
