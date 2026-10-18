import Link from "next/link";
import DemoQuiz from "@/components/demo-quiz";
import { Counter, Reveal, ScrollTitle } from "@/components/scroll-effects";
import { SponsorSlot, VerifiedBadge } from "@/components/ui";
import type { Matiere } from "@/lib/content";

const wrap = "mx-auto w-full max-w-5xl px-4";
const gradText = "bg-linear-to-r from-emerald-500 via-sky-500 to-violet-500 bg-clip-text text-transparent";
const h2 = "text-4xl font-bold leading-[1.05] tracking-tighter sm:text-5xl";

const COULEURS = [
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-indigo-600",
  "from-violet-500 to-fuchsia-600",
  "from-orange-400 to-rose-500",
  "from-pink-500 to-rose-600",
  "from-amber-400 to-orange-500",
  "from-cyan-500 to-blue-600",
];

const ETAPES = [
  { titre: "Un premier jet par IA", texte: "À partir de nos notes de cours, une IA rédige une fiche et des QCM. À ce stade, rien n'est publié.", fond: "from-emerald-500 to-teal-600" },
  { titre: "Relu par un étudiant", texte: "Un étudiant de 2e ou 3e année qui a eu une très bonne note dans la matière relit, corrige et valide.", fond: "from-sky-500 to-indigo-600" },
  { titre: "Signé de son nom", texte: "Le badge « Vérifié par » indique qui a relu la fiche et à quelle date. Tu sais ce que tu lis.", fond: "from-violet-500 to-fuchsia-600" },
  { titre: "Corrigé avec toi", texte: "Une erreur ? Un lien sous chaque question permet de la signaler. On corrige, puis le vérificateur revalide.", fond: "from-orange-400 to-rose-500" },
];

const BLOCS = [
  { label: "À retenir", texte: "La probabilité de A sachant B ne regarde que les cas où B est arrivé.", style: "bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100" },
  { label: "Formule", texte: "P(A | B) = P(A ∩ B) / P(B),  avec P(B) > 0", style: "bg-violet-100 text-violet-950 dark:bg-violet-950 dark:text-violet-100" },
  { label: "Exemple", texte: "Parmi 13 cœurs, 1 roi : P(roi | cœur) = 1/13.", style: "bg-sky-100 text-sky-950 dark:bg-sky-950 dark:text-sky-100" },
  { label: "Piège", texte: "Ne pas confondre P(A | B) et P(B | A).", style: "bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-100" },
];

