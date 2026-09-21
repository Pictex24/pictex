"use client";

import { useTransition } from "react";
import { actualizarEstadoLead } from "@/app/panel/actions";
import { ESTADOS, type EstadoLead } from "@/lib/tipos";

const COLOR_ESTADO: Record<EstadoLead, string> = {
  cotizado: "bg-gray-100 text-gray-700",
  agendado: "bg-blue-50 text-blue-700",
  en_proceso: "bg-amber-50 text-amber-700",
  terminado: "bg-emerald-50 text-emerald-700",
  pagado: "bg-[#5b7a6b1a] text-[#5b7a6b]",
};

export default function EstadoSelect({
  id,
  estado,
}: {
  id: string;
  estado: EstadoLead;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={estado}
      disabled={pending}
      onChange={(e) =>
        startTransition(() =>
          actualizarEstadoLead(id, e.target.value as EstadoLead)
        )
      }
      className={`text-xs font-semibold rounded px-2 py-1.5 border-0 cursor-pointer ${COLOR_ESTADO[estado]} disabled:opacity-50`}
    >
      {ESTADOS.map((e) => (
        <option key={e.value} value={e.value}>
          {e.label}
        </option>
      ))}
    </select>
  );
}
