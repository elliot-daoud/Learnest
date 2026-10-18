// Pages intérieures : colonne de lecture étroite. L'accueil (app/page.tsx) gère sa propre largeur.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-3xl px-4 py-8">{children}</div>;
}
