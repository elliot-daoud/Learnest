import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HecLearn — aperçu",
  description: "Aperçu statique de HecLearn, plateforme de révision gratuite pour la 1re année HEC Lausanne.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col bg-[#f6fafe] text-zinc-900 antialiased dark:bg-[#05080f] dark:text-zinc-100">
        <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-[#f6fafe]/80 backdrop-blur-xl dark:border-zinc-800/70 dark:bg-[#05080f]/70">
          <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4">
            <span className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <span aria-hidden className="size-5 rounded-md bg-linear-to-br from-cyan-300 via-brand-500 to-indigo-500" />
              HecLearn
            </span>
            <span className="text-sm text-zinc-500">Aperçu</span>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          <div className="mx-auto max-w-5xl px-4 py-6">
            HecLearn est un projet indépendant. Ce n'est pas un service officiel de l'UNIL ou de HEC Lausanne.
          </div>
        </footer>
      </body>
    </html>
  );
}
