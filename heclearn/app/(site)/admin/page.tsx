import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { card } from "@/components/ui";
import { setReportStatus } from "./actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

type Row = Record<string, string | number>;

// Supabase renvoie 1000 lignes max par requête : on pagine.
async function fetchAll(table: string, columns: string): Promise<Row[]> {
  const db = createServiceClient();
  const rows: Row[] = [];
  for (let from = 0; ; from += 1000) {
    const { data } = await db.from(table).select(columns).range(from, from + 999);
    if (!data?.length) break;
    rows.push(...(data as unknown as Row[]));
    if (data.length < 1000) break;
  }
  return rows;
}

// Lundi de la semaine, AAAA-MM-JJ
function week(iso: string): string {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}

function countBy<T>(items: T[], key: (i: T) => string): [string, number][] {
  const m = new Map<string, number>();
  items.forEach((i) => m.set(key(i), (m.get(key(i)) ?? 0) + 1));
  return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

function Bars({ data, label }: { data: [string, number][]; label: string }) {
  const max = Math.max(1, ...data.map(([, n]) => n));
  if (!data.length) return <p className="text-sm text-zinc-500">Aucune donnée pour l'instant.</p>;
  return (
    <table className="w-full text-sm">
      <thead className="sr-only">
        <tr>
          <th>{label}</th>
          <th>Nombre</th>
        </tr>
      </thead>
      <tbody>
        {data.map(([k, n]) => (
          <tr key={k}>
            <td className="w-32 py-0.5 pr-2 align-middle">{k}</td>
            <td className="w-full align-middle">
              <div className="h-4 rounded bg-brand-600" style={{ width: `${(n / max) * 100}%` }} />
            </td>
            <td className="pl-2 text-right tabular-nums">{n}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

async function Signalements() {
  const { data } = await createServiceClient().from("error_reports").select("*").order("created_at", { ascending: false });
  const reports = data ?? [];
  const nouveaux = reports.filter((r) => r.statut === "nouveau");
  const parChapitre = countBy(nouveaux, (r) => `${r.matiere}/${r.chapitre}`).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-2 font-semibold">Signalements par chapitre (nouveaux)</h2>
        <Bars data={parChapitre} label="Chapitre" />
      </section>
      <section className="space-y-2">
        <h2 className="font-semibold">À traiter ({nouveaux.length})</h2>
        {nouveaux.length === 0 && <p className="text-sm text-zinc-500">Rien à traiter 🎉</p>}
        {nouveaux.map((r) => (
          <div key={r.id} className={`${card} space-y-2`}>
            <p className="text-sm text-zinc-500">
              {new Date(r.created_at).toLocaleString("fr-CH")} · {r.matiere}/{r.chapitre} ·{" "}
              <Link
                className="underline"
                href={`/matieres/${r.matiere}/${r.chapitre}${r.question_id === "fiche" ? "" : `?q=${r.question_id}`}`}
              >
                {r.question_id === "fiche" ? "Voir la fiche" : `Voir la question ${r.question_id}`}
              </Link>
            </p>
            <p className="whitespace-pre-wrap">{r.message}</p>
            <form action={setReportStatus} className="flex gap-2">
              <input type="hidden" name="id" value={r.id} />
              <button name="statut" value="corrige" className="min-h-10 rounded-lg bg-brand-700 px-3 text-sm text-white">
                Corrigé
              </button>
              <button name="statut" value="rejete" className="min-h-10 rounded-lg border border-zinc-400 px-3 text-sm">
                Rejeté
              </button>
            </form>
          </div>
        ))}
      </section>
    </div>
  );
}

async function Stats() {
  const [profiles, attempts] = await Promise.all([
    fetchAll("profiles", "created_at"),
    fetchAll("qcm_attempts", "user_id, matiere, chapitre, created_at"),
  ]);

  const inscritsParSemaine = countBy(profiles, (p) => week(String(p.created_at)));
  const semaines = [...new Set(attempts.map((a) => week(String(a.created_at))))].sort();
  const actifsParSemaine: [string, number][] = semaines.map((s) => [
    s,
    new Set(attempts.filter((a) => week(String(a.created_at)) === s).map((a) => a.user_id)).size,
  ]);
  const qcmParSemaine = countBy(attempts, (a) => week(String(a.created_at)));
  const parMatiere = countBy(attempts, (a) => String(a.matiere));
  const parChapitre = countBy(attempts, (a) => `${a.matiere}/${a.chapitre}`);

  return (
    <div className="space-y-6">
      <p className="text-3xl font-bold">
        {profiles.length} <span className="text-base font-normal text-zinc-500">inscrits</span>
      </p>
      <section>
        <h2 className="mb-2 font-semibold">Nouveaux inscrits par semaine</h2>
        <Bars data={inscritsParSemaine} label="Semaine" />
      </section>
      <section>
        <h2 className="mb-2 font-semibold">Utilisateurs actifs par semaine (au moins un QCM)</h2>
        <Bars data={actifsParSemaine} label="Semaine" />
      </section>
      <section>
        <h2 className="mb-2 font-semibold">QCM réalisés par semaine (pics avant les examens)</h2>
        <Bars data={qcmParSemaine} label="Semaine" />
      </section>
      <section>
        <h2 className="mb-2 font-semibold">QCM par matière</h2>
        <Bars data={parMatiere} label="Matière" />
      </section>
      <section>
        <h2 className="mb-2 font-semibold">QCM par chapitre</h2>
        <Bars data={parChapitre} label="Chapitre" />
      </section>
    </div>
  );
}

export default async function Admin({ searchParams }: { searchParams: Promise<{ onglet?: string }> }) {
  await requireAdmin();
  const { onglet } = await searchParams;
  const stats = onglet === "stats";
  const tab = (active: boolean) =>
    `rounded-lg px-4 py-2 font-medium ${active ? "bg-brand-700 text-white" : "border border-zinc-300 dark:border-zinc-700"}`;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin</h1>
      <nav className="flex gap-2">
        <Link href="/admin" className={tab(!stats)}>
          Signalements
        </Link>
        <Link href="/admin?onglet=stats" className={tab(stats)}>
          Statistiques
        </Link>
      </nav>
      {stats ? <Stats /> : <Signalements />}
    </div>
  );
}
