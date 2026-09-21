import { creaClienteServidor } from "@/lib/supabase/server";
import type { PricingConfig } from "@/lib/tipos";
import ConfigForm from "@/components/panel/ConfigForm";

export default async function ConfigPage() {
  const supabase = await creaClienteServidor();
  const { data } = await supabase
    .from("pricing_config")
    .select("*")
    .eq("id", 1)
    .single();

  const config = data as PricingConfig;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold uppercase tracking-wide">
          Configuración de precios
        </h1>
        <p className="text-sm text-[#6b685f] mt-1 max-w-xl">
          Estos valores alimentan la calculadora de la landing en vivo — no
          necesitas tocar código para ajustar precios.
        </p>
      </div>
      <ConfigForm config={config} />
    </div>
  );
}
