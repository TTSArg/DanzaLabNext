"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Space = {
  id: number; name: string; barrio: string; arte: string[]; cap: number;
  tipo: "Formación" | "Premium"; feats: string[]; precio: string; wpp: string; tRespuesta: number;
};

const zones = ["Palermo", "Almagro", "San Telmo", "Villa Crespo", "Caballito", "Boedo", "Chacarita", "Recoleta"];
const disciplines = ["Danza contemporánea", "Tango", "Teatro", "Circo", "Danza clásica"];
const featureFilters = ["Piso flotante", "Espejos", "Barras", "Sonido", "Vestuarios"];

export default function EnsayaPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [databaseError, setDatabaseError] = useState(false);
  const [view, setView] = useState<"buscar" | "admin">("buscar");
  const [zone, setZone] = useState(""); const [discipline, setDiscipline] = useState(""); const [capacity, setCapacity] = useState("");
  const [activeType, setActiveType] = useState<"" | "Formación" | "Premium">(""); const [activeFeatures, setActiveFeatures] = useState<string[]>([]);
  const [selected, setSelected] = useState<Space | null>(null); const [showPublish, setShowPublish] = useState(false);
  const [publishName, setPublishName] = useState(""); const [publishZone, setPublishZone] = useState(zones[0]); const [publishCapacity, setPublishCapacity] = useState("");

  useEffect(() => {
    async function loadSpaces() {
      const { data, error } = await supabase.from("salas").select("*").eq("activa", true).order("nombre");
      if (error) {
        setDatabaseError(true);
      } else {
        setSpaces((data ?? []).map((sala) => ({
          id: sala.id,
          name: sala.nombre,
          barrio: sala.zona,
          arte: sala.disciplinas ?? [],
          cap: sala.capacidad ?? 0,
          tipo: sala.tipo === "Premium" ? "Premium" : "Formación",
          feats: sala.caracteristicas ?? [],
          precio: sala.precio_hora ? `$${Number(sala.precio_hora).toLocaleString("es-AR")}/hora` : "Consultar",
          wpp: sala.whatsapp ?? "",
          tRespuesta: sala.tiempo_respuesta_minutos ?? 60,
        })));
      }
      setLoading(false);
    }
    loadSpaces();
  }, []);

  const filteredSpaces = useMemo(() => spaces.filter((space) => {
    return (!zone || space.barrio === zone) && (!discipline || space.arte.includes(discipline)) && (!capacity || space.cap >= Number(capacity)) && (!activeType || space.tipo === activeType) && activeFeatures.every((feature) => space.feats.includes(feature));
  }), [activeFeatures, activeType, capacity, discipline, spaces, zone]);
  function toggleFeature(feature: string) { setActiveFeatures((current) => current.includes(feature) ? current.filter((item) => item !== feature) : [...current, feature]); }
  function addSpace(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); if (!publishName.trim()) return; setSpaces((current) => [...current, { id: Date.now(), name: publishName.trim(), barrio: publishZone, arte: ["Danza contemporánea"], cap: Number(publishCapacity) || 8, tipo: "Formación", feats: ["Piso flotante"], precio: "A coordinar", wpp: "", tRespuesta: 60 }]); setPublishName(""); setPublishCapacity(""); setShowPublish(false); setView("admin"); }

  return <main className="ensaya-page page">
    <header className="ensaya-topbar"><div><strong className="ensaya-brand">Danza Lab · Ensaya</strong><span className="ensaya-tag">salas de ensayo · CABA</span></div><div className="ensaya-tabs"><button className={view === "buscar" ? "active" : ""} onClick={() => setView("buscar")}>Buscar salas</button><button className={view === "admin" ? "active" : ""} onClick={() => setView("admin")}>Panel de gestión</button></div><button className="btn ensaya-publish" onClick={() => setShowPublish(true)}>Publicar mi espacio</button></header>
    {view === "buscar" ? <>
      <section className="ensaya-hero"><div className="ensaya-hero-inner"><div className="inner-label">Un espacio de Danza Lab</div><h1>Encontrá sala.<br />Ensayá hoy.</h1><p>Todas las salas de ensayo de CABA, en un solo lugar. Filtrá por zona, disciplina y capacidad.</p><div className="ensaya-search"><label>Zona<select value={zone} onChange={(event) => setZone(event.target.value)}><option value="">Cualquier barrio</option>{zones.map((item) => <option key={item}>{item}</option>)}</select></label><label>Disciplina<select value={discipline} onChange={(event) => setDiscipline(event.target.value)}><option value="">Todas</option>{disciplines.map((item) => <option key={item}>{item}</option>)}</select></label><label>Personas<input type="number" min="1" placeholder="Ej: 6" value={capacity} onChange={(event) => setCapacity(event.target.value)} /></label><button className="btn" onClick={() => setView("buscar")}>Buscar</button></div></div></section>
      <div className="ensaya-filters"><button className={activeType === "Formación" ? "chip active" : "chip"} onClick={() => setActiveType(activeType === "Formación" ? "" : "Formación")}>Formación y práctica</button><button className={activeType === "Premium" ? "chip active" : "chip"} onClick={() => setActiveType(activeType === "Premium" ? "" : "Premium")}>Espacios premium</button><span className="filters-sep" />{featureFilters.map((feature) => <button className={activeFeatures.includes(feature) ? "chip active" : "chip"} key={feature} onClick={() => toggleFeature(feature)}>{feature}</button>)}<span className="results-count">{filteredSpaces.length} {filteredSpaces.length === 1 ? "sala encontrada" : "salas encontradas"}</span></div>
      <section className="ensaya-results">{loading && <p className="status-message">Cargando salas disponibles...</p>}{databaseError && <p className="status-message">No pudimos conectar con la base de datos.</p>}{!loading && !databaseError && filteredSpaces.map((space) => <SpaceCard key={space.id} space={space} onSelect={setSelected} />)}{!loading && !databaseError && !filteredSpaces.length && <p className="status-message">No hay salas activas disponibles con esos filtros.</p>}</section>
    </> : <AdminView spaces={spaces} onPublish={() => setShowPublish(true)} />}
    {selected && <DetailModal space={selected} onClose={() => setSelected(null)} />}
    {showPublish && <div className="ensaya-modal-backdrop"><form className="ensaya-modal" onSubmit={addSpace}><button type="button" className="modal-close" onClick={() => setShowPublish(false)}>×</button><div className="inner-label">Ensaya · Comunidad</div><h2>Sumá tu espacio</h2><p>La publicación es gratuita y el contacto queda siempre directo con vos.</p><label>Nombre del espacio<input required value={publishName} onChange={(event) => setPublishName(event.target.value)} placeholder="Ej: Estudio Marea" /></label><label>Barrio<select value={publishZone} onChange={(event) => setPublishZone(event.target.value)}>{zones.map((item) => <option key={item}>{item}</option>)}</select></label><label>Capacidad<input type="number" min="1" value={publishCapacity} onChange={(event) => setPublishCapacity(event.target.value)} placeholder="Ej: 10" /></label><button className="btn" type="submit">Enviar solicitud</button></form></div>}
  </main>;
}

