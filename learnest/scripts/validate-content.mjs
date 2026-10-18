// Vérifie tout le dossier content/ avant le build. Un seul problème = build annulé.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "content");
const errors = [];
const err = (where, msg) => errors.push(`${where} : ${msg}`);
const STATUTS = ["brouillon", "verifie"];
const dirs = (d) =>
  fs.existsSync(d)
    ? fs.readdirSync(d, { withFileTypes: true }).filter((x) => x.isDirectory()).map((x) => x.name)
    : [];
const filled = (v) => typeof v === "string" && v.trim() !== "";

const ids = new Set();

for (const matiere of dirs(ROOT)) {
  const base = path.join("content", matiere);
  const metaPath = path.join(ROOT, matiere, "meta.json");
  if (!fs.existsSync(metaPath)) {
    err(base, "meta.json manquant");
    continue;
  }
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    for (const k of ["nom", "semestre", "examen"]) if (!filled(meta[k])) err(`${base}/meta.json`, `« ${k} » manquant`);
    for (const k of ["ects", "ordre"]) if (typeof meta[k] !== "number") err(`${base}/meta.json`, `« ${k} » doit être un nombre`);
    if (!["disponible", "bientot"].includes(meta.statut)) err(`${base}/meta.json`, "« statut » doit être disponible ou bientot");
  } catch (e) {
    err(`${base}/meta.json`, `JSON invalide (${e.message})`);
  }

  for (const chapitre of dirs(path.join(ROOT, matiere))) {
    const dir = path.join(base, chapitre);
    if (!/^[a-z0-9-]+$/.test(chapitre)) err(dir, "nom de dossier : minuscules, chiffres et tirets uniquement");

    // Fiche
    const fiche = path.join(ROOT, matiere, chapitre, "fiche.md");
    if (!fs.existsSync(fiche)) {
      err(dir, "fiche.md manquant");
    } else {
      const { data, content } = matter(fs.readFileSync(fiche, "utf8"));
      const f = `${dir}/fiche.md`;
      if (!filled(data.titre)) err(f, "« titre » manquant");
      if (!STATUTS.includes(data.statut)) err(f, "« statut » doit être brouillon ou verifie");
      if (typeof data.genere_avec_ia !== "boolean") err(f, "« genere_avec_ia » doit être true ou false");
      if (data.statut === "verifie") {
        if (!filled(data.verifie_par)) err(f, "« verifie_par » obligatoire pour une fiche vérifiée");
        if (!(data.date_verification instanceof Date) && !filled(String(data.date_verification ?? "")))
          err(f, "« date_verification » obligatoire pour une fiche vérifiée");
      }
      if (!content.trim()) err(f, "fiche vide");
    }

    // QCM
    const qcm = path.join(ROOT, matiere, chapitre, "qcm.json");
    if (!fs.existsSync(qcm)) {
      err(dir, "qcm.json manquant");
      continue;
    }
    let questions;
    try {
      questions = JSON.parse(fs.readFileSync(qcm, "utf8"));
    } catch (e) {
      err(`${dir}/qcm.json`, `JSON invalide (${e.message})`);
      continue;
    }
    if (!Array.isArray(questions)) {
      err(`${dir}/qcm.json`, "doit contenir une liste de questions");
      continue;
    }
    questions.forEach((q, i) => {
      const w = `${dir}/qcm.json #${i + 1}`;
      if (!filled(q.id)) err(w, "« id » manquant");
      else if (ids.has(q.id)) err(w, `id « ${q.id} » en double`);
      else ids.add(q.id);
      if (!filled(q.question)) err(w, "« question » vide");
      if (!Array.isArray(q.choix) || q.choix.length !== 4 || !q.choix.every(filled)) err(w, "« choix » doit contenir exactement 4 textes non vides");
      if (!Number.isInteger(q.bonne_reponse) || q.bonne_reponse < 0 || q.bonne_reponse > 3) err(w, "« bonne_reponse » doit être un entier de 0 à 3");
      if (!filled(q.explication)) err(w, "« explication » vide");
      if (!STATUTS.includes(q.statut)) err(w, "« statut » doit être brouillon ou verifie");
    });
  }
}

if (errors.length) {
  console.error(`\n❌ Contenu invalide (${errors.length} problème${errors.length > 1 ? "s" : ""}) :\n`);
  errors.forEach((e) => console.error(" - " + e));
  console.error("");
  process.exit(1);
}
console.log("✅ Contenu valide.");
