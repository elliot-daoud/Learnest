import Link from "next/link";
import { SPONSOR_NAME } from "@/lib/site";

export const btn =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-700 px-5 py-2 font-medium text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600";
export const btnGhost =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-zinc-300 px-5 py-2 font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800";
export const card = "rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900";

export function VerifiedBadge({ par, annee }: { par: string; annee: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
      <span aria-hidden>✓</span> Vérifié par {par}
      {annee ? `, ${annee}` : ""}
    </span>
  );
}

export function StatusBadge({ disponible }: { disponible: boolean }) {
  return disponible ? (
    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
      Disponible
    </span>
  ) : (
    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
      Bientôt
    </span>
  );
}

// Masqué tant que NEXT_PUBLIC_SPONSOR_NAME est vide.
export function SponsorSlot() {
  if (!SPONSOR_NAME) return null;
  return <p className="text-center text-sm text-zinc-500">En partenariat avec {SPONSOR_NAME}</p>;
}

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
      ← {children}
    </Link>
  );
}
