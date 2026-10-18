import Link from "next/link";
import DemoQuiz from "@/components/demo-quiz";
import { SponsorSlot } from "@/components/ui";
import type { Matiere } from "@/lib/content";
import { GROUPES, modulesDuSemestre } from "@/lib/modules";

const wrap = "mx-auto w-full max-w-5xl px-4";
const gradText = "bg-linear-to-r from-cyan-400 via-brand-500 to-indigo-500 bg-clip-text text-transparent";

const COULEURS = [
  "from-sky-400 to-blue-600",
  "from-cyan-400 to-sky-600",
  "from-indigo-400 to-violet-600",
  "from-blue-500 to-indigo-700",
  "from-teal-400 to-cyan-600",
  "from-violet-400 to-fuchsia-500",
];

const TEINTES: Record<string, string> = {
  Automne: "bg-sky-50 ring-sky-200 dark:bg-sky-950/40 dark:ring-sky-900",
  Printemps: "bg-indigo-50 ring-indigo-200 dark:bg-indigo-950/40 dark:ring-indigo-900",
  Annuel: "bg-cyan-50 ring-cyan-200 dark:bg-cyan-950/40 dark:ring-cyan-900",
};

const ETAPES = [
  { titre: "Choisis ta matière", texte: "Connecte-toi avec ton e-mail UNIL, puis ouvre la matière que tu prépares. Les chapitres suivent l'ordre du cours.", fond: "from-sky-400 to-blue-600" },
  { titre: "Lis la fiche", texte: "Une fiche par chapitre : l'essentiel, les formules, des exemples et les pièges à éviter. Lisible sur téléphone.", fond: "from-cyan-400 to-sky-600" },
  { titre: "Teste-toi au QCM", texte: "Une question à la fois, correction immédiate et explication. Ton score est enregistré à chaque tentative.", fond: "from-indigo-400 to-violet-600" },
  { titre: "Suis ta progression", texte: "Ton tableau de bord montre les QCM faits et ton meilleur score par chapitre, pour savoir quoi reprendre.", fond: "from-blue-500 to-indigo-700" },
];

