import type { Metadata } from "next";
import { CONTACT_EMAIL, FOUNDER_NAME } from "@/lib/site";

export const metadata: Metadata = { title: "À propos · Notre méthode" };

export default function APropos() {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert">
      <h1>À propos · Notre méthode</h1>

      <h2>Qui fait Learnest ?</h2>
      <p>{FOUNDER_NAME}</p>

      <h2>Comment le contenu est produit</h2>
      <ol>
        <li>
          <strong>Premier jet assisté par IA</strong>, à partir de notes de cours personnelles. Tout est reformulé avec nos propres mots et
          nos propres exemples.
        </li>
        <li>
          <strong>Vérification humaine systématique</strong> par un étudiant qui a réussi la matière : il relit, corrige et valide.
        </li>
        <li>
          <strong>Publication</strong> uniquement après validation. Un contenu non vérifié n'est jamais visible sur le site.
        </li>
        <li>
          <strong>Amélioration continue</strong> : chaque question a un lien « Signaler une erreur ». Les signalements sont traités, puis le
          vérificateur revalide.
        </li>
      </ol>
      <p>Chaque fiche affiche qui l'a vérifiée et à quelle date.</p>

      <h2>Ce que Learnest n'est pas</h2>
      <p>
        Learnest est un projet indépendant. <strong>Ce n'est pas un service officiel de l'UNIL ou de HEC Lausanne</strong>, et il n'est ni
        approuvé ni soutenu par eux. Nos fiches ne remplacent pas le cours.
      </p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </div>
  );
}
