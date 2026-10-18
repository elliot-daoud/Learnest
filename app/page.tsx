import Link from "next/link";
import { getUser } from "@/lib/auth";
import { getMatieres } from "@/lib/content";
import { SponsorSlot, StatusBadge, btn, card } from "@/components/ui";

const ARGUMENTS = [
  { titre: "Gratuit", texte: "Pas d'abonnement, pas de version payante. Learnest sera financé par des sponsors, jamais par les étudiants." },
  { titre: "Vérifié par des étudiants", texte: "Chaque fiche et chaque QCM est relu par un étudiant qui a réussi la matière avant d'être publié." },
  { titre: "Ciblé sur l'examen HEC", texte: "Les notations et la terminologie sont celles du cours, pour coller à ce qui tombe à l'examen." },
];

export default async function Accueil({ searchParams }: { searchParams: Promise<{ compte?: string }> }) {
  const { compte } = await searchParams;
  const user = await getUser();
  const matieres = getMatieres();

  return (
    <div className="space-y-10">
      {compte === "supprime" && (
        <p role="status" className="rounded-lg bg-emerald-100 p-3 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
          Ton compte et tes données ont été supprimés.
        </p>
      )}

      <section className="space-y-4">
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
          Révise ta 1re année HEC avec des fiches et des QCM vérifiés par des étudiants.
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">Gratuit, ciblé sur l'examen, relu par des étudiants qui ont réussi la matière.</p>
        <Link href={user ? "/tableau-de-bord" : "/connexion"} className={btn}>
          {user ? "Aller au tableau de bord" : "Accéder avec mon e-mail UNIL"}
        </Link>
      </section>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Nos engagements">
        {ARGUMENTS.map((a) => (
          <div key={a.titre} className={card}>
            <h2 className="font-semibold">{a.titre}</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{a.texte}</p>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Matières</h2>
        <ul className="space-y-2">
          {matieres.map((m) => (
            <li key={m.slug} className={`${card} flex items-center justify-between gap-3`}>
              <span>
                {m.nom} <span className="text-sm text-zinc-500">· {m.semestre}</span>
              </span>
              <StatusBadge disponible={m.statut === "disponible"} />
            </li>
          ))}
        </ul>
      </section>

      <SponsorSlot />
    </div>
  );
}
