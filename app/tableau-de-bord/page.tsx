import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getChapitres, getMatieres } from "@/lib/content";
import { getBestScores } from "@/lib/progress";
import { SponsorSlot, StatusBadge, card } from "@/components/ui";
import DeleteAccount from "./delete-account";

export const metadata: Metadata = { title: "Tableau de bord" };

export default async function TableauDeBord() {
  const user = await requireUser();
  const best = await getBestScores();
  const matieres = getMatieres();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Connecté : {user.email}</p>
      </div>

      <ul className="space-y-2">
        {matieres.map((m) => {
          const dispo = m.statut === "disponible";
          const chapitres = getChapitres(m.slug).filter((c) => c.questions.length > 0);
          const faits = chapitres.filter((c) => best.has(`${m.slug}/${c.slug}`)).length;
          const contenu = (
            <>
              <span className="flex items-center justify-between gap-3">
                <span className="font-medium">{m.nom}</span>
                <StatusBadge disponible={dispo} />
              </span>
              {dispo && (
                <span className="mt-1 block text-sm text-zinc-600 dark:text-zinc-400">
                  {faits} / {chapitres.length} QCM faits
                </span>
              )}
            </>
          );
          return (
            <li key={m.slug}>
              {dispo ? (
                <Link href={`/matieres/${m.slug}`} className={`${card} block hover:border-emerald-600`}>
                  {contenu}
                </Link>
              ) : (
                <div className={`${card} opacity-70`}>{contenu}</div>
              )}
            </li>
          );
        })}
      </ul>

      <SponsorSlot />

      <section className="space-y-2 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h2 className="font-semibold">Mes données</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Tu peux supprimer ton compte à tout moment. Ton e-mail, tes scores et tes signalements sont effacés immédiatement.
        </p>
        <DeleteAccount />
      </section>
    </div>
  );
}
