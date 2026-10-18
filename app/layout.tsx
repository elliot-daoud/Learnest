import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { signOut } from "./actions";
import { getUser } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Learnest — révision gratuite, vérifiée par des étudiants", template: "%s · Learnest" },
  description:
    "Fiches et QCM corrigés pour la 1re année HEC Lausanne, gratuits, rédigés avec l'aide de l'IA et vérifiés par des étudiants qui ont réussi la matière.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-xl font-bold tracking-tight">
              Learnest
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              {user ? (
                <>
                  <Link href="/tableau-de-bord" className="hover:underline">
                    Tableau de bord
                  </Link>
                  <form action={signOut}>
                    <button className="hover:underline">Déconnexion</button>
                  </form>
                </>
              ) : (
                <Link href="/connexion" className="hover:underline">
                  Connexion
                </Link>
              )}
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">{children}</main>

        <footer className="border-t border-zinc-200 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          <div className="mx-auto max-w-3xl space-y-2 px-4 py-6">
            <nav className="flex flex-wrap gap-x-4 gap-y-1">
              <Link href="/a-propos" className="hover:underline">
                À propos · Notre méthode
              </Link>
              <Link href="/confidentialite" className="hover:underline">
                Confidentialité
              </Link>
            </nav>
            <p>Learnest est un projet indépendant. Ce n'est pas un service officiel de l'UNIL ou de HEC Lausanne.</p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
