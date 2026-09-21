/**
 * Fondo decorativo del hero: planos isométricos a escala de "plano
 * arquitectónico" (solo trazo, sin relleno) que sangran fuera del viewport.
 * Pura ambientación — nunca debe competir con el texto, por eso vive detrás
 * con opacidad muy baja y pointer-events:none.
 */
export default function HeroPlanes() {
  return (
    <svg
      className="hero-planes"
      viewBox="0 0 900 820"
      preserveAspectRatio="xMaxYMin slice"
      aria-hidden="true"
    >
      <g stroke="var(--ink)" strokeWidth="1" fill="none" opacity="0.9">
        {/* Cubo grande, principal */}
        <polygon points="560,60 760,175 560,290 360,175" opacity="0.16" />
        <polygon points="560,290 760,175 760,405 560,520" opacity="0.1" />
        <polygon points="560,290 360,175 360,405 560,520" opacity="0.16" />

        {/* Cubo pequeño, superpuesto, más adentro */}
        <polygon points="330,330 460,405 330,480 200,405" opacity="0.12" />
        <polygon points="330,480 460,405 460,555 330,630" opacity="0.07" />
        <polygon points="330,480 200,405 200,555 330,630" opacity="0.12" />

        {/* Líneas de cota, al estilo de un plano técnico */}
        <line x1="200" y1="405" x2="140" y2="405" opacity="0.14" />
        <line x1="140" y1="395" x2="140" y2="415" opacity="0.14" />
        <line x1="760" y1="175" x2="830" y2="175" opacity="0.14" />
        <line x1="820" y1="165" x2="820" y2="185" opacity="0.14" />
        <circle cx="560" cy="290" r="2.5" fill="var(--orange)" stroke="none" opacity="0.5" />
        <circle cx="330" cy="480" r="2.5" fill="var(--orange)" stroke="none" opacity="0.4" />
      </g>
    </svg>
  );
}
