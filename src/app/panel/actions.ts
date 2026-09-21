"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { creaClienteServidor } from "@/lib/supabase/server";
import type { EstadoLead } from "@/lib/tipos";
import { crearEventoAgenda, borrarEventoAgenda } from "@/lib/google/calendar";

export async function iniciarSesion(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await creaClienteServidor();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Correo o contraseña incorrectos." };
  }

  redirect("/panel");
}

export async function cerrarSesion() {
  const supabase = await creaClienteServidor();
  await supabase.auth.signOut();
  redirect("/panel/login");
}

export async function actualizarEstadoLead(id: string, estado: EstadoLead) {
  const supabase = await creaClienteServidor();

  const { data: lead, error: errorLectura } = await supabase
    .from("leads")
    .select("nombre, telefono, pared_m2, incluye_techo, fecha_entrega, notas, calendar_event_id")
    .eq("id", id)
    .single();

  if (errorLectura || !lead) {
    console.error("Error leyendo el lead antes de actualizar estado:", errorLectura?.message);
    throw new Error("No se pudo actualizar el estado.");
  }

  const cambios: Record<string, unknown> = { estado };
  if (estado === "pagado") {
    cambios.fecha_pago = new Date().toISOString().slice(0, 10);
  }

  // Al agendar con fecha de entrega, crea el evento en Google Calendar del
  // dueño (una sola vez — si ya tiene calendar_event_id, no duplica).
  if (estado === "agendado" && lead.fecha_entrega && !lead.calendar_event_id) {
    try {
      const eventId = await crearEventoAgenda({
        nombre: lead.nombre,
        telefono: lead.telefono,
        paredM2: lead.pared_m2,
        incluyeTecho: lead.incluye_techo,
        fechaEntrega: lead.fecha_entrega,
        notas: lead.notas,
      });
      if (eventId) cambios.calendar_event_id = eventId;
    } catch (error) {
      // Si falla Google Calendar no bloqueamos el cambio de estado — el
      // panel sigue siendo la fuente de verdad aunque el calendario falle.
      console.error("Error creando evento en Google Calendar:", error);
    }
  }

  // Si se revierte a "cotizado", el trabajo ya no está agendado: borra el
  // evento para no dejar basura en el calendario.
  if (estado === "cotizado" && lead.calendar_event_id) {
    await borrarEventoAgenda(lead.calendar_event_id);
    cambios.calendar_event_id = null;
  }

  const { error } = await supabase.from("leads").update(cambios).eq("id", id);
  if (error) {
    console.error("Error actualizando estado:", error.message);
    throw new Error("No se pudo actualizar el estado.");
  }
  revalidatePath("/panel");
}

export async function actualizarPrecioFinal(id: string, precioFinal: number) {
  const supabase = await creaClienteServidor();
  const { error } = await supabase
    .from("leads")
    .update({ precio_final: precioFinal })
    .eq("id", id);
  if (error) {
    console.error("Error actualizando precio final:", error.message);
    throw new Error("No se pudo guardar el precio.");
  }
  revalidatePath("/panel");
}

export async function actualizarNotas(id: string, notas: string) {
  const supabase = await creaClienteServidor();
  const { error } = await supabase.from("leads").update({ notas }).eq("id", id);
  if (error) {
    console.error("Error actualizando notas:", error.message);
    throw new Error("No se pudieron guardar las notas.");
  }
  revalidatePath("/panel");
}

export interface CambiosConfig {
  wall_factor: number;
  pared_low: number;
  pared_high: number;
  techo_low: number;
  techo_high: number;
  descuento_lanzamiento: number;
}

export async function actualizarConfig(cambios: CambiosConfig) {
  const supabase = await creaClienteServidor();
  const { error } = await supabase
    .from("pricing_config")
    .update(cambios)
    .eq("id", 1);
  if (error) {
    console.error("Error actualizando configuración:", error.message);
    return { ok: false, error: "No se pudo guardar la configuración." };
  }
  revalidatePath("/panel/config");
  revalidatePath("/");
  return { ok: true };
}
