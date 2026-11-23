import Link from "next/link";

const links = [["Laboratorios", "/laboratorios"], ["Composición Escénica", "/composicion-escenica"], ["App Ensaya", "/ensaya"], ["Bitácora", "/bitacora"], ["Novedades", "/novedades"]];

export function WhatsAppIcon({ className = "whatsapp-icon" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.1 11.7a8.1 8.1 0 0 1-12 7.1L4 20l1.2-4a8.1 8.1 0 1 1 14.9-4.3Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.2 7.7c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.7c.1.3 0 .5-.1.7l-.6.7c-.1.2-.2.3 0 .6.5 1 1.3 1.8 2.3 2.3.3.1.4.1.6-.1l.8-.9c.2-.2.4-.2.7-.1l1.6.8c.3.1.5.3.5.5 0 .3-.1 1-.5 1.4-.4.5-1.1.8-1.8.7-1-.1-2.3-.6-3.7-1.7-1.1-.9-2-2-2.4-3.1-.4-1-.1-2.2.2-2.6Z" fill="currentColor"/>
    </svg>
  );
}

export function SiteNav() {
  return <nav className="site-nav"><div className="nav-top"><Link className="logo" href="/">Danza<span>Lab</span></Link></div><ul className="nav-tabs">{links.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul></nav>;
}

export function WhatsAppFloat() {
  return (
    <a
      className="whatsapp-float"
      href="https://wa.me/5491122430943?text=Hola%20Danza%20Lab%2C%20quiero%20consultar%20sobre%20las%20propuestas."
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <WhatsAppIcon />
    </a>
  );
}

export function SiteFooter() { return <footer><div className="flogo">Danza Lab</div><p className="ffrase">“Danzar en el estado presente abre el camino hacia nosotros mismos”</p><small>© 2025 Danza Lab · Buenos Aires · Artes del Movimiento</small></footer>; }

export function PageIntro({ label, title, description }: { label: string; title: string; description?: string }) { return <header className="inner-header"><div className="inner-label">{label}</div><h2>{title}</h2><div className="divider" />{description && <p>{description}</p>}</header>; }