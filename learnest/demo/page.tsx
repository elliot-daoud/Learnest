import HomeView from "@/components/home-view";
import { getMatieres } from "@/lib/content";

export default function Accueil() {
  return <HomeView matieres={getMatieres()} cta={{ href: "#apercu", label: "Voir l'aperçu" }} />;
}
