-- Pictex — esquema de base de datos
-- Ejecutar completo en Supabase: Project > SQL Editor > New query > pegar todo > Run.
-- Es seguro volver a correrlo (usa IF NOT EXISTS / OR REPLACE donde aplica).

-- ============================================================
-- Tabla: leads
-- Un registro por cada cotización que llega desde la landing.
-- ============================================================
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  nombre text not null,
  telefono text not null,

  m2_apartamento int,
  pared_m2 int not null,
  pared_manual boolean not null default false,
  incluye_techo boolean not null default false,

  precio_estimado_min numeric not null,
  precio_estimado_max numeric not null,
  precio_final numeric,

  fecha_entrega date,
  fecha_pago date,

  estado text not null default 'cotizado'
    check (estado in ('cotizado', 'agendado', 'en_proceso', 'terminado', 'pagado')),

  notas text,
  calendar_event_id text
);

comment on table public.leads is 'Cotizaciones capturadas desde la calculadora de la landing y su seguimiento hasta el pago.';

-- Por si ya tenías la tabla creada de antes de que existiera esta columna.
alter table public.leads add column if not exists calendar_event_id text;
comment on column public.leads.calendar_event_id is 'ID del evento en Google Calendar cuando el lead pasa a "agendado" (null si Google Calendar no está configurado o el lead no tiene fecha de entrega).';

-- Mantiene updated_at al día en cada UPDATE.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ============================================================
-- Tabla: pricing_config
-- Fila única (id = 1) con los parámetros de precio del negocio.
-- El panel la edita; la landing la lee en cada visita.
-- ============================================================
create table if not exists public.pricing_config (
  id int primary key default 1,
  wall_factor numeric not null default 2.3,
  pared_low int not null default 9000,
  pared_high int not null default 11000,
  techo_low int not null default 10000,
  techo_high int not null default 12000,
  descuento_lanzamiento numeric not null default 20,
  updated_at timestamptz not null default now(),

  constraint pricing_config_single_row check (id = 1)
);

comment on table public.pricing_config is 'Parámetros de precio editables desde el panel. Siempre una sola fila (id=1).';

drop trigger if exists pricing_config_set_updated_at on public.pricing_config;
create trigger pricing_config_set_updated_at
  before update on public.pricing_config
  for each row execute function public.set_updated_at();

-- Fila inicial con los valores actuales de pinta24.html (no hace nada si ya existe).
insert into public.pricing_config (id, wall_factor, pared_low, pared_high, techo_low, techo_high, descuento_lanzamiento)
values (1, 2.3, 9000, 11000, 10000, 12000, 20)
on conflict (id) do nothing;

-- ============================================================
-- Seguridad (Row Level Security)
-- ============================================================
alter table public.leads enable row level security;
alter table public.pricing_config enable row level security;

-- Cualquiera (incluida la landing, sin login) puede CREAR un lead desde el formulario.
drop policy if exists "publico_puede_crear_leads" on public.leads;
create policy "publico_puede_crear_leads"
  on public.leads for insert
  to anon
  with check (true);

-- Solo el dueño autenticado puede ver, actualizar o borrar leads (panel).
drop policy if exists "dueno_puede_ver_leads" on public.leads;
create policy "dueno_puede_ver_leads"
  on public.leads for select
  to authenticated
  using (true);

drop policy if exists "dueno_puede_actualizar_leads" on public.leads;
create policy "dueno_puede_actualizar_leads"
  on public.leads for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "dueno_puede_borrar_leads" on public.leads;
create policy "dueno_puede_borrar_leads"
  on public.leads for delete
  to authenticated
  using (true);

-- Cualquiera puede LEER los precios (los necesita la calculadora pública).
drop policy if exists "publico_puede_leer_precios" on public.pricing_config;
create policy "publico_puede_leer_precios"
  on public.pricing_config for select
  to anon, authenticated
  using (true);

-- Solo el dueño autenticado puede editar los precios.
drop policy if exists "dueno_puede_editar_precios" on public.pricing_config;
create policy "dueno_puede_editar_precios"
  on public.pricing_config for update
  to authenticated
  using (true)
  with check (true);

-- ============================================================
-- Permisos base de Postgres (aparte de las políticas RLS de arriba).
-- Sin esto, Postgres rechaza cualquier acceso ANTES de llegar a evaluar
-- las políticas — RLS solo filtra filas, no reemplaza el GRANT.
-- ============================================================
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.leads to anon, authenticated;
grant select, update on public.pricing_config to anon, authenticated;
