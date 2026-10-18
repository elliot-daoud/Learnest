import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { signOut } from "./actions";
import { getUser } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "HecLearn — révision gratuite pour la 1re année HEC Lausanne", template: "%s · HecLearn" },
  description:
    "Fiches et QCM corrigés pour la 1re année HEC Lausanne, gratuits et ciblés sur l'examen.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col bg-[#f6fafe] text-zinc-900 antialiased dark:bg-[#05080f] dark:text-zinc-100">
        <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-[#f6fafe]/80 backdrop-blur-xl dark:border-zinc-800/70 dark:bg-[#05080f]/70">
          <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <span aria-hidden className="size-5 rounded-md bg-linear-to-br from-cyan-300 via-brand-500 to-indigo-500" />
              HecLearn
            </Link>
            <nav className="flex items-center gap-5 text-sm">
              {user ? (
                <>
                  <Link href="/tableau-de-bord" className="hover:text-brand-600">
                    Tableau de bord
                  </Link>
                  <form action={signOut}>
                    <button className="hover:text-brand-600">Déconnexion</button>
                  </form>
                </>
              ) : (
                <Link href="/connexion" className="hover:text-brand-600">
                  Connexion
                </Link>
              )}
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-zinc-200 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          <div className="mx-auto max-w-5xl space-y-2 px-4 py-6">
            <nav className="flex flex-wrap gap-x-4 gap-y-1">
              <Link href="/a-propos" className="hover:underline">
                À propos
              </Link>
              <Link href="/confidentialite" className="hover:underline">
                Confidentialité
              </Link>
            </nav>
            <p>HecLearn est un projet indépendant. Ce n'est pas un service officiel de l'UNIL ou de HEC Lausanne.</p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
