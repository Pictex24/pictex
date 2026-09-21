import { creaClienteServidor } from "@/lib/supabase/server";
import type { Lead } from "@/lib/tipos";
import EstadoSelect from "@/components/panel/EstadoSelect";
import PrecioFinalCell from "@/components/panel/PrecioFinalCell";

function formatoCOP(n: number) {
  return "$" + Math.round(n).toLocaleString("es-CO");
}

function esEsteMes(fechaISO: string) {
  const fecha = new Date(fechaISO);
  const hoy = new Date();
  return (
    fecha.getFullYear() === hoy.getFullYear() &&
    fecha.getMonth() === hoy.getMonth()
  );
}

export default async function PanelPage() {
  const supabase = await creaClienteServidor();
  const { data: leadsData } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const leads = (leadsData ?? []) as Lead[];

  const ingresosMes = leads
    .filter((l) => l.estado === "pagado" && l.fecha_pago && esEsteMes(l.fecha_pago))
    .reduce((sum, l) => sum + (l.precio_final ?? 0), 0);

  const trabajosCompletadosMes = leads.filter(
    (l) =>
      (l.estado === "terminado" || l.estado === "pagado") &&
      esEsteMes(l.updated_at)
  ).length;

  const leadsActivos = leads.filter(
    (l) => l.estado !== "pagado"
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold uppercase tracking-wide">
          Leads y trabajos
        </h1>
        <p className="text-sm text-[#6b685f] mt-1">
          Cotizaciones capturadas desde la landing, más recientes primero.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#e0ddd3] rounded-md p-5">
          <div className="text-xs uppercase tracking-wide text-[#6b685f]">
            Ingresos del mes
          </div>
          <div className="text-2xl font-extrabold mt-1">
            {formatoCOP(ingresosMes)}
          </div>
        </div>
        <div className="bg-white border border-[#e0ddd3] rounded-md p-5">
          <div className="text-xs uppercase tracking-wide text-[#6b685f]">
            Trabajos completados (mes)
          </div>
          <div className="text-2xl font-extrabold mt-1">
            {trabajosCompletadosMes}
          </div>
        </div>
        <div className="bg-white border border-[#e0ddd3] rounded-md p-5">
          <div className="text-xs uppercase tracking-wide text-[#6b685f]">
            Leads activos (sin pagar aún)
          </div>
          <div className="text-2xl font-extrabold mt-1">{leadsActivos}</div>
        </div>
      </div>

      <div className="bg-white border border-[#e0ddd3] rounded-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e0ddd3] text-left text-xs uppercase tracking-wide text-[#6b685f]">
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Detalle</th>
              <th className="px-4 py-3">Rango estimado</th>
              <th className="px-4 py-3">Precio final</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#6b685f]">
                  Todavía no han llegado cotizaciones desde la landing.
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-[#f0eee7] align-top">
                <td className="px-4 py-3 whitespace-nowrap text-[#6b685f]">
                  {new Date(lead.created_at).toLocaleDateString("es-CO", {
                    day: "2-digit",
                    month: "short",
                  })}
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold">{lead.nombre}</div>
                  <a
                    href={`https://wa.me/${lead.telefono.replace(/\D/g, "")}`}
                    target="_blank"
                    className="text-xs text-[#e8630a] hover:underline"
                  >
                    {lead.telefono}
                  </a>
                </td>
                <td className="px-4 py-3 text-xs text-[#4a4842]">
                  {lead.pared_m2} m² pared
                  {lead.incluye_techo ? " + techo" : ""}
                  {lead.fecha_entrega && (
                    <div>
                      Entrega:{" "}
                      {new Date(lead.fecha_entrega + "T00:00:00").toLocaleDateString(
                        "es-CO",
                        { day: "2-digit", month: "short" }
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs">
                  {formatoCOP(lead.precio_estimado_min)} –{" "}
                  {formatoCOP(lead.precio_estimado_max)}
                </td>
                <td className="px-4 py-3">
                  <PrecioFinalCell id={lead.id} precioFinal={lead.precio_final} />
                </td>
                <td className="px-4 py-3">
                  <EstadoSelect id={lead.id} estado={lead.estado} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
