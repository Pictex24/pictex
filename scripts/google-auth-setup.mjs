#!/usr/bin/env node
/**
 * Script de un solo uso: obtiene el refresh token de Google Calendar para
 * guardarlo en .env.local / Vercel. Se corre UNA VEZ en tu computador
 * después de crear las credenciales OAuth en Google Cloud Console
 * (ver SETUP.md, sección "Google Calendar").
 *
 * Uso:
 *   GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... node scripts/google-auth-setup.mjs
 */
import { google } from "googleapis";
import http from "node:http";

const PUERTO = 3001;
const REDIRECT_URI = `http://localhost:${PUERTO}/oauth2callback`;

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error(
    "Faltan GOOGLE_CLIENT_ID y/o GOOGLE_CLIENT_SECRET.\n" +
      "Corre el script así:\n" +
      "  GOOGLE_CLIENT_ID=tu-id GOOGLE_CLIENT_SECRET=tu-secret node scripts/google-auth-setup.mjs"
  );
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: ["https://www.googleapis.com/auth/calendar.events"],
});

const server = http.createServer(async (req, res) => {
  if (!req.url?.startsWith("/oauth2callback")) {
    res.writeHead(404);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PUERTO}`);
  const code = url.searchParams.get("code");

  if (!code) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("No llegó el código de autorización. Cierra esto e intenta de nuevo.");
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Listo — ya puedes cerrar esta pestaña y volver a la terminal.");

    console.log("\n✅ Autorización exitosa. Agrega esto a tu .env.local y a Vercel:\n");
    console.log(`GOOGLE_CLIENT_ID=${clientId}`);
    console.log(`GOOGLE_CLIENT_SECRET=${clientSecret}`);
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);

    if (!tokens.refresh_token) {
      console.warn(
        "⚠️  Google no devolvió un refresh_token. Esto pasa si ya habías autorizado antes.\n" +
          "   Ve a https://myaccount.google.com/permissions, quita el acceso a esta app, y corre el script de nuevo."
      );
    }
  } catch (error) {
    console.error("Error obteniendo el token:", error);
    res.writeHead(500);
    res.end("Error obteniendo el token — revisa la terminal.");
  } finally {
    server.close();
  }
});

server.listen(PUERTO, () => {
  console.log("Abre esta URL en tu navegador y autoriza el acceso a tu calendario:\n");
  console.log(authUrl);
  console.log(`\nEsperando la respuesta en http://localhost:${PUERTO} ...`);
});
