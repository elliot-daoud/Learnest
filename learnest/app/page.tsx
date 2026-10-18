import Link from "next/link";
import { Counter, Reveal, ScrollTitle } from "@/components/scroll-effects";
import { SponsorSlot, StatusBadge, btn } from "@/components/ui";
import { getUser } from "@/lib/auth";
import { getMatieres } from "@/lib/content";

const CHIFFRES = [
  { to: 0, suffix: " CHF", titre: "Gratuit", texte: "Pour les étudiants, toujours. Learnest sera financé par des sponsors, jamais par toi." },
  { to: 100, suffix: " %", titre: "Relu", texte: "Chaque fiche et chaque QCM est relu par un étudiant qui a réussi la matière avant publication." },
  { to: 14, suffix: "", titre: "Matières", texte: "Toute la 1re année HEC, une matière après l'autre, au rythme des examens." },
];

const ETAPES = [
  { titre: "Un premier jet par IA", texte: "À partir de nos notes de cours, une IA rédige une fiche et des QCM. À ce stade, rien n'est publié.", style: "bg-emerald-200 text-emerald-950 dark:bg-emerald-900 dark:text-emerald-50" },
  { titre: "Relu par un étudiant", texte: "Un étudiant de 2e ou 3e année qui a eu une très bonne note dans la matière relit, corrige et valide.", style: "bg-sky-200 text-sky-950 dark:bg-sky-900 dark:text-sky-50" },
  { titre: "Signé de son nom", texte: "Le badge « Vérifié par » indique qui a relu la fiche et à quelle date. Tu sais ce que tu lis.", style: "bg-amber-200 text-amber-950 dark:bg-amber-900 dark:text-amber-50" },
  { titre: "Corrigé avec toi", texte: "Une erreur ? Un lien sous chaque question permet de la signaler. On corrige, puis le vérificateur revalide.", style: "bg-rose-200 text-rose-950 dark:bg-rose-900 dark:text-rose-50" },
];

export default async function Accueil({ searchParams }: { searchParams: Promise<{ compte?: string }> }) {
  const { compte } = await searchParams;
  const user = await getUser();
  const matieres = getMatieres();
  const cta = user ? { href: "/tableau-de-bord", label: "Aller au tableau de bord" } : { href: "/connexion", label: "Accéder avec mon e-mail UNIL" };

  return (
    <div className="space-y-24 pb-8">
      {compte === "supprime" && (
        <p role="status" className="rounded-lg bg-emerald-100 p-3 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
          Ton compte et tes données ont été supprimés.
        </p>
      )}

      {/* Titre */}
      <section className="space-y-6 overflow-hidden pt-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Pour la 1re année HEC Lausanne</p>
        <ScrollTitle lines={["Révise", "avec des fiches", "vérifiées."]} />
        <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          Gratuit, ciblé sur l'examen, relu par des étudiants qui ont réussi la matière.
        </p>
        <Link href={cta.href} className={btn}>
          {cta.label}
        </Link>
      </section>

      {/* Chiffres animés */}
      <section aria-label="Nos engagements" className="space-y-10">
        {CHIFFRES.map((c) => (
          <Reveal key={c.titre}>
            <p className="text-[clamp(3.5rem,20vw,7rem)] font-black leading-none tracking-tighter text-emerald-600 dark:text-emerald-400">
              <Counter to={c.to} suffix={c.suffix} />
            </p>
            <h2 className="mt-1 text-xl font-bold">{c.titre}</h2>
            <p className="mt-1 max-w-md text-zinc-600 dark:text-zinc-400">{c.texte}</p>
          </Reveal>
        ))}
      </section>

      {/* Cartes qui s'empilent en défilant */}
      <section aria-labelledby="methode">
        <h2 id="methode" className="sticky top-0 z-10 bg-zinc-50/90 py-3 text-sm font-semibold uppercase tracking-widest text-zinc-500 backdrop-blur dark:bg-zinc-950/90">
          Comment on fabrique une fiche
        </h2>
        <ol className="mt-2">
          {ETAPES.map((e, i) => (
            <li
              key={e.titre}
              className={`sticky mb-6 flex min-h-[55vh] flex-col justify-between rounded-3xl p-6 shadow-lg ${e.style}`}
              style={{ top: `${3.5 + i * 0.75}rem` }}
            >
              <div>
                <h3 className="text-2xl font-black leading-tight">{e.titre}</h3>
                <p className="mt-2 text-lg">{e.texte}</p>
              </div>
              <span className="text-6xl font-black opacity-40">0{i + 1}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Défilement horizontal des matières */}
      <section aria-labelledby="matieres" className="space-y-4">
        <h2 id="matieres" className="text-3xl font-black uppercase leading-none tracking-tight">
          14 matières, <span className="text-emerald-600 dark:text-emerald-400">une à une.</span>
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">Fais glisser pour toutes les voir.</p>
        <ul
          tabIndex={0}
          aria-label="Liste des matières"
          className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none]"
        >
          {matieres.map((m) => {
            const dispo = m.statut === "disponible";
            return (
              <li
                key={m.slug}
                className={`flex h-56 w-[72vw] max-w-72 shrink-0 snap-center flex-col justify-between rounded-2xl border p-5 ${
                  dispo
                    ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950"
                    : "border-zinc-200 bg-white opacity-80 dark:border-zinc-800 dark:bg-zinc-900"
                }`}
              >
                <StatusBadge disponible={dispo} />
                <div>
                  <h3 className="text-xl font-bold leading-tight">{m.nom}</h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {m.semestre} · {m.ects} ECTS
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Appel final */}
      <Reveal className="space-y-4 rounded-3xl bg-zinc-900 p-8 text-white dark:bg-zinc-100 dark:text-zinc-900">
        <h2 className="text-3xl font-black uppercase leading-none tracking-tight">Prêt à réviser ?</h2>
        <p className="opacity-80">Un e-mail @unil.ch, un lien magique, et c'est parti. Pas de mot de passe.</p>
        <Link href={cta.href} className="inline-flex min-h-11 items-center rounded-lg bg-emerald-500 px-5 py-2 font-semibold text-zinc-950 hover:bg-emerald-400">
          {cta.label}
        </Link>
      </Reveal>

      <SponsorSlot />
    </div>
  );
}
