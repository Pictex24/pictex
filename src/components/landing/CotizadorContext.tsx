"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { crearLead } from "@/app/actions";
import type { PricingConfig } from "@/lib/tipos";

function redondearA10Mil(n: number) {
  return Math.round(n / 10000) * 10000;
}

function formatoCOP(n: number) {
  return "$" + n.toLocaleString("es-CO");
}

interface EstadoCotizador {
  config: PricingConfig;
  m2: number;
  setM2: (v: number) => void;
  paredManualActivo: boolean;
  setParedManualActivo: (v: boolean) => void;
  paredManualValor: string;
  setParedManualValor: (v: string) => void;
  techoActivo: boolean;
  setTechoActivo: (v: boolean) => void;
  fechaEntrega: string;
  setFechaEntrega: (v: string) => void;
  paredArea: number;
  techoArea: number;
  precioNormalTexto: string;
  precioLanzamientoTexto: string;
  precioLanzamientoMin: number;
  precioLanzamientoMax: number;
  nombre: string;
  setNombre: (v: string) => void;
  telefono: string;
  setTelefono: (v: string) => void;
  enviando: boolean;
  enviado: boolean;
  error: string | null;
  enviar: () => Promise<void>;
}

const Ctx = createContext<EstadoCotizador | null>(null);

export function CotizadorProvider({
  config,
  children,
}: {
  config: PricingConfig;
  children: ReactNode;
}) {
  const [m2, setM2] = useState(60);
  const [paredManualActivo, setParedManualActivo] = useState(false);
  const [paredManualValor, setParedManualValor] = useState("");
  const [techoActivo, setTechoActivo] = useState(false);
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paredArea = paredManualActivo
    ? parseInt(paredManualValor, 10) || 0
    : Math.round(m2 * config.wall_factor);
  const techoArea = m2;

  const { precioNormalTexto, precioLanzamientoTexto, precioLanzamientoMin, precioLanzamientoMax } =
    useMemo(() => {
      let lowNormal = paredArea * config.pared_low;
      let highNormal = paredArea * config.pared_high;
      if (techoActivo) {
        lowNormal += techoArea * config.techo_low;
        highNormal += techoArea * config.techo_high;
      }
      lowNormal = redondearA10Mil(lowNormal);
      highNormal = redondearA10Mil(highNormal);

      const factorDescuento = 1 - config.descuento_lanzamiento / 100;
      const lowLaunch = redondearA10Mil(lowNormal * factorDescuento);
      const highLaunch = redondearA10Mil(highNormal * factorDescuento);

      return {
        precioNormalTexto: `${formatoCOP(lowNormal)} – ${formatoCOP(highNormal)}`,
        precioLanzamientoTexto: `${formatoCOP(lowLaunch)} – ${formatoCOP(highLaunch)}`,
        precioLanzamientoMin: lowLaunch,
        precioLanzamientoMax: highLaunch,
      };
    }, [paredArea, techoArea, techoActivo, config]);

  async function enviar() {
    setError(null);
    setEnviando(true);
    const resultado = await crearLead({
      nombre,
      telefono,
      m2Apartamento: paredManualActivo ? null : m2,
      paredM2: paredArea,
      paredManual: paredManualActivo,
      incluyeTecho: techoActivo,
      precioMin: precioLanzamientoMin,
      precioMax: precioLanzamientoMax,
      fechaEntrega: fechaEntrega || null,
    });
    setEnviando(false);
    if (resultado.ok) {
      setEnviado(true);
    } else {
      setError(resultado.error ?? "Algo salió mal. Intenta de nuevo.");
    }
  }

  const value: EstadoCotizador = {
    config,
    m2,
    setM2,
    paredManualActivo,
    setParedManualActivo,
    paredManualValor,
    setParedManualValor,
    techoActivo,
    setTechoActivo,
    fechaEntrega,
    setFechaEntrega,
    paredArea,
    techoArea,
    precioNormalTexto,
    precioLanzamientoTexto,
    precioLanzamientoMin,
    precioLanzamientoMax,
    nombre,
    setNombre,
    telefono,
    setTelefono,
    enviando,
    enviado,
    error,
    enviar,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCotizador() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useCotizador debe usarse dentro de <CotizadorProvider>");
  }
  return ctx;
}
