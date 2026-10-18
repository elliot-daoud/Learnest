import { NextResponse, type NextRequest } from "next/server";
import { isAllowedEmail } from "@/lib/domains";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const to = (path: string) => NextResponse.redirect(new URL(path, request.url));

  if (!code) return to("/connexion?erreur=lien");

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return to("/connexion?erreur=lien");

  // Dernière barrière : une session ne reste jamais ouverte pour un domaine non autorisé.
  const { data } = await supabase.auth.getUser();
  if (!data.user?.email || !isAllowedEmail(data.user.email)) {
    await supabase.auth.signOut();
    return to("/connexion?erreur=domaine");
  }
  return to("/tableau-de-bord");
}
