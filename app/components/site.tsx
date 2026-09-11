import Link from "next/link";

const links = [["Laboratorios", "/laboratorios"], ["Composición Escénica", "/composicion-escenica"], ["App Ensaya", "/ensaya"], ["Bitácora", "/bitacora"], ["Novedades", "/novedades"]];

export function SiteNav() {
  return <nav className="site-nav"><div className="nav-top"><Link className="logo" href="/">Danza<span>Lab</span></Link></div><ul className="nav-tabs">{links.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul></nav>;
}

export function SiteFooter() { return <footer><div className="flogo">Danza Lab</div><p className="ffrase">“Danzar en el estado presente abre el camino hacia nosotros mismos”</p><small>© 2025 Danza Lab · Buenos Aires · Artes del Movimiento</small></footer>; }

export function PageIntro({ label, title, description }: { label: string; title: string; description?: string }) { return <header className="inner-header"><div className="inner-label">{label}</div><h2>{title}</h2><div className="divider" />{description && <p>{description}</p>}</header>; }