function SpaceCard({ space, onSelect }: { space: Space; onSelect: (space: Space) => void }) { return <article className="ensaya-card" onClick={() => onSelect(space)}><div className="space-card-top"><div className="space-initial">{space.name.charAt(0)}</div><div><h3>{space.name}</h3><p>{space.barrio} · hasta {space.cap} personas</p></div></div><div className="space-badges"><span className={space.tipo === "Premium" ? "badge premium" : "badge rapida"}>{space.tipo}</span>{space.tRespuesta <= 30 && <span className="badge rapida">Respuesta rápida</span>}</div><div className="space-tags">{space.feats.slice(0, 3).map((feature) => <span key={feature}>{feature}</span>)}</div><div className="space-bottom"><span>{space.precio}</span><button className="btn-consult" onClick={(event) => { event.stopPropagation(); onSelect(space); }}>Consultar</button></div></article>; }
function DetailModal({ space, onClose }: { space: Space; onClose: () => void }) { return <div className="ensaya-modal-backdrop" onClick={onClose}><aside className="ensaya-detail" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose}>×</button><div className="inner-label">Sala de ensayo</div><h2>{space.name}</h2><p>{space.barrio} · {space.arte.join(", ")} · hasta {space.cap} personas</p><h3>Características</h3><div className="space-tags">{space.feats.map((feature) => <span key={feature}>{feature}</span>)}</div><h3>Tarifa de referencia</h3><p>{space.precio}</p><h3>Disponibilidad esta semana</h3><div className="schedule-grid">{["Lun 18h", "Lun 20h", "Mar 10h", "Mié 19h", "Jue 18h", "Vie 15h", "Sáb 11h", "Sáb 17h"].map((slot, index) => <span className={index === 1 || index === 4 ? "slot busy" : "slot"} key={slot}>{slot}</span>)}</div><a className="btn btn-block" href={`https://wa.me/${space.wpp}?text=Hola%2C%20te%20escribo%20desde%20Ensaya%20para%20consultar%20disponibilidad.`} target="_blank" rel="noreferrer">Consultar disponibilidad</a></aside></div>; }
function AdminView({ spaces, onPublish }: { spaces: Space[]; onPublish: () => void }) { return <section className="admin-wrap"><div className="admin-hero"><div className="inner-label">Ensaya · Gestión</div><h2>Panel de gestión mensual</h2><p>Revisá los espacios activos e incorporá nuevas salas al listado.</p></div><div className="admin-grid"><div className="admin-panel"><h3>Espacios activos</h3><p className="hint">Los que ya están publicados en el buscador.</p>{spaces.map((space) => <div className="space-list-item" key={space.id}><span>{space.name} · {space.barrio}</span><span>{space.tipo}</span></div>)}<button className="btn btn-add" onClick={onPublish}>Sumar espacio al listado</button></div><div className="admin-panel"><h3>Base de datos</h3><p className="hint">Información del piloto de Ensaya.</p><p>Los espacios publicados se pueden conectar a Supabase para administrar disponibilidad, características, precios y contactos desde una fuente única.</p><Link className="btn-outline" href="/ensaya/salas">Ver listado público</Link></div></div></section>; }
