import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      <section className="hero"><div className="hero-content"><h1>Danza<br /><span className="accent">Lab</span></h1><div className="hero-sub">Explorar · Entrenar · Crear</div><p className="hero-desc">Una plataforma para las artes del movimiento. Procesos de aprendizaje, investigación y composición para quienes quieren habitar la danza desde adentro.</p><Link className="btn" href="/laboratorios">Iniciar el viaje</Link></div></section>
      <section className="inner manifesto"><div className="inner-label">Manifiesto</div><p>“Danzamos porque el movimiento es la condición inherente de lo vivo. Aquí, la danza es un puente entre tu historia y tu presente: un diálogo entre la técnica y el instinto donde el error no existe, solo la transformación entre cuerpos que eligen caminar juntos.”</p><p className="accent">No bailamos para dejar de ser quienes somos, sino para integrar todo lo que hemos sido.</p><div className="button-row"><a className="btn" href="https://wa.me/54000000000">Escribir por WhatsApp</a></div></section>
    </main>
  );
}
