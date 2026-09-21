import { creaClienteServidor } from "@/lib/supabase/server";
import type { PricingConfig } from "@/lib/tipos";
import { CotizadorProvider } from "@/components/landing/CotizadorContext";
import CountdownSection from "@/components/landing/CountdownSection";
import CalculatorSection from "@/components/landing/CalculatorSection";
import CompareBars from "@/components/landing/CompareBars";
import HeroPlanes from "@/components/landing/HeroPlanes";

const CONFIG_POR_DEFECTO: PricingConfig = {
  id: 1,
  wall_factor: 2.3,
  pared_low: 9000,
  pared_high: 11000,
  techo_low: 10000,
  techo_high: 12000,
  descuento_lanzamiento: 20,
  updated_at: new Date().toISOString(),
};

async function obtenerConfig(): Promise<PricingConfig> {
  const supabase = await creaClienteServidor();
  const { data } = await supabase
    .from("pricing_config")
    .select("*")
    .eq("id", 1)
    .single();
  return (data as PricingConfig) ?? CONFIG_POR_DEFECTO;
}

export default async function Home() {
  const config = await obtenerConfig();

  return (
    <CotizadorProvider config={config}>
      <header>
        <div className="logo">
          Pic<span>tex</span>
        </div>
        <a className="btn" href="#calculadora">
          Cotizar
        </a>
      </header>

      <section className="hero">
        <HeroPlanes />
        <div className="wrap hero-grid">
          <div className="hero-number">
            24–48
            <small>horas para tener tu apartamento listo</small>
          </div>
          <div>
            <h1>Entrega tu apartamento pintado, sin perder tiempo</h1>
            <p>
              Pintamos con máquina profesional de aspersión: el mismo
              acabado, en una fracción del tiempo que toma un pintor
              tradicional. Ideal si tienes fecha límite de entrega y no
              quieres coordinar una obra de varios días.
            </p>
            <div className="hero-ctas">
              <a className="btn" href="#calculadora">
                Cotizar ahora
              </a>
              <a className="btn btn-outline" href="#calculadora">
                Ver precio estimado
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="strip">
        <div className="wrap">
          <span>Servicio en Bogotá</span>
          <span>Máquina de aspersión profesional</span>
          <span>Apartamentos vacíos y en entrega de arriendo</span>
        </div>
      </div>

      <CountdownSection />

      <section className="steps">
        <div className="wrap">
          <div className="section-head">
            <h2>Cómo funciona</h2>
          </div>
          <div className="steps-grid">
            <div className="step">
              <div className="step-num">01</div>
              <h3>Cuéntanos del apartamento</h3>
              <p>
                Metros cuadrados, número de habitaciones y fecha en la que
                necesitas entregarlo. Te respondemos con un precio estimado
                el mismo día.
              </p>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <h3>Agendamos la visita</h3>
              <p>
                Confirmamos color, protegemos pisos y muebles, y coordinamos
                el horario que mejor te sirva antes de tu fecha de entrega.
              </p>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <h3>Pintamos y entregas a tiempo</h3>
              <p>
                Aplicamos con máquina profesional en horas, no días. Revisas
                el acabado y entregas el apartamento sin contratiempos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="trust">
        <div className="wrap trust-grid">
          <div className="trust-person">
            <div className="avatar">C</div>
            <div>
              <div className="trust-label">Quién hace el trabajo</div>
              <p className="trust-text">
                Camilo, en Bogotá. Yo mismo coordino cada cotización y
                respondo el WhatsApp — no es un call center ni una
                franquicia. Si me escribes, hablas conmigo.
              </p>
            </div>
          </div>
          <div className="trust-guarantee">
            <div className="guarantee-mark">✓</div>
            <div>
              <div className="trust-label">Garantía</div>
              <p className="trust-text">
                Si algo no queda bien — una mancha, una zona destapada —
                vuelvo y lo corrijo sin costo adicional. No te quedas solo
                con el problema después de pagar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="compare">
        <div className="wrap">
          <div className="section-head">
            <h2>Por qué máquina y no rodillo</h2>
          </div>
          <CompareBars />
        </div>
      </section>

      <CalculatorSection />

      <section className="faq">
        <div className="wrap">
          <div className="section-head">
            <h2>Preguntas frecuentes</h2>
          </div>
          <div className="faq-list">
            <details className="faq-item">
              <summary>¿Qué pasa si dañan algo mientras pintan?</summary>
              <p>
                Protegemos pisos, muebles y ventanas antes de encender la
                máquina. Si algo se daña por nuestra culpa, lo asumimos — no
                es algo que tengas que discutir después.
              </p>
            </details>
            <details className="faq-item">
              <summary>¿Cómo pago — antes, durante o después?</summary>
              <p>
                Confirmamos el precio antes de agendar. El pago se hace al
                terminar el trabajo y revisar el acabado juntos, no antes.
              </p>
            </details>
            <details className="faq-item">
              <summary>¿Qué pasa si el color no queda como esperaba?</summary>
              <p>
                Confirmamos el color contigo antes de aplicar. Si el acabado
                tiene un defecto real de aplicación (manchas, zonas
                destapadas), volvemos y lo corregimos sin costo.
              </p>
            </details>
            <details className="faq-item">
              <summary>
                ¿Trabajan de noche o fines de semana si tengo prisa?
              </summary>
              <p>
                Sí — como sabemos que la mayoría de entregas de arriendo
                tienen fecha límite fija, ajustamos el horario a lo que
                necesites, incluyendo fines de semana.
              </p>
            </details>
            <details className="faq-item">
              <summary>¿Necesito estar presente mientras pintan?</summary>
              <p>
                No es obligatorio si el apartamento ya está vacío y
                coordinamos el acceso contigo (portería, administración).
                Preferimos que estés al inicio y al final para revisar
                juntos.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section className="final">
        <div className="wrap">
          <h2>¿Tienes fecha de entrega cerca?</h2>
          <p>
            Cuéntanos cuándo necesitas el apartamento listo y te decimos si
            alcanzamos a coordinarlo.
          </p>
          <a className="btn" href="#calculadora">
            Cotizar ahora
          </a>
        </div>
      </section>

      <footer>Pictex — Servicio de pintura express en Bogotá</footer>
    </CotizadorProvider>
  );
}
