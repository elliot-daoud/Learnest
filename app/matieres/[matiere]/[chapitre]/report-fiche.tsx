"use client";

import ReportForm from "@/components/report-form";

export default function ReportFiche({ matiere, chapitre }: { matiere: string; chapitre: string }) {
  return <ReportForm matiere={matiere} chapitre={chapitre} questionId="fiche" />;
}
