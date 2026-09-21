"use client";

import { useState, useTransition } from "react";
import { actualizarPrecioFinal } from "@/app/panel/actions";

export default function PrecioFinalCell({
  id,
  precioFinal,
}: {
  id: string;
  precioFinal: number | null;
}) {
  const [valor, setValor] = useState(precioFinal?.toString() ?? "");
  const [pending, startTransition] = useTransition();
  const [guardado, setGuardado] = useState(false);

  function guardar() {
    const n = parseInt(valor, 10);
    if (!n || n <= 0) return;
    startTransition(async () => {
      await actualizarPrecioFinal(id, n);
      setGuardado(true);
      setTimeout(() => setGuardado(false), 1500);
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        onBlur={guardar}
        placeholder="Precio final"
        className="w-28 text-xs border border-[#e0ddd3] rounded px-2 py-1 focus:outline-none focus:border-[#e8630a]"
        disabled={pending}
      />
      {guardado && <span className="text-emerald-600 text-xs">✓</span>}
    </div>
  );
}
