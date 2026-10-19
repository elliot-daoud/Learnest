import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "content");

// En production, seul le contenu au statut « publie » existe pour le site.
// En local (npm run dev), les brouillons restent visibles pour pouvoir les relire en local.
const SHOW_DRAFTS = process.env.NODE_ENV !== "production";
const isVisible = (statut: string) => statut === "publie" || SHOW_DRAFTS;

export type Matiere = {
  slug: string;
  nom: string;
  semestre: string;
  module: string; // ex. "1.1"
  moduleNom: string;
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
  publie: boolean;
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
    publie: data.statut === "publie",
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

// Liste de tous les chapitres d'une matière (titres seulement). Les chapitres non publiés
// y figurent avec `ouvert: false` : aucun contenu n'est exposé, seulement le titre.
export type ChapitreListe = { slug: string; titre: string; ouvert: boolean; nbQuestions: number };

export function getChapitresListe(matiere: string): ChapitreListe[] {
  if (!SAFE.test(matiere)) return [];
  return dirs(path.join(ROOT, matiere)).flatMap((slug) => {
    const fiche = path.join(ROOT, matiere, slug, "fiche.md");
    if (!fs.existsSync(fiche)) return [];
    const { data } = matter(fs.readFileSync(fiche, "utf8"));
    const complet = loadChapitre(matiere, slug); // null tant que non publié (en production)
    return [{ slug, titre: String(data.titre), ouvert: complet !== null, nbQuestions: complet?.questions.length ?? 0 }];
  });
}

export function getChapitre(matiere: string, slug: string): Chapitre | null {
  return loadChapitre(matiere, slug);
}
