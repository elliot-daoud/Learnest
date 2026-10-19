import fs from "node:fs";
import { NextResponse, type NextRequest } from "next/server";
import { LOGIN_REQUIRED } from "@/lib/access";
import { getUser } from "@/lib/auth";
import { getPdfPath } from "@/lib/content";

// Sert le PDF d'un chapitre publié. Les PDF ne sont pas dans /public : on contrôle l'accès ici,
// comme pour le reste du contenu (connexion obligatoire si REQUIRE_LOGIN n'est pas désactivé).
export async function GET(request: NextRequest, { params }: { params: Promise<{ matiere: string; chapitre: string }> }) {
  if (LOGIN_REQUIRED && !(await getUser())) {
    return NextResponse.redirect(new URL("/connexion", request.url));
  }
  const { matiere, chapitre } = await params;
  const file = getPdfPath(matiere, chapitre);
  if (!file) return new NextResponse("Introuvable", { status: 404 });

  const telecharger = request.nextUrl.searchParams.has("telecharger");
  return new NextResponse(new Uint8Array(fs.readFileSync(file)), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${telecharger ? "attachment" : "inline"}; filename="${matiere}-${chapitre}.pdf"`,
      "Cache-Control": "private, max-age=300",
    },
  });
}
