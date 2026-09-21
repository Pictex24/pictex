import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para usar en Client Components (navegador).
 * Solo se usa en el login del panel; el resto de la app habla con
 * Supabase desde el servidor (Server Components / Server Actions).
 */
export function creaClienteNavegador() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
