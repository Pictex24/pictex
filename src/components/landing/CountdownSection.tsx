"use client";

import { useCotizador } from "./CotizadorContext";

function calculaEtiqueta(fechaEntrega: string) {
  if (!fechaEntrega) {
    return { dias: "—", label: "Selecciona una fecha arriba", urgente: false };
  }
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const objetivo = new Date(fechaEntrega + "T00:00:00");
  const diffDias = Math.round((objetivo.getTime() - hoy.getTime()) / 86400000);

  if (diffDias < 0) {
    return {
      dias: "—",
      label: "Esa fecha ya pasó, cotiza igual y vemos qué hacemos",
      urgente: true,
    };
  }
  if (diffDias === 0) {
    return {
      dias: "Hoy",
      label: "Es hoy — cotiza ya para ver si alcanzamos",
      urgente: true,
    };
  }
  if (diffDias <= 2) {
    return {
      dias: String(diffDias),
      label: "Muy justo, pero probablemente alcanzamos — cotiza ya",
      urgente: true,
    };
  }
  if (diffDias <= 7) {
    return {
      dias: String(diffDias),
      label: "Perfecto, tenemos tiempo de sobra para coordinar bien",
      urgente: false,
    };
  }
  return {
    dias: String(diffDias),
    label: "Tienes margen — igual conviene agendar pronto y asegurar el cupo",
    urgente: false,
  };
}

export default function CountdownSection() {
  const { fechaEntrega, setFechaEntrega } = useCotizador();
  const { dias, label, urgente } = calculaEtiqueta(fechaEntrega);

  return (
    <section className="countdown">
      <div className="wrap countdown-box">
        <div className="countdown-left">
          <div className="trust-label">¿Cuándo necesitas entregar?</div>
          <h2 className="countdown-h">Dinos la fecha y te decimos si alcanzamos</h2>
          <input
            type="date"
            className="date-input"
            value={fechaEntrega}
            onChange={(e) => setFechaEntrega(e.target.value)}
          />
        </div>
        <div className="countdown-right">
          <div className="countdown-days">{dias}</div>
          <div
            className="countdown-label"
            style={{ color: urgente ? "var(--orange)" : "#c9c6bd" }}
          >
            {label}
          </div>
          {fechaEntrega && (
            <a className="btn" href="#calculadora">
              Ver precio y cotizar
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
