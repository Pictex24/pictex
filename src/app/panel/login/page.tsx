"use client";

import { useState, useTransition } from "react";
import { iniciarSesion } from "@/app/panel/actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const resultado = await iniciarSesion(formData);
      if (resultado?.error) {
        setError(resultado.error);
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a18] px-6">
      <form
        action={handleSubmit}
        className="w-full max-w-sm bg-[#f2f0ea] rounded-md p-8 space-y-5"
      >
        <div>
          <div className="text-2xl font-extrabold uppercase tracking-wide text-[#1a1a18]">
            Pic<span className="text-[#5b7a6b]">tex</span>
          </div>
          <p className="text-sm text-[#4a4842] mt-1">Panel de gestión</p>
        </div>

        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-[#6b685f] mb-1">
            Correo
          </span>
          <input
            type="email"
            name="email"
            required
            className="w-full border border-[#c9c6bd] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#5b7a6b]"
          />
        </label>

        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-[#6b685f] mb-1">
            Contraseña
          </span>
          <input
            type="password"
            name="password"
            required
            className="w-full border border-[#c9c6bd] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#5b7a6b]"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-[#1a1a18] text-[#f2f0ea] font-semibold text-sm py-2.5 rounded hover:bg-[#5b7a6b] transition disabled:opacity-60"
        >
          {pending ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
