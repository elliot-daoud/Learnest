import type { Matiere } from "@/lib/content";

export const GROUPES = [
  { titre: "Semestre 1", sous: "Automne", semestre: "Automne" },
  { titre: "Semestre 2", sous: "Printemps", semestre: "Printemps" },
  { titre: "Toute l'année", sous: "Annuel", semestre: "Annuel" },
];

export type Module = { numero: string; nom: string; ects: number; matieres: Matiere[] };

// Modules d'un semestre, dans l'ordre du plan d'études.
export function modulesDuSemestre(matieres: Matiere[], semestre: string): Module[] {
  const modules: Module[] = [];
  for (const m of matieres.filter((x) => x.semestre === semestre)) {
    let mod = modules.find((x) => x.numero === m.module);
    if (!mod) modules.push((mod = { numero: m.module, nom: m.moduleNom, ects: 0, matieres: [] }));
    mod.matieres.push(m);
    mod.ects += m.ects;
  }
  return modules.sort((a, b) => a.numero.localeCompare(b.numero));
}
