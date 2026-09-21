"use client";

import { useCotizador } from "./CotizadorContext";

export default function CalculatorSection() {
  const {
    m2,
    setM2,
    paredManualActivo,
    setParedManualActivo,
    paredManualValor,
    setParedManualValor,
    techoActivo,
    setTechoActivo,
    paredArea,
    techoArea,
    precioNormalTexto,
    precioLanzamientoTexto,
    nombre,
    setNombre,
    telefono,
    setTelefono,
    enviando,
    enviado,
    error,
    enviar,
  } = useCotizador();

  return (
    <section className="calc" id="calculadora">
      <div className="wrap">
        <div className="section-head">
          <h2>Precio estimado</h2>
        </div>
        <div className="launch-badge">Precio de lanzamiento — primeros apartamentos</div>
        <div className="calc-box">
          <div className="calc-field">
            <label>Área aproximada del apartamento</label>
            <input
              type="range"
              min={25}
              max={150}
              step={5}
              value={m2}
              disabled={paredManualActivo}
              onChange={(e) => setM2(parseInt(e.target.value, 10))}
            />
            <div className="calc-value">{m2} m²</div>
            <div className="calc-sub">
              {paredManualActivo
                ? "Área de pared ingresada manualmente"
                : `≈ ${paredArea} m² de pared a pintar (estimado)`}
            </div>

            <label className="calc-toggle">
              <input
                type="checkbox"
                checked={paredManualActivo}
                onChange={(e) => setParedManualActivo(e.target.checked)}
              />
              <span>Conozco el área exacta de pared</span>
            </label>
            {paredManualActivo && (
              <input
                type="number"
                className="calc-manual-input"
                placeholder="m² de pared"
                min={1}
                value={paredManualValor}
                onChange={(e) => setParedManualValor(e.target.value)}
              />
            )}

            <label className="calc-toggle">
              <input
                type="checkbox"
                checked={techoActivo}
                onChange={(e) => setTechoActivo(e.target.checked)}
              />
              <span>Incluir techo (≈ {techoArea} m² adicionales)</span>
            </label>

            {!enviado && (
              <>
                <label style={{ marginTop: 24, display: "block" }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: 13,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: 10,
                      color: "#c9c6bd",
                    }}
                  >
                    Tu nombre
                  </span>
                  <input
                    type="text"
                    className="calc-text-input"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </label>
                <label style={{ marginTop: 14, display: "block" }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: 13,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: 10,
                      color: "#c9c6bd",
                    }}
                  >
                    Tu WhatsApp
                  </span>
                  <input
                    type="tel"
                    className="calc-text-input"
                    placeholder="300 000 0000"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </label>
              </>
            )}
          </div>
          <div className="calc-result">
            <div className="label">Rango estimado</div>
            <div className="price-old">{precioNormalTexto}</div>
            <div className="price">{precioLanzamientoTexto}</div>
            {enviado ? (
              <p className="form-success">
                <strong>¡Listo!</strong> Recibimos tu cotización, te escribimos
                pronto a tu WhatsApp para confirmar.
              </p>
            ) : (
              <>
                <button className="btn" onClick={enviar} disabled={enviando}>
                  {enviando ? "Enviando…" : "Enviar cotización"}
                </button>
                {error && <div className="form-error">{error}</div>}
              </>
            )}
          </div>
        </div>
        <div className="includes-grid">
          <div className="includes-col">
            <div className="includes-label">Incluye</div>
            <ul>
              <li>Pintura color estándar (blanco o similar) y materiales</li>
              <li>Protección de pisos, muebles y ventanas</li>
              <li>Aplicación con máquina profesional y limpieza al terminar</li>
            </ul>
          </div>
          <div className="includes-col">
            <div className="includes-label">No incluye</div>
            <ul>
              <li>
                Colores oscuros o pinturas premium (recargo aparte, se cotiza
                antes de empezar)
              </li>
              <li>Reparación de huecos grandes o humedad estructural</li>
            </ul>
          </div>
        </div>
        <p className="calc-note">
          Precio calculado por m² de pared pintada (no por m² del apartamento)
          — el área de pared se estima según el número típico de divisiones
          internas. El techo se cobra aparte por ser opcional. El precio final
          se confirma tras ver fotos o hacer una visita rápida.
        </p>
      </div>
    </section>
  );
}
