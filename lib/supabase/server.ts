import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Client lié à l'utilisateur connecté (soumis aux règles RLS).
export async function createClient() {
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll(list: { name: string; value: string; options: CookieOptions }[]) {
          try {
            list.forEach(({ name, value, options }) => store.set(name, value, options));
          } catch {
            // Appelé depuis un Server Component : le middleware rafraîchit déjà la session.
          }
        },
      },
    },
  );
}

// Client « service » qui contourne RLS. Réservé à /admin et à la suppression de compte,
// toujours après avoir vérifié l'identité de l'utilisateur côté serveur.
export function createServiceClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
