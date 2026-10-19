"use client";

import ReportForm from "@/components/report-form";

export default function ReportFiche({ matiere, chapitre, connecte }: { matiere: string; chapitre: string; connecte: boolean }) {
  return <ReportForm matiere={matiere} chapitre={chapitre} questionId="fiche" connecte={connecte} />;
}
