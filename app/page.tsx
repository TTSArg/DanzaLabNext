import Link from "next/link";
import HomeHero from "./components/home-hero";

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

      <HomeHero />

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
