// Construit un site 100 % statique de l'accueil (pour GitHub Pages) dans .demo/out.
// On copie le strict nécessaire dans .demo/ : aucune page protégée ni accès Supabase n'y entre.
import { cpSync, mkdirSync, rmSync, symlinkSync } from "node:fs";
import { execSync } from "node:child_process";

rmSync(".demo", { recursive: true, force: true });
mkdirSync(".demo/app", { recursive: true });
mkdirSync(".demo/lib", { recursive: true });
mkdirSync(".demo/components", { recursive: true });

for (const f of ["package.json", "tsconfig.json", "postcss.config.mjs"]) cpSync(f, `.demo/${f}`);
cpSync("app/globals.css", ".demo/app/globals.css");
cpSync("demo/layout.tsx", ".demo/app/layout.tsx");
cpSync("demo/page.tsx", ".demo/app/page.tsx");
cpSync("demo/next.config.ts", ".demo/next.config.ts");
for (const f of ["home-view", "demo-quiz", "scroll-effects", "ui"]) cpSync(`components/${f}.tsx`, `.demo/components/${f}.tsx`);
for (const f of ["content", "site"]) cpSync(`lib/${f}.ts`, `.demo/lib/${f}.ts`);
// Seules les métadonnées des matières sont copiées, jamais les fiches ni les QCM.
const matieres = await import("node:fs").then((m) => m.readdirSync("content", { withFileTypes: true }));
for (const d of matieres) if (d.isDirectory()) cpSync(`content/${d.name}/meta.json`, `.demo/content/${d.name}/meta.json`);

symlinkSync("../node_modules", ".demo/node_modules");
execSync("npx next build", { cwd: ".demo", stdio: "inherit" });
console.log("✅ Site statique prêt dans learnest/.demo/out");
