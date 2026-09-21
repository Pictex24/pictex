import { type NextRequest } from "next/server";
import { actualizaSesion } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return actualizaSesion(request);
}

export const config = {
  matcher: [
    /*
     * Corre en todas las rutas excepto estáticos, para poder refrescar la
     * sesión en cualquier página. La protección real de /panel pasa dentro
     * de actualizaSesion().
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