export default function HomeView({
  matieres,
  cta,
  compteSupprime = false,
}: {
  matieres: Matiere[];
  cta: { href: string; label: string };
  compteSupprime?: boolean;
}) {
  const ctaClass =
    "inline-flex min-h-12 items-center justify-center rounded-full bg-emerald-600 px-7 py-3 text-lg font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700";

  return (
    <div className="space-y-28 overflow-x-clip pb-16">
      {compteSupprime && (
        <p role="status" className={`${wrap} mt-4 rounded-lg bg-emerald-100 p-3 text-emerald-900`}>
          Ton compte et tes données ont été supprimés.
        </p>
      )}

      {/* Héros */}
      <section className="relative isolate px-4 pt-14 text-center">
        <div aria-hidden className="absolute inset-x-0 -top-10 -z-10 h-[34rem] overflow-hidden">
          <div className="absolute -left-20 top-0 size-72 rounded-full bg-emerald-400/40 blur-3xl" />
          <div className="absolute left-1/3 top-20 size-72 rounded-full bg-sky-400/40 blur-3xl" />
          <div className="absolute -right-16 top-0 size-72 rounded-full bg-violet-400/40 blur-3xl" />
          <div className="absolute right-1/4 top-52 size-64 rounded-full bg-pink-300/40 blur-3xl" />
        </div>
        <p className="mx-auto mb-5 w-fit rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium ring-1 ring-black/5 backdrop-blur dark:bg-zinc-900/70 dark:ring-white/10">
          Pour la 1re année HEC Lausanne · 100 % gratuit
        </p>
        <ScrollTitle lines={["Révise avec", "des fiches", "vérifiées."]} />
        <p className="mx-auto mt-6 max-w-xl text-xl text-zinc-600 dark:text-zinc-400">
          Ciblé sur l'examen, relu par des étudiants qui ont réussi la matière.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link href={cta.href} className={ctaClass}>
            {cta.label}
          </Link>
          <a href="#apercu" className="font-medium text-emerald-700 hover:underline dark:text-emerald-400">
            Voir un aperçu ›
          </a>
        </div>

        {/* Téléphone */}
        <div className="mx-auto mt-14 w-64 rounded-[2.5rem] bg-zinc-900 p-2.5 shadow-2xl shadow-violet-500/30 ring-1 ring-white/10 sm:w-72">
          <div className="space-y-3 rounded-[2rem] bg-white p-4 text-left dark:bg-zinc-950">
            <div className="mx-auto h-1.5 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">✓ Vérifié</p>
            <p className="text-lg font-bold leading-tight">Probabilité conditionnelle</p>
            <div className="rounded-2xl bg-violet-100 p-3 text-sm text-violet-950 dark:bg-violet-950 dark:text-violet-100">
              P(A | B) = P(A ∩ B) / P(B)
            </div>
            <div className="rounded-2xl bg-amber-100 p-3 text-sm text-amber-950 dark:bg-amber-950 dark:text-amber-100">
              Piège : P(A | B) ≠ P(B | A)
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-sm font-semibold">
              <span className="rounded-xl bg-zinc-100 py-2 dark:bg-zinc-800">1/4</span>
              <span className="rounded-xl bg-emerald-500 py-2 text-white">1/13</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bento : chiffres et arguments */}
      <section aria-label="Nos engagements" className={`${wrap} grid gap-4 md:grid-cols-3`}>
        {[
          { to: 0, suffix: " CHF", titre: "Gratuit", texte: "Pour les étudiants, toujours. Learnest sera financé par des sponsors, jamais par toi.", fond: "from-emerald-500 to-teal-600" },
          { to: 100, suffix: " %", titre: "Relu avant publication", texte: "Par un étudiant qui a réussi la matière. Son nom est affiché sur la fiche.", fond: "from-sky-500 to-indigo-600" },
          { to: 14, suffix: "", titre: "Matières de 1re année", texte: "Une par une, au rythme des examens. Terminologie et notations du cours HEC.", fond: "from-violet-500 to-fuchsia-600" },
        ].map((c) => (
          <Reveal key={c.titre} className={`rounded-3xl bg-linear-to-br ${c.fond} p-6 text-white shadow-lg`}>
            <p className="text-7xl font-bold leading-none tracking-tighter sm:text-8xl">
              <Counter to={c.to} suffix={c.suffix} />
            </p>
            <h2 className="mt-3 text-xl font-semibold">{c.titre}</h2>
            <p className="mt-1 text-white/85">{c.texte}</p>
          </Reveal>
        ))}
        <Reveal className="rounded-3xl bg-orange-100 p-6 text-orange-950 dark:bg-orange-950 dark:text-orange-100">
          <h2 className="text-2xl font-bold tracking-tight">Pensé pour le téléphone</h2>
          <p className="mt-1">Tu révises dans le métro ou sur un banc : tout est lisible et rapide sur mobile.</p>
        </Reveal>
        <Reveal className="rounded-3xl bg-pink-100 p-6 text-pink-950 dark:bg-pink-950 dark:text-pink-100">
          <h2 className="text-2xl font-bold tracking-tight">Une erreur ? Signale-la.</h2>
          <p className="mt-1">Un lien sous chaque question. Les signalements sont traités puis revalidés.</p>
        </Reveal>
        <Reveal className="rounded-3xl bg-zinc-900 p-6 text-white dark:bg-zinc-800">
          <h2 className="text-2xl font-bold tracking-tight">Mode sombre</h2>
          <p className="mt-1 text-zinc-300">Il suit les réglages de ton téléphone, pour réviser le soir sans te fatiguer les yeux.</p>
        </Reveal>
      </section>

      {/* Aperçu fiche + quiz interactif */}
      <section id="apercu" className={`${wrap} scroll-mt-20 space-y-8`}>
        <div className="space-y-3 text-center">
          <p className="font-semibold text-violet-600 dark:text-violet-400">Aperçu</p>
          <h2 className={h2}>
            Une vraie fiche. <span className={gradText}>Un vrai QCM.</span>
          </h2>
          <p className="mx-auto max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
            Voilà à quoi ressemblent une fiche et une question. Ces exemples sont écrits pour cette page : le contenu complet s'ouvre une fois connecté.
          </p>
        </div>
        <div className="grid items-start gap-6 md:grid-cols-2">
          <Reveal className="space-y-3 rounded-3xl bg-white p-5 shadow-xl ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Statistique · Chapitre 1</p>
            <h3 className="text-2xl font-bold tracking-tight">Probabilité conditionnelle</h3>
            <VerifiedBadge par="Prénom N." annee="2026" />
            {BLOCS.map((b) => (
              <div key={b.label} className={`rounded-2xl p-3 ${b.style}`}>
                <p className="text-xs font-bold uppercase tracking-widest opacity-70">{b.label}</p>
                <p className="mt-0.5">{b.texte}</p>
              </div>
            ))}
            <p className="text-xs text-zinc-500">Premier jet assisté par IA · Vérifié par Prénom N. · Aperçu</p>
          </Reveal>
          <Reveal>
            <DemoQuiz />
          </Reveal>
        </div>
      </section>

      {/* Cartes qui s'empilent */}
      <section aria-labelledby="methode" className={wrap}>
        <h2 id="methode" className={`${h2} mb-8 text-center`}>
          Comment on fabrique <span className={gradText}>une fiche.</span>
        </h2>
        <ol>
          {ETAPES.map((e, i) => (
            <li
              key={e.titre}
              className={`sticky mb-6 flex min-h-[50vh] flex-col justify-between rounded-3xl bg-linear-to-br ${e.fond} p-7 text-white shadow-2xl md:min-h-[55vh] md:p-10`}
              style={{ top: `${4 + i * 0.75}rem` }}
            >
              <div>
                <h3 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">{e.titre}</h3>
                <p className="mt-3 max-w-xl text-lg text-white/90 md:text-xl">{e.texte}</p>
              </div>
              <span className="text-7xl font-bold text-white/30">0{i + 1}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Matières en défilement horizontal */}
      <section aria-labelledby="matieres" className="space-y-5">
        <div className={`${wrap} space-y-2`}>
          <h2 id="matieres" className={h2}>
            14 matières, <span className={gradText}>une à une.</span>
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Fais glisser pour toutes les voir.</p>
        </div>
        <ul
          tabIndex={0}
          aria-label="Liste des matières"
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 [scrollbar-width:none] sm:px-[max(1rem,calc((100vw-64rem)/2+1rem))]"
        >
          {matieres.map((m, i) => {
            const dispo = m.statut === "disponible";
            return (
              <li
                key={m.slug}
                className={`flex h-64 w-[74vw] max-w-72 shrink-0 snap-center flex-col justify-between rounded-3xl bg-linear-to-br ${COULEURS[i % COULEURS.length]} p-6 text-white shadow-lg`}
              >
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${dispo ? "bg-white text-emerald-700" : "bg-black/25 text-white"}`}>
                  {dispo ? "Disponible" : "Bientôt"}
                </span>
                <div>
                  <h3 className="text-2xl font-bold leading-tight tracking-tight">{m.nom}</h3>
                  <p className="mt-1 text-white/85">
                    {m.semestre} · {m.ects} ECTS
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Appel final */}
      <section className={wrap}>
        <Reveal className="rounded-[2rem] bg-linear-to-br from-emerald-500 via-sky-500 to-violet-600 p-8 text-center text-white shadow-2xl sm:p-14">
          <h2 className="text-4xl font-bold leading-tight tracking-tighter sm:text-6xl">Prêt à réviser ?</h2>
          <p className="mx-auto mt-3 max-w-md text-lg text-white/90">Un e-mail @unil.ch, un lien magique, et c'est parti. Pas de mot de passe.</p>
          <Link href={cta.href} className="mt-7 inline-flex min-h-12 items-center rounded-full bg-white px-7 py-3 text-lg font-semibold text-zinc-900 transition hover:bg-zinc-100">
            {cta.label}
          </Link>
        </Reveal>
        <div className="mt-6">
          <SponsorSlot />
        </div>
      </section>
    </div>
  );
}
