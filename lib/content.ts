import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "content");

// En production, seul le contenu au statut « verifie » existe pour le site.
// En local (npm run dev), les brouillons restent visibles pour pouvoir les relire.
const SHOW_DRAFTS = process.env.NODE_ENV !== "production";
const isVisible = (statut: string) => statut === "verifie" || SHOW_DRAFTS;

export type Matiere = {
  slug: string;
  nom: string;
  semestre: string;
  ects: number;
  examen: string;
  ordre: number;
  statut: "disponible" | "bientot";
};

export type Question = {
  id: string;
  question: string;
  choix: string[];
  bonne_reponse: number;
  explication: string;
};

export type Chapitre = {
  slug: string;
  titre: string;
  contenu: string;
  genereAvecIa: boolean;
  verifiePar: string;
  dateVerification: string; // AAAA-MM-JJ, vide si non vérifié
  verifie: boolean;
  questions: Question[];
};

// Les slugs viennent de l'URL : on n'accepte que des noms de dossier sûrs.
const SAFE = /^[a-z0-9-]+$/;

function dirs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

export function getMatieres(): Matiere[] {
  return dirs(ROOT)
    .filter((slug) => fs.existsSync(path.join(ROOT, slug, "meta.json")))
    .map((slug) => ({
      slug,
      ...JSON.parse(fs.readFileSync(path.join(ROOT, slug, "meta.json"), "utf8")),
    }))
    .sort((a, b) => a.ordre - b.ordre);
}

export function getMatiere(slug: string): Matiere | undefined {
  return SAFE.test(slug) ? getMatieres().find((m) => m.slug === slug) : undefined;
}

function toIsoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value ? String(value) : "";
}

function loadChapitre(matiere: string, slug: string): Chapitre | null {
  if (!SAFE.test(matiere) || !SAFE.test(slug)) return null;
  const dir = path.join(ROOT, matiere, slug);
  const fichePath = path.join(dir, "fiche.md");
  if (!fs.existsSync(fichePath)) return null;

  const { data, content } = matter(fs.readFileSync(fichePath, "utf8"));
  if (!isVisible(data.statut)) return null;

  const qcmPath = path.join(dir, "qcm.json");
  const all: (Question & { statut: string })[] = fs.existsSync(qcmPath)
    ? JSON.parse(fs.readFileSync(qcmPath, "utf8"))
    : [];

  return {
    slug,
    titre: data.titre,
    contenu: content,
    genereAvecIa: data.genere_avec_ia === true,
    verifiePar: data.verifie_par ?? "",
    dateVerification: toIsoDate(data.date_verification),
    verifie: data.statut === "verifie",
    questions: all
      .filter((q) => isVisible(q.statut))
      .map(({ id, question, choix, bonne_reponse, explication }) => ({
        id,
        question,
        choix,
        bonne_reponse,
        explication,
      })),
  };
}

export function getChapitres(matiere: string): Chapitre[] {
  if (!SAFE.test(matiere)) return [];
  return dirs(path.join(ROOT, matiere))
    .map((slug) => loadChapitre(matiere, slug))
    .filter((c): c is Chapitre => c !== null);
}

export function getChapitre(matiere: string, slug: string): Chapitre | null {
  return loadChapitre(matiere, slug);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
