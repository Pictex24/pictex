"use client";

import { useEffect, useRef } from "react";

export default function CompareBars() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll<HTMLElement>(".bar-fill").forEach((bar, idx) => {
              const target = bar.classList.contains("trad") ? "100%" : "18%";
              setTimeout(() => {
                bar.style.width = target;
              }, idx * 200);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bars" ref={containerRef}>
      <div className="bar-row">
        <div className="bar-label">
          <span>Pintor tradicional a rodillo</span>
          <span>2–3 días</span>
        </div>
        <div className="bar-track">
          <div className="bar-fill trad">
            Preparación, manos de pintura, secado entre capas
          </div>
        </div>
      </div>
      <div className="bar-row">
        <div className="bar-label">
          <span>Pictex con máquina de aspersión</span>
          <span>Medio día</span>
        </div>
        <div className="bar-track">
          <div className="bar-fill pinta">Listo en horas</div>
        </div>
      </div>
    </div>
  );
}
