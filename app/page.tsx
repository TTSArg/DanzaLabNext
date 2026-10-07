import Link from "next/link";

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Danza Lab",
    url: "https://danzalab.com.ar",
    description:
      "Danza Lab investiga el cuerpo en movimiento desde la improvisación y el tango y propone laboratorios y composición escénica.",
    areaServed: "Buenos Aires",
    knowsAbout: [
      "Danza",
      "tango",
      "improvisación",
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
          <h1>
            Danza
            <br />
            <span className="accent">Lab</span>
          </h1>
          <div className="hero-sub">Explorar · Entrenar · Crear</div>

          <p className="hero-desc">
            <span className="accent">Investigamos el cuerpo en movimiento</span>, donde lo genuino se
            nutre de técnica para amplificar la capacidad de improvisación en tango.
          </p>
          <p className="hero-desc">
            <span className="accent">Abordamos la danza como pulsión de lo vivo</span>, una constante
            transformación de tejidos que nos componen y aguardan a ser descubiertos.
          </p>
          <p className="hero-desc">
            <span className="accent">Te invitamos a entrenar</span> para descubrir quién estás siendo
            en tu expresión genuina, incorporar tus hallazgos y disfrutarlos luego en la milonga.
            También podrías llevarlos a un escenario, a través de una puesta en escena.
          </p>

          <div className="hero-actions">
            <p className="hero-actions-label">Conocé nuestras propuestas</p>
            <div className="button-row">
              <Link className="btn hero-cta" href="/laboratorios">
                Laboratorios
              </Link>
              <Link className="btn-outline hero-cta" href="/composicion-escenica">
                Composición escénica
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="inner brief-home">
        <div className="brief-profile">
          <div className="brief-copy">
            <div className="inner-label">Atto Numpaque</div>
            <p>
              Soy danzante, bailarín y gestor cultural. Te invito a conocerme y a sumarte a las
              propuestas que desde Danza Lab hemos diseñado para tu exploración integral.
            </p>
            <p className="brief-signoff">Bienvenidx.</p>
            <Link className="text-link" href="/bitacora">
              Conocé mi historia →
            </Link>
          </div>

          <div className="profile-circle" aria-label="Foto de perfil de Atto Numpaque">
            <img src="/Atto_foto1.jpg" alt="Atto Numpaque" />
          </div>
        </div>
      </section>
    </main>
  );
}
