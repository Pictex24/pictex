import Link from "next/link";
import { cerrarSesion } from "@/app/panel/actions";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f2f0ea] text-[#1a1a18]">
      <header className="border-b border-[#e0ddd3] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-extrabold uppercase tracking-wide">
            Pic<span className="text-[#5b7a6b]">tex</span>{" "}
            <span className="text-sm font-medium normal-case text-[#6b685f]">
              panel
            </span>
          </div>
          <nav className="flex items-center gap-5 text-sm font-medium">
            <Link href="/panel" className="hover:text-[#5b7a6b]">
              Leads
            </Link>
            <Link href="/panel/config" className="hover:text-[#5b7a6b]">
              Configuración de precios
            </Link>
            <form action={cerrarSesion}>
              <button
                type="submit"
                className="text-[#6b685f] hover:text-[#5b7a6b]"
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
