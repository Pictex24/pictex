import Link from "next/link";
import { cerrarSesion } from "@/app/panel/actions";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f2f0ea] text-[#1a1a18]">
      <header className="border-b border-[#e0ddd3] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-extrabold uppercase tracking-wide">
            Pic<span className="text-[#e8630a]">tex</span>{" "}
            <span className="text-sm font-medium normal-case text-[#6b685f]">
              panel
            </span>
          </div>
          <nav className="flex items-center gap-5 text-sm font-medium">
            <Link href="/panel" className="hover:text-[#e8630a]">
              Leads
            </Link>
            <Link href="/panel/config" className="hover:text-[#e8630a]">
              Configuración de precios
            </Link>
            <form action={cerrarSesion}>
              <button
                type="submit"
                className="text-[#6b685f] hover:text-[#e8630a]"
              >
                Cerrar sesión
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