const BLOCS = [
  { label: "À retenir", texte: "La probabilité de A sachant B ne regarde que les cas où B est arrivé.", style: "bg-sky-100 text-sky-950 dark:bg-sky-950 dark:text-sky-100" },
  { label: "Formule", texte: "P(A | B) = P(A ∩ B) / P(B),  avec P(B) > 0", style: "bg-indigo-100 text-indigo-950 dark:bg-indigo-950 dark:text-indigo-100" },
  { label: "Exemple", texte: "Parmi 13 cœurs, 1 roi : P(roi | cœur) = 1/13.", style: "bg-cyan-100 text-cyan-950 dark:bg-cyan-950 dark:text-cyan-100" },
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
  let couleur = 0;

  return (
    <div className="space-y-20 overflow-x-clip pb-16">
      {compteSupprime && (
        <p role="status" className={`${wrap} mt-4 rounded-lg bg-brand-100 p-3 text-brand-900`}>
          Ton compte et tes données ont été supprimés.
        </p>
      )}

      {/* Héros plein écran */}
      <section className="relative isolate flex min-h-[calc(100svh-3rem)] flex-col items-center justify-center px-4 pb-10 pt-12 text-center">
        <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
          <div className="anim-drift absolute -left-24 top-0 size-[22rem] rounded-full bg-sky-300/50 blur-3xl" />
          <div className="anim-drift absolute right-[-6rem] top-24 size-[24rem] rounded-full bg-indigo-300/40 blur-3xl" style={{ ["--d" as string]: "-5s" }} />
          <div className="anim-drift absolute bottom-0 left-1/3 size-[20rem] rounded-full bg-cyan-300/40 blur-3xl" style={{ ["--d" as string]: "-9s" }} />
        </div>

        <p className="anim-rise mb-6 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium ring-1 ring-black/5 backdrop-blur dark:bg-zinc-900/70 dark:ring-white/10">
          Pour la 1re année HEC Lausanne · gratuit
        </p>
        <h1
          className="anim-rise text-[clamp(3.25rem,14.5vw,8.5rem)] font-bold leading-[0.95] tracking-tighter"
          style={{ ["--d" as string]: "0.1s" }}
        >
          Révise
          <br />
          ta 1re année
          <br />
          <span className={gradText}>HEC.</span>
        </h1>
        <p className="anim-rise mt-6 max-w-xl text-xl text-zinc-600 sm:text-2xl dark:text-zinc-400" style={{ ["--d" as string]: "0.25s" }}>
          Des fiches et des QCM corrigés, pour chaque chapitre.
        </p>
        <div className="anim-rise mt-8 flex flex-col items-center gap-3 sm:flex-row" style={{ ["--d" as string]: "0.4s" }}>
          <Link
            href={cta.href}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-600 px-7 py-3 text-lg font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700"
          >
            {cta.label}
          </Link>
          <a href="#matieres" className="inline-flex min-h-12 items-center px-4 text-lg font-medium text-brand-700 hover:underline dark:text-brand-300">
            Voir les matières ↓
          </a>
        </div>

        {/* Téléphone + pastilles flottantes */}
        <div className="anim-rise relative mt-12 w-64 sm:w-72" style={{ ["--d" as string]: "0.55s" }}>
          <div className="anim-float rounded-[2.5rem] bg-zinc-900 p-2.5 shadow-2xl shadow-brand-500/30 ring-1 ring-white/10">
            <div className="space-y-3 rounded-[2rem] bg-white p-4 text-left dark:bg-zinc-950">
              <div className="mx-auto h-1.5 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <p className="text-xs font-semibold text-brand-700 dark:text-brand-300">Statistique · Chapitre 1</p>
              <p className="text-lg font-bold leading-tight">Probabilité conditionnelle</p>
              <div className="rounded-2xl bg-indigo-100 p-3 text-sm text-indigo-950 dark:bg-indigo-950 dark:text-indigo-100">P(A | B) = P(A ∩ B) / P(B)</div>
              <div className="rounded-2xl bg-amber-100 p-3 text-sm text-amber-950 dark:bg-amber-950 dark:text-amber-100">Piège : P(A | B) ≠ P(B | A)</div>
              <div className="grid grid-cols-2 gap-2 text-center text-sm font-semibold">
                <span className="rounded-xl bg-zinc-100 py-2 dark:bg-zinc-800">1/4</span>
                <span className="rounded-xl bg-emerald-500 py-2 text-white">1/13 ✓</span>
              </div>
            </div>
          </div>
          <span className="anim-float absolute -left-24 top-12 hidden rounded-2xl bg-white px-4 py-2 text-sm font-semibold shadow-xl ring-1 ring-black/5 sm:block dark:bg-zinc-900 dark:ring-white/10" style={{ ["--d" as string]: "-2s" }}>
            ✓ Bonne réponse
          </span>
          <span className="anim-float absolute -right-24 top-40 hidden rounded-2xl bg-white px-4 py-2 text-sm font-semibold shadow-xl ring-1 ring-black/5 sm:block dark:bg-zinc-900 dark:ring-white/10" style={{ ["--d" as string]: "-4s" }}>
            Score : 8 / 10
          </span>
        </div>
      </section>

      {/* Matières, par semestre */}
      <section id="matieres" aria-label="Matières" className={`${wrap} scroll-mt-16 space-y-6`}>
        {GROUPES.map((g) => {
          const modules = modulesDuSemestre(matieres, g.semestre);
          if (modules.length === 0) return null;
          return (
            <div key={g.semestre} className={`space-y-6 rounded-3xl p-4 ring-1 sm:p-6 ${TEINTES[g.semestre]}`}>
              <h2 className="text-2xl font-bold tracking-tight">
                {g.titre} <span className="text-base font-medium text-zinc-500">· {g.sous}</span>
              </h2>
              {modules.map((mod) => (
                <div key={mod.numero} className="space-y-3">
                  <h3 className="flex flex-wrap items-baseline justify-between gap-x-3 border-b border-black/10 pb-2 font-semibold dark:border-white/10">
                    <span>
                      Module {mod.numero} <span className="font-medium text-zinc-500">· {mod.nom}</span>
                    </span>
                    <span className="text-sm font-medium text-zinc-500">{mod.ects} ECTS</span>
                  </h3>
                  <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {mod.matieres.map((m) => {
                      const dispo = m.statut === "disponible";
                      const fond = COULEURS[couleur++ % COULEURS.length];
                      const carte = (
                        <>
                          <span className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-bold ${dispo ? "bg-white text-brand-700" : "bg-black/25 text-white"}`}>
                            {dispo ? "Disponible" : "Bientôt"}
                          </span>
                          <span>
                            <span className="block text-lg font-bold leading-tight tracking-tight">{m.nom}</span>
                            <span className="mt-1 block text-sm text-white/85">{m.ects} ECTS</span>
                          </span>
                        </>
                      );
                      const classes = `flex min-h-36 flex-col justify-between gap-4 rounded-2xl bg-linear-to-br ${fond} p-4 text-white shadow-md`;
                      return (
                        <li key={m.slug}>
                          {dispo ? (
                            <Link href={cta.href} className={`${classes} transition hover:scale-[1.02]`}>
                              {carte}
                            </Link>
                          ) : (
                            <div className={`${classes} opacity-70`}>{carte}</div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          );
        })}
        <div className="flex flex-col items-center gap-2 pt-2 text-center">
          <Link
            href={cta.href}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-600 px-7 py-3 text-lg font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700"
          >
            {cta.label}
          </Link>
          <p className="text-sm text-zinc-500">Gratuit · lien de connexion par e-mail, sans mot de passe</p>
        </div>
      </section>

      {/* Comment ça marche : les cartes s'empilent en défilant */}
      <section aria-labelledby="methode" className={wrap}>
        <h2 id="methode" className="mb-8 text-center text-4xl font-bold leading-[1.05] tracking-tighter sm:text-5xl">
          Comment ça <span className={gradText}>marche.</span>
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

      {/* Aperçu */}
      <section id="apercu" className={`${wrap} scroll-mt-16 space-y-6`}>
        <h2 className="text-2xl font-bold tracking-tight">À quoi ça ressemble</h2>
        <div className="grid items-start gap-5 md:grid-cols-2">
          <div className="space-y-3 rounded-3xl bg-white p-5 shadow-xl ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Statistique · Chapitre 1</p>
            <h3 className="text-2xl font-bold tracking-tight">Probabilité conditionnelle</h3>
            {BLOCS.map((b) => (
              <div key={b.label} className={`rounded-2xl p-3 ${b.style}`}>
                <p className="text-xs font-bold uppercase tracking-widest opacity-70">{b.label}</p>
                <p className="mt-0.5">{b.texte}</p>
              </div>
            ))}
            <p className="text-xs text-zinc-500">Aperçu : le contenu complet s'ouvre une fois connecté.</p>
          </div>
          <DemoQuiz />
        </div>
        <SponsorSlot />
      </section>
    </div>
  );
}
