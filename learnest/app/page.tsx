import HomeView from "@/components/home-view";
import { getUser } from "@/lib/auth";
import { getMatieres } from "@/lib/content";

export default async function Accueil({ searchParams }: { searchParams: Promise<{ compte?: string }> }) {
  const { compte } = await searchParams;
  const user = await getUser();
  const cta = user ? { href: "/tableau-de-bord", label: "Aller au tableau de bord" } : { href: "/connexion", label: "Accéder avec mon e-mail UNIL" };
  return <HomeView matieres={getMatieres()} cta={cta} compteSupprime={compte === "supprime"} />;
}
