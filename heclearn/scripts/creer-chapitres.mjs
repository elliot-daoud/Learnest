// Crée les dossiers de chapitres (fiche.md + qcm.json vides, statut brouillon) sans écraser l'existant.
// Les titres sont une reformulation de la structure des fiches de cours officielles de l'UNIL (année 2026/27).
import fs from "node:fs";
import path from "node:path";

const PLAN = {
  statistique: ["Représenter et décrire les données", "Introduction aux probabilités", "Variables aléatoires discrètes et continues", "Lois usuelles : binomiale et normale", "Intervalles de confiance", "Tests d'hypothèses", "Comparer plus de deux groupes : ANOVA", "Échantillonnage et collecte de données"],
  "mathematiques-1": ["Mathématiques financières", "Fonctions d'une variable", "Dérivation", "Élasticité et équations différentielles", "Intégration"],
  "mathematiques-2": ["Vecteurs", "Matrices et déterminants", "Systèmes d'équations linéaires", "Transformations linéaires et formes quadratiques", "Valeurs propres et vecteurs propres", "Fonctions de plusieurs variables", "Optimisation sous contraintes"],
  "comptabilite-financiere": ["Rôle et contenu des états financiers", "Le bilan", "Le compte de résultat", "Le tableau de flux de trésorerie", "Analyse de la situation financière"],
  "economie-1": ["Le comportement des consommateurs et des entrepreneurs", "L'offre et la demande", "Les théorèmes de l'économie du bien-être", "Le rôle de l'État", "Vers une économie durable"],
  "economie-2": ["Équilibre de marché : équilibre partiel", "Équilibre de marché : équilibre général", "Les failles de marché", "La situation macroéconomique et ses grandeurs", "La croissance économique", "Marché des biens, marché de la monnaie et modèle IS/LM", "Marché du travail et courbe de Phillips", "Le modèle IS-LM-PC", "Économie ouverte et modèle de Mundell-Fleming"],
  "regression-causale": ["Régression linéaire simple", "Régression linéaire multiple", "Analyse causale"],
  "management-ethique": ["Les grandes évolutions de la société", "L'éthique des affaires", "Le management et les rôles du manager", "L'environnement de l'entreprise", "Créer de la valeur pour les parties prenantes", "Les fonctions clés de l'entreprise"],
  "modeles-informatiques": ["Notions de base : ordinateurs, mémoires et données", "Modèle relationnel et schémas relationnels", "Contraintes d'intégrité et dépendances fonctionnelles", "Introduction à SQL", "Modélisation conceptuelle avec UML", "Transformation de schémas", "Modèles de données OLAP et analyse de données"],
  "comportement-organisationnel": ["La culture", "Les différences individuelles", "La perception et l'attribution", "Les théories de la motivation", "Motivation et conception des postes", "Performance et récompenses", "Le processus décisionnel", "Le fonctionnement des groupes", "Leadership et pouvoir"],
  "droit-entreprise": ["Notions juridiques de base", "Les sources du droit", "Les procédures d'application", "Les domaines du droit et leurs implications pour l'entreprise"],
  programmation: ["Python : syntaxe et sémantique", "Pensée algorithmique", "Analyse et visualisation de données"],
  durabilite: ["Définir la durabilité", "Les dimensions environnementales", "Les dimensions sociales", "Le rôle de l'économie et des entreprises", "Approches systémiques et interdisciplinaires", "Valeurs, attitudes, normes et émotions"],
  "english-business": ["Marketing", "Management", "Finance", "Communication dans les affaires", "Travailler dans un contexte multiculturel"],
};

const slug = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
let created = 0;
for (const [matiere, titres] of Object.entries(PLAN)) {
  titres.forEach((titre, i) => {
    const num = String(i + 1).padStart(2, "0");
    const existing = fs.existsSync(`content/${matiere}`) ? fs.readdirSync(`content/${matiere}`).filter((d) => d.startsWith(num + "-")) : [];
    if (existing.length) return; // déjà un dossier pour ce numéro
    const dir = path.join("content", matiere, `${num}-${slug(titre)}`);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "fiche.md"), `---\ntitre: "${titre.replace(/"/g, '\\"')}"\nstatut: brouillon\n---\n\nChapitre à rédiger.\n`);
    fs.writeFileSync(path.join(dir, "qcm.json"), "[]\n");
    created++;
  });
}
console.log(`${created} chapitres créés.`);
