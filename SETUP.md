# Pictex — cómo poner esto a andar

Esta app tiene dos partes:
- **Landing pública** (`/`) — igual a `pinta24.html` (guardado como referencia en
  `_reference/pinta24-original.html`), pero la calculadora ahora envía cada
  cotización a tu base de datos en vez de solo abrir WhatsApp.
- **Panel privado** (`/panel`) — solo tú, con login. Ves los leads, cambias su
  estado, registras el precio final, y ajustas los parámetros de precio.

Necesitas dos cuentas gratuitas: **Supabase** (base de datos + login) y
**Vercel** (hosting). Ninguna de las dos pide tarjeta para el plan gratis.

## 1. Crear el proyecto en Supabase

1. Entra a [supabase.com](https://supabase.com) y crea una cuenta (puedes
   usar tu cuenta de GitHub).
2. "New project" → nómbralo `pictex`, elige una contraseña de base de datos
   (guárdala en un lugar seguro, no la necesitarás seguido) y la región más
   cercana a Bogotá (ej. `South America (São Paulo)`).
3. Espera ~2 minutos a que se aprovisione.

## 2. Crear las tablas

1. En el menú lateral del proyecto, entra a **SQL Editor** → **New query**.
2. Abre el archivo [`supabase/schema.sql`](supabase/schema.sql) de este
   repo, copia todo su contenido, pégalo ahí, y dale **Run**.
3. Deberías ver "Success. No rows returned". Eso crea las tablas `leads` y
   `pricing_config`, con la fila inicial de precios (los mismos valores que
   ya tenías en `pinta24.html`) y las reglas de seguridad (RLS) que separan
   lo público de lo tuyo.

## 3. Crear tu usuario (el login del panel)

1. En el menú lateral, entra a **Authentication** → **Users** → **Add user**
   → **Create new user**.
2. Pon tu correo y una contraseña. Marca **Auto Confirm User** para no tener
   que verificar el correo.
3. Con ese correo y contraseña vas a entrar a `/panel/login`.

## 4. Copiar las llaves del proyecto

1. En el menú lateral, entra a **Project Settings** → **API**.
2. Copia **Project URL** y la llave **anon public**.
3. En la raíz de este proyecto, copia `.env.local.example` a `.env.local`:

   ```bash
   cp .env.local.example .env.local
   ```

4. Pega ahí los dos valores:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
   ```

   `.env.local` ya está en `.gitignore` — nunca se sube al repo.

## 5. Probarlo en tu computador

```bash
npm run dev
```

Abre `http://localhost:3000` — es la landing. Llena la calculadora y envíala;
debería aparecer en `http://localhost:3000/panel` después de iniciar sesión
con el usuario que creaste en el paso 3.

## 6. Desplegar en Vercel (gratis)

1. Sube este proyecto a un repo de GitHub (si no lo has hecho):

   ```bash
   git add -A
   git commit -m "Landing + panel de gestión de Pictex"
   ```

   y crea el repo en GitHub y haz push.

2. Entra a [vercel.com](https://vercel.com), crea cuenta con GitHub, **Add
   New Project**, elige el repo `pictex`.
3. En **Environment Variables**, agrega las tres variables del paso 4
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y
   `NEXT_PUBLIC_SITE_URL` — esta última con la URL real que te dé Vercel, para
   que la imagen de preview al compartir el link funcione bien).
4. **Deploy**. En ~1 minuto tienes una URL pública tipo
   `pictex.vercel.app`. Como ya compraste tu dominio propio, entra a
   **Project Settings → Domains** en Vercel, agrégalo ahí, y sigue las
   instrucciones para apuntar los DNS desde donde lo compraste — Vercel te
   dice exactamente qué registros crear.
5. Cuando el dominio quede activo, actualiza `NEXT_PUBLIC_SITE_URL` en
   **Environment Variables** de Vercel con tu dominio real (ej.
   `https://pictex.co`) y vuelve a desplegar (Vercel tiene un botón
   "Redeploy").

De ahí en adelante, cada vez que hagas `git push`, Vercel actualiza el sitio
solo.

## 7. Google Calendar (opcional pero recomendado)

Cuando marcas un lead como "Agendado" en el panel, la app crea sola un
evento en tu Google Calendar con la fecha de entrega. No necesitas Google
Workspace — tu cuenta normal de Gmail alcanza.

### 7.1 Crear el proyecto y las credenciales

1. Ve a [console.cloud.google.com](https://console.cloud.google.com/), crea
   un proyecto nuevo (nómbralo `pictex`, por ejemplo).
2. Ve a **APIs & Services → Library**, busca **Google Calendar API** y dale
   **Enable**.
3. Ve a **APIs & Services → OAuth consent screen**:
   - Tipo de usuario: **External**.
   - Llena el nombre de la app (`Pictex`) y tu correo en los campos
     requeridos.
   - En **Test users**, agrega tu propio correo de Gmail. Como es una app
     personal (solo la usas tú), no necesitas publicarla — que quede en
     modo "Testing" está bien y evita la revisión de Google.
4. Ve a **APIs & Services → Credentials → Create Credentials → OAuth client
   ID**:
   - Tipo de aplicación: **Web application**.
   - En **Authorized redirect URIs**, agrega exactamente:
     `http://localhost:3001/oauth2callback`
   - Copia el **Client ID** y el **Client secret** que te da al final.

### 7.2 Sacar el refresh token (una sola vez)

En tu terminal, en la raíz del proyecto:

```bash
GOOGLE_CLIENT_ID=tu-client-id GOOGLE_CLIENT_SECRET=tu-client-secret node scripts/google-auth-setup.mjs
```

1. El script te va a imprimir una URL — ábrela en tu navegador.
2. Inicia sesión con tu cuenta de Gmail y acepta los permisos (Google te va
   a advertir que la app no está verificada — dale **Continuar**, es normal
   para una app personal en modo testing).
3. Vuelve a la terminal: ahí te imprime las tres líneas
   (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`).

### 7.3 Guardar las credenciales

1. Pega esas tres líneas en tu `.env.local`.
2. Agrega las mismas tres variables en **Environment Variables** de Vercel,
   y vuelve a desplegar.

Si no configuras esto, el panel funciona exactamente igual — simplemente no
crea el evento de calendario, y lo avisa en los logs.

## Cómo se usa el día a día

- **Cambiar precios**: entra a `/panel/config`, ajusta los números, guarda.
  La landing los usa en la siguiente visita — no hay que tocar código ni
  redesplegar.
- **Seguir un trabajo**: en `/panel`, cada lead tiene un menú de estado
  (Cotizado → Agendado → En proceso → Terminado → Pagado) y un campo de
  precio final. El resumen de arriba (ingresos del mes, trabajos
  completados) se calcula solo a partir de eso.
- **Calendario**: al pasar un lead a "Agendado" (si tiene fecha de entrega),
  se crea solo un evento de todo el día en tu Google Calendar con el
  nombre, teléfono y detalle del trabajo. Si por error lo devuelves a
  "Cotizado", el evento se borra solo.
- **Contactar al cliente**: el teléfono de cada lead en el panel es un link
  directo a WhatsApp.
