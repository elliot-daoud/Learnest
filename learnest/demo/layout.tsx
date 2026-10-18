import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learnest — aperçu",
  description: "Aperçu statique de Learnest, plateforme de révision gratuite pour la 1re année HEC Lausanne.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col bg-[#fbfbfd] text-zinc-900 antialiased dark:bg-black dark:text-zinc-100">
        <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-[#fbfbfd]/80 backdrop-blur-xl dark:border-zinc-800/70 dark:bg-black/70">
          <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4">
            <span className="text-lg font-semibold tracking-tight">Learnest</span>
            <span className="text-sm text-zinc-500">Aperçu</span>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          <div className="mx-auto max-w-5xl px-4 py-6">
            Learnest est un projet indépendant. Ce n'est pas un service officiel de l'UNIL ou de HEC Lausanne.
          </div>
        </footer>
      </body>
    </html>
  );
}
