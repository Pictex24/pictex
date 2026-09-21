import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresca la sesión de Supabase en cada petición y protege /panel:
 * sin sesión válida, redirige a /panel/login. Se llama desde middleware.ts.
 *
 * Por qué existe aparte de lib/supabase/server.ts: un Server Component no
 * puede escribir cookies (por eso ese archivo hace try/catch), así que el
 * refresco real del token tiene que pasar por el middleware, que sí puede.
 */
export async function actualizaSesion(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const esRutaPanel = request.nextUrl.pathname.startsWith("/panel");
  const esLogin = request.nextUrl.pathname === "/panel/login";

  if (esRutaPanel && !esLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/panel/login";
    return NextResponse.redirect(url);
  }

  if (esLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/panel";
    return NextResponse.redirect(url);
  }

  return response;
}
