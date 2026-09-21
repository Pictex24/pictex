export type EstadoLead =
  | "cotizado"
  | "agendado"
  | "en_proceso"
  | "terminado"
  | "pagado";

export const ESTADOS: { value: EstadoLead; label: string }[] = [
  { value: "cotizado", label: "Cotizado" },
  { value: "agendado", label: "Agendado" },
  { value: "en_proceso", label: "En proceso" },
  { value: "terminado", label: "Terminado" },
  { value: "pagado", label: "Pagado" },
];

export interface Lead {
  id: string;
  created_at: string;
  updated_at: string;
  nombre: string;
  telefono: string;
  m2_apartamento: number | null;
  pared_m2: number;
  pared_manual: boolean;
  incluye_techo: boolean;
  precio_estimado_min: number;
  precio_estimado_max: number;
  precio_final: number | null;
  fecha_entrega: string | null;
  fecha_pago: string | null;
  estado: EstadoLead;
  notas: string | null;
  calendar_event_id: string | null;
}

export interface PricingConfig {
  id: number;
  wall_factor: number;
  pared_low: number;
  pared_high: number;
  techo_low: number;
  techo_high: number;
  descuento_lanzamiento: number;
  updated_at: string;
}
