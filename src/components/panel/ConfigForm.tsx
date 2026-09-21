"use client";

import { useState, useTransition } from "react";
import { actualizarConfig } from "@/app/panel/actions";
import type { PricingConfig } from "@/lib/tipos";

function Campo({
  label,
  hint,
  value,
  onChange,
  step,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wide text-[#6b685f] mb-1">
        {label}
      </span>
      <input
        type="number"
        step={step ?? 1}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full border border-[#e0ddd3] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#5b7a6b]"
      />
      {hint && <span className="block text-xs text-[#98958c] mt-1">{hint}</span>}
    </label>
  );
}

export default function ConfigForm({ config }: { config: PricingConfig }) {
  const [wallFactor, setWallFactor] = useState(config.wall_factor);
  const [paredLow, setParedLow] = useState(config.pared_low);
  const [paredHigh, setParedHigh] = useState(config.pared_high);
  const [techoLow, setTechoLow] = useState(config.techo_low);
  const [techoHigh, setTechoHigh] = useState(config.techo_high);
  const [descuento, setDescuento] = useState(config.descuento_lanzamiento);

  const [pending, startTransition] = useTransition();
  const [mensaje, setMensaje] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

  function guardar() {
    setMensaje(null);
    startTransition(async () => {
      const resultado = await actualizarConfig({
        wall_factor: wallFactor,
        pared_low: paredLow,
        pared_high: paredHigh,
        techo_low: techoLow,
        techo_high: techoHigh,
        descuento_lanzamiento: descuento,
      });
      setMensaje(
        resultado.ok
          ? { tipo: "ok", texto: "Guardado. La landing ya usa estos precios." }
          : { tipo: "error", texto: resultado.error ?? "Error al guardar." }
      );
    });
  }

  return (
    <div className="bg-white border border-[#e0ddd3] rounded-md p-6 space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Campo
          label="Factor de pared"
          hint="m² de pared por cada m² de apartamento"
          value={wallFactor}
          onChange={setWallFactor}
          step={0.1}
        />
        <Campo
          label="Descuento de lanzamiento (%)"
          value={descuento}
          onChange={setDescuento}
        />
        <Campo
          label="Tarifa pared mínima (COP/m²)"
          value={paredLow}
          onChange={setParedLow}
        />
        <Campo
          label="Tarifa pared máxima (COP/m²)"
          value={paredHigh}
          onChange={setParedHigh}
        />
        <Campo
          label="Tarifa techo mínima (COP/m²)"
          value={techoLow}
          onChange={setTechoLow}
        />
        <Campo
          label="Tarifa techo máxima (COP/m²)"
          value={techoHigh}
          onChange={setTechoHigh}
        />
      </div>

      {mensaje && (
        <p className={mensaje.tipo === "ok" ? "text-sm text-emerald-600" : "text-sm text-red-600"}>
          {mensaje.texto}
        </p>
      )}

      <button
        onClick={guardar}
        disabled={pending}
        className="bg-[#1a1a18] text-[#f2f0ea] font-semibold text-sm px-5 py-2.5 rounded hover:bg-[#5b7a6b] transition disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Guardar cambios"}
      </button>
    </div>
  );
}
