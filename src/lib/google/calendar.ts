import { google } from "googleapis";

/**
 * Cliente OAuth2 de Google usando un refresh token obtenido una sola vez
 * (ver scripts/google-auth-setup.mjs). No hay flujo de login en la app —
 * es de un solo usuario (el dueño), así que el token vive en variables de
 * entorno y se refresca solo en cada llamada.
 */
function creaClienteOAuth() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

export interface DatosEventoAgenda {
  nombre: string;
  telefono: string;
  paredM2: number;
  incluyeTecho: boolean;
  fechaEntrega: string; // YYYY-MM-DD
  notas: string | null;
}

/**
 * Crea un evento de día completo en el Google Calendar del dueño para la
 * fecha de entrega del lead. Si las credenciales no están configuradas
 * (todavía no siguió SETUP.md), no falla el cambio de estado — solo se
 * salta la creación del evento y lo avisa en consola.
 */
export async function crearEventoAgenda(
  datos: DatosEventoAgenda
): Promise<string | null> {
  const auth = creaClienteOAuth();
  if (!auth) {
    console.warn(
      "Google Calendar no está configurado (faltan GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN) — se omite la creación del evento."
    );
    return null;
  }

  const calendar = google.calendar({ version: "v3", auth });

  const detalle = [
    `Cliente: ${datos.nombre}`,
    `WhatsApp: ${datos.telefono}`,
    `${datos.paredM2} m² de pared${datos.incluyeTecho ? " + techo" : ""}`,
    datos.notas ? `Notas: ${datos.notas}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const evento = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: `Pictex — Pintar apto de ${datos.nombre}`,
      description: detalle,
      start: { date: datos.fechaEntrega },
      end: { date: datos.fechaEntrega },
    },
  });

  return evento.data.id ?? null;
}

/**
 * Borra el evento asociado si el lead se desagenda o cambia de fecha.
 * No lanza error si el evento ya no existe (por ejemplo, si se borró a mano).
 */
export async function borrarEventoAgenda(eventId: string): Promise<void> {
  const auth = creaClienteOAuth();
  if (!auth) return;

  const calendar = google.calendar({ version: "v3", auth });
  try {
    await calendar.events.delete({ calendarId: "primary", eventId });
  } catch (error) {
    console.warn("No se pudo borrar el evento de calendario:", error);
  }
}
