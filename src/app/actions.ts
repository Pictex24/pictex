"use server";

import { creaClienteServidor } from "@/lib/supabase/server";

export interface DatosLead {
  nombre: string;
  telefono: string;
  m2Apartamento: number | null;
  paredM2: number;
  paredManual: boolean;
  incluyeTecho: boolean;
  precioMin: number;
  precioMax: number;
  fechaEntrega: string | null;
}

export interface ResultadoCrearLead {
  ok: boolean;
  error?: string;
}

/**
 * Crea un lead desde el formulario público de la landing (calculadora).
 * No requiere sesión: la política RLS "publico_puede_crear_leads" permite
 * el insert a rol anon, pero solo insert — no puede leer ni editar leads.
 */
export async function crearLead(datos: DatosLead): Promise<ResultadoCrearLead> {
  const nombre = datos.nombre.trim();
  const telefono = datos.telefono.trim();

  if (!nombre || nombre.length < 2) {
    return { ok: false, error: "Escribe tu nombre." };
  }
  if (!telefono || telefono.replace(/\D/g, "").length < 7) {
    return { ok: false, error: "Escribe un número de WhatsApp válido." };
  }
  if (!datos.paredM2 || datos.paredM2 <= 0) {
    return { ok: false, error: "El área de pared debe ser mayor a 0." };
  }

  const supabase = await creaClienteServidor();

  const { error } = await supabase.from("leads").insert({
    nombre,
    telefono,
    m2_apartamento: datos.m2Apartamento,
    pared_m2: datos.paredM2,
    pared_manual: datos.paredManual,
    incluye_techo: datos.incluyeTecho,
    precio_estimado_min: datos.precioMin,
    precio_estimado_max: datos.precioMax,
    fecha_entrega: datos.fechaEntrega,
  });

  if (error) {
    console.error("Error creando lead:", error.message);
    return { ok: false, error: "No pudimos enviar tu cotización. Intenta de nuevo." };
  }

  return { ok: true };
}
