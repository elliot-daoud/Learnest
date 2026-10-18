import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = { title: "Confidentialité" };

export default function Confidentialite() {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert">
      <h1>Confidentialité</h1>
      <p>
        HecLearn collecte le strict minimum pour fonctionner. Cette page décrit ce que nous collectons, pourquoi, et comment tu gardes le
        contrôle, conformément à la loi fédérale suisse sur la protection des données (nLPD).
      </p>

      <h2>Données collectées</h2>
      <ul>
        <li>
          <strong>Ton adresse e-mail @unil.ch</strong> : pour créer ton compte et t'envoyer le lien de connexion.
        </li>
        <li>
          <strong>Ta progression</strong> : les scores de tes QCM (matière, chapitre, score, date), pour t'afficher tes résultats.
        </li>
        <li>
          <strong>Tes signalements d'erreur</strong> : le texte que tu écris et la question concernée, pour corriger le contenu.
        </li>
      </ul>
      <p>Nous ne collectons ni ton nom, ni ta filière, ni ton mot de passe (il n'y en a pas).</p>

      <h2>Pourquoi</h2>
      <p>
        Uniquement pour faire fonctionner la plateforme et l'améliorer. L'accès est limité aux adresses @unil.ch afin de réserver le service
        aux étudiants.
      </p>

      <h2>Sponsors et tiers</h2>
      <p>
        <strong>Rien n'est transmis aux sponsors</strong> : ni ton e-mail, ni ta progression. Ils peuvent voir uniquement des statistiques
        agrégées (par exemple « 400 étudiants inscrits »), jamais de données individuelles. Aucune donnée n'est vendue.
      </p>
      <p>
        Pour fonctionner, nous utilisons Supabase (base de données et envoi du lien de connexion) et Vercel (hébergement). L'audience du
        site est mesurée sans cookie et sans suivi publicitaire ; il n'y a donc pas de bandeau de cookies.
      </p>

      <h2>Durée de conservation</h2>
      <p>
        Tes données sont conservées tant que ton compte existe. Elles sont supprimées immédiatement et définitivement lorsque tu supprimes
        ton compte.
      </p>

      <h2>Supprimer ton compte</h2>
      <p>
        Depuis ton tableau de bord, le bouton « Supprimer mon compte et mes données » efface ton e-mail, tes scores et tes signalements. Tu
        peux aussi nous écrire à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> pour exercer tes droits d'accès, de rectification
        ou de suppression.
      </p>
    </div>
  );
}
