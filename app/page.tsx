import Link from "next/link";

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Danza Lab",
    url: "https://danzalab.com",
    description:
      "Danza Lab conecta laboratorios de danza, salas de ensayo y composición escénica para artistas y colectivos en Buenos Aires.",
    areaServed: "Buenos Aires",
    knowsAbout: [
      "Danza",
      "salas de ensayo",
      "laboratorios de danza",
      "composición escénica",
      "artes del movimiento",
    ],
  };

  return (
    <main className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <section className="hero">
        <div className="hero-content">
          <h1>Danza<br /><span className="accent">Lab</span></h1>
          <div className="hero-sub">Explorar · Entrenar · Crear</div>
          <p className="hero-desc">
            Laboratorios de danza, salas de ensayo y espacios de composición escénica para artistas,
            colectivos y proyectos en Buenos Aires.
          </p>
          <Link className="btn" href="/ensaya">Buscar salas de ensayo</Link>
        </div>
      </section>

      <section className="inner manifesto">
        <div className="inner-label">Manifiesto</div>
        <p>
          “Danzamos porque el movimiento es la condición inherente de lo vivo. Aquí, la danza es un
          puente entre tu historia y tu presente: un diálogo entre la técnica y el instinto donde el
          error no existe, solo la transformación entre cuerpos que eligen caminar juntos.”
        </p>
        <p className="accent">
          No bailamos para dejar de ser quienes somos, sino para integrar todo lo que hemos sido.
        </p>
        <div className="button-row">
          <Link className="btn" href="/laboratorios">Ver laboratorios</Link>
          <Link className="btn-outline" href="/ensaya">Ver salas de ensayo</Link>
        </div>
      </section>
    </main>
  );
}
