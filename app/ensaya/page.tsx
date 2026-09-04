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

function createSpaceSlug(name: string, id: number) {
  const normalizedName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${normalizedName || "sala"}-${id}`;
}

type PublishForm = {
  contacto: string;
  rol: string;
  rolOtro: string;
  wpp: string;
  email: string;
  nombre: string;
  barrio: string;
  direccion: string;
  ubicacionRef: string;
  capacidad: string;
  altura: string;
  superficie: string;
  dimensiones: string;
  tipoServicio: string;
  disciplinas: string[];
  disciplinaOtra: string;
  caracteristicas: string[];
  caracteristicaOtra: string;
  medios: string[];
  medioOtro: string;
  precioDesde: string;
  precioHasta: string;
  unidad: string;
  turnoDuracion: string;
  mostrarPrecio: boolean;
  dias: string[];
  franjas: string[];
  horariosNotas: string;
  consent: boolean;
};

type PendingRequest = {
  id: number;
  created_at: string;
  nombre_espacio: string;
  barrio: string | null;
  whatsapp: string;
  estado: "pendiente" | "aprobado" | "rechazado";
  tipo_servicio: string | null;
  disciplinas: string[] | null;
  caracteristicas: string[] | null;
  capacidad: number | null;
  precio_desde: number | null;
  precio_hasta: number | null;
  email: string | null;
  contacto: string | null;
  rol: string | null;
  direccion: string | null;
  ubicacion_ref: string | null;
};

const initialPublishForm: PublishForm = {
  contacto: "",
  rol: "",
  rolOtro: "",
  wpp: "",
  email: "",
  nombre: "",
  barrio: "",
  direccion: "",
  ubicacionRef: "",
  capacidad: "",
  altura: "",
  superficie: "",
  dimensiones: "",
  tipoServicio: "Formación y práctica",
  disciplinas: ["Danza contemporánea"],
  disciplinaOtra: "",
  caracteristicas: [],
  caracteristicaOtra: "",
  medios: ["WhatsApp"],
  medioOtro: "",
  precioDesde: "",
  precioHasta: "",
  unidad: "Por hora",
  turnoDuracion: "3 horas",
  mostrarPrecio: true,
  dias: [],
  franjas: [],
  horariosNotas: "",
  consent: false,
};

export default function EnsayaPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [pendingSpaces, setPendingSpaces] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [databaseError, setDatabaseError] = useState(false);
  const [view, setView] = useState<"buscar" | "admin">("buscar");
  const [zone, setZone] = useState(""); const [discipline, setDiscipline] = useState(""); const [capacity, setCapacity] = useState("");
  const [activeType, setActiveType] = useState<"" | "Formación" | "Premium">(""); const [activeFeatures, setActiveFeatures] = useState<string[]>([]);
  const [selected, setSelected] = useState<Space | null>(null); const [showPublish, setShowPublish] = useState(false);
  const [publishForm, setPublishForm] = useState<PublishForm>(initialPublishForm);
  const [publishSubmitted, setPublishSubmitted] = useState(false);

  async function loadPublicSpaces() {
    const { data, error } = await supabase.from("salas").select("*").eq("activa", true).order("nombre");
    if (error) {
      setDatabaseError(true);
      return;
    }

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

  async function loadPendingSpaces() {
    const { data, error } = await supabase.from("espacios_solicitudes").select("*\n").order("created_at", { ascending: false });
    if (!error) {
      setPendingSpaces((data ?? []) as PendingRequest[]);
    }
  }

  useEffect(() => {
    async function loadSpaces() {
      setLoading(true);
      await loadPublicSpaces();
      await loadPendingSpaces();
      setLoading(false);
    }
    loadSpaces();
  }, []);

  const filteredSpaces = useMemo(() => spaces.filter((space) => {
    return (!zone || space.barrio === zone) && (!discipline || space.arte.includes(discipline)) && (!capacity || space.cap >= Number(capacity)) && (!activeType || space.tipo === activeType) && activeFeatures.every((feature) => space.feats.includes(feature));
  }), [activeFeatures, activeType, capacity, discipline, spaces, zone]);

  function toggleFeature(feature: string) { setActiveFeatures((current) => current.includes(feature) ? current.filter((item) => item !== feature) : [...current, feature]); }

  function updatePublishForm<T extends keyof PublishForm>(key: T, value: PublishForm[T]) {
    setPublishForm((current) => ({ ...current, [key]: value }));
  }

  function toggleArrayValue(key: "disciplinas" | "caracteristicas" | "medios" | "dias" | "franjas", value: string) {
    setPublishForm((current) => {
      const items = current[key];
      const nextItems = items.includes(value) ? items.filter((item) => item !== value) : [...items, value];
      return { ...current, [key]: nextItems };
    });
  }

  async function addSpace(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!publishForm.nombre.trim() || !publishForm.wpp.trim()) {
      alert("Completá al menos el nombre del espacio y el WhatsApp de contacto.");
      return;
    }
    if (!publishForm.consent) {
      alert("Necesitamos que confirmes las condiciones para sumar el espacio.");
      return;
    }

    const payload = {
      nombre_espacio: publishForm.nombre.trim(),
      contacto: publishForm.contacto || null,
      rol: publishForm.rol === "Otro" ? (publishForm.rolOtro || "Otro") : publishForm.rol || null,
      whatsapp: publishForm.wpp.trim(),
      email: publishForm.email || null,
      barrio: publishForm.barrio || null,
      direccion: publishForm.direccion || null,
      ubicacion_ref: publishForm.ubicacionRef || null,
      capacidad: publishForm.capacidad ? Number(publishForm.capacidad) : null,
      altura_techo: publishForm.altura ? Number(publishForm.altura) : null,
      superficie: publishForm.superficie ? Number(publishForm.superficie) : null,
      dimensiones: publishForm.dimensiones || null,
      tipo_servicio: publishForm.tipoServicio || "Formación y práctica",
      disciplinas: publishForm.disciplinas.filter((item) => item !== "Otra"),
      disciplina_otra: publishForm.disciplinas.includes("Otra") ? publishForm.disciplinaOtra : null,
      caracteristicas: publishForm.caracteristicas.filter((item) => item !== "Otra"),
      caracteristica_otra: publishForm.caracteristicas.includes("Otra") ? publishForm.caracteristicaOtra : null,
      medios_contacto: publishForm.medios.filter((item) => item !== "Otro"),
      medio_otro: publishForm.medios.includes("Otro") ? publishForm.medioOtro : null,
      precio_desde: publishForm.precioDesde ? Number(publishForm.precioDesde) : null,
      precio_hasta: publishForm.precioHasta ? Number(publishForm.precioHasta) : null,
      unidad: publishForm.unidad || "Por hora",
      turno_duracion: publishForm.unidad === "Por turno" ? publishForm.turnoDuracion : null,
      mostrar_precio: publishForm.mostrarPrecio,
      dias_disponibles: publishForm.dias,
      franjas_horarias: publishForm.franjas,
      horarios_notas: publishForm.horariosNotas || null,
      estado: "pendiente",
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("espacios_solicitudes").insert([payload]);
    if (error) {
      console.error("Supabase insert error:", error);
      alert("No pudimos guardar la solicitud. Revisá la conexión con la base de datos.");
      return;
    }

    setPublishSubmitted(true);
    await loadPendingSpaces();
  }

  async function approvePendingSpace(request: PendingRequest) {
    const approvedSpace = {
      nombre: request.nombre_espacio,
      slug: createSpaceSlug(request.nombre_espacio, request.id),
      zona: request.barrio || "Otro",
      capacidad: request.capacidad ?? 8,
      disciplinas: request.disciplinas ?? [],
      caracteristicas: request.caracteristicas ?? [],
      precio_hora: request.precio_desde && request.precio_hasta ? Number(request.precio_desde) : null,
      whatsapp: request.whatsapp ?? "",
      activa: true,
    };

    const { error: insertError } = await supabase.from("salas").insert([approvedSpace]);
    if (insertError) {
      console.error("Approve insert error:", insertError);
      alert("No pudimos aprobar esta solicitud.");
      return;
    }

    const { error: updateError } = await supabase.from("espacios_solicitudes").update({ estado: "aprobado", updated_at: new Date().toISOString() }).eq("id", request.id);
    if (updateError) {
      console.error("Approve update error:", updateError);
      alert("La sala se creó, pero no pudimos actualizar el estado de la solicitud.");
      return;
    }

    await loadPublicSpaces();
    await loadPendingSpaces();
  }

  async function rejectPendingSpace(request: PendingRequest) {
    const { error } = await supabase.from("espacios_solicitudes").update({ estado: "rechazado", updated_at: new Date().toISOString() }).eq("id", request.id);
    if (!error) {
      setPendingSpaces((current) => current.filter((item) => item.id !== request.id));
    }
  }

  function closePublishModal() {
    setShowPublish(false);
    setPublishSubmitted(false);
    setPublishForm(initialPublishForm);
  }

  return <main className="ensaya-page page">
    <header className="ensaya-topbar"><div><strong className="ensaya-brand">Danza Lab · Ensaya</strong><span className="ensaya-tag">salas de ensayo · CABA</span></div><div className="ensaya-tabs"><button className={view === "buscar" ? "active" : ""} onClick={() => setView("buscar")}>Buscar salas</button><button className={view === "admin" ? "active" : ""} onClick={() => setView("admin")}>Panel de gestión</button></div><button className="btn ensaya-publish" onClick={() => setShowPublish(true)}>Publicar mi espacio</button></header>
    {view === "buscar" ? <>
      <section className="ensaya-hero"><div className="ensaya-hero-inner"><div className="inner-label">Un espacio de Danza Lab</div><h1>Encontrá sala.<br />Ensayá hoy.</h1><p>Todas las salas de ensayo de CABA, en un solo lugar. Filtrá por zona, disciplina y capacidad.</p><div className="ensaya-search"><label>Zona<select value={zone} onChange={(event) => setZone(event.target.value)}><option value="">Cualquier barrio</option>{zones.map((item) => <option key={item}>{item}</option>)}</select></label><label>Disciplina<select value={discipline} onChange={(event) => setDiscipline(event.target.value)}><option value="">Todas</option>{disciplines.map((item) => <option key={item}>{item}</option>)}</select></label><label>Personas<input type="number" min="1" placeholder="Ej: 6" value={capacity} onChange={(event) => setCapacity(event.target.value)} /></label><button className="btn" onClick={() => setView("buscar")}>Buscar</button></div></div></section>
      <div className="ensaya-filters"><button className={activeType === "Formación" ? "chip active" : "chip"} onClick={() => setActiveType(activeType === "Formación" ? "" : "Formación")}>Formación y práctica</button><button className={activeType === "Premium" ? "chip active" : "chip"} onClick={() => setActiveType(activeType === "Premium" ? "" : "Premium")}>Espacios premium</button><span className="filters-sep" />{featureFilters.map((feature) => <button className={activeFeatures.includes(feature) ? "chip active" : "chip"} key={feature} onClick={() => toggleFeature(feature)}>{feature}</button>)}<span className="results-count">{filteredSpaces.length} {filteredSpaces.length === 1 ? "sala encontrada" : "salas encontradas"}</span></div>
      <section className="ensaya-results">{loading && <p className="status-message">Cargando salas disponibles...</p>}{databaseError && <p className="status-message">No pudimos conectar con la base de datos.</p>}{!loading && !databaseError && filteredSpaces.map((space) => <SpaceCard key={space.id} space={space} onSelect={setSelected} />)}{!loading && !databaseError && !filteredSpaces.length && <p className="status-message">No hay salas activas disponibles con esos filtros.</p>}</section>
    </> : <AdminView spaces={spaces} pendingSpaces={pendingSpaces} onPublish={() => setShowPublish(true)} onApprove={approvePendingSpace} onReject={rejectPendingSpace} />}
    {selected && <DetailModal space={selected} onClose={() => setSelected(null)} />}
    {showPublish && (
      <div className="ensaya-modal-backdrop">
        <div className="ensaya-publish-form">
          <button type="button" className="modal-close" onClick={closePublishModal}>×</button>
          {!publishSubmitted ? (
            <form onSubmit={addSpace} className="ensaya-publish-form__card">
              <div className="eyebrow">Danza Lab · Ensaya</div>
              <h1>Sumá tu espacio</h1>
              <p className="sub">Sumarse es gratis, no pide exclusividad y vos decidís el detalle de la información.</p>

              <div className="section-title">Datos de contacto</div>
              <div className="form-row">
                <div>
                  <label>Nombre de quien completa el formulario</label>
                  <input type="text" value={publishForm.contacto} onChange={(e) => updatePublishForm("contacto", e.target.value)} placeholder="Nombre y apellido" />
                </div>
                <div>
                  <label>Rol</label>
                  <select value={publishForm.rol} onChange={(e) => updatePublishForm("rol", e.target.value)}>
                    <option value="">Elegir...</option>
                    <option>Dueño/a</option>
                    <option>Coordinador/a</option>
                    <option>Encargado/a</option>
                    <option>Administrador/a</option>
                    <option value="Otro">Otro</option>
                  </select>
                  {publishForm.rol === "Otro" && <input type="text" value={publishForm.rolOtro} onChange={(e) => updatePublishForm("rolOtro", e.target.value)} placeholder="¿Cuál es tu rol?" className="inline-extra" />}
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label>WhatsApp de contacto</label>
                  <input type="text" value={publishForm.wpp} onChange={(e) => updatePublishForm("wpp", e.target.value)} placeholder="Ej: 5491122334455" />
                </div>
                <div>
                  <label>Email (opcional)</label>
                  <input type="email" value={publishForm.email} onChange={(e) => updatePublishForm("email", e.target.value)} placeholder="tu@email.com" />
                </div>
              </div>

              <div className="section-title">Datos del espacio</div>
              <div className="form-row">
                <div>
                  <label>Nombre del espacio</label>
                  <input type="text" value={publishForm.nombre} onChange={(e) => updatePublishForm("nombre", e.target.value)} placeholder="Ej: Estudio Marea" />
                </div>
                <div>
                  <label>Barrio</label>
                  <select value={publishForm.barrio} onChange={(e) => updatePublishForm("barrio", e.target.value)}>
                    <option value="">Elegir...</option>
                    {zones.map((item) => <option key={item} value={item}>{item}</option>)}
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <label>Dirección exacta (opcional)</label>
              <input type="text" value={publishForm.direccion} onChange={(e) => updatePublishForm("direccion", e.target.value)} placeholder="Calle y altura" />
              <div className="hint">Podés dejarla en blanco. Si la completás, vos elegís después si se muestra exacta o no.</div>

              <label>Ubicación de referencia (opcional)</label>
              <input type="text" value={publishForm.ubicacionRef} onChange={(e) => updatePublishForm("ubicacionRef", e.target.value)} placeholder="Ej: a 200m de Plaza Serrano, frente a la estación Palermo" />
              <div className="hint">Útil si preferís no publicar la dirección exacta pero sí orientar a quien busca sala.</div>

              <div className="form-row">
                <div>
                  <label>Capacidad máxima (personas)</label>
                  <input type="number" min="1" value={publishForm.capacidad} onChange={(e) => updatePublishForm("capacidad", e.target.value)} placeholder="Ej: 10" />
                </div>
                <div>
                  <label>Altura de techo (m, opcional — circo/rigging)</label>
                  <input type="number" step="0.1" value={publishForm.altura} onChange={(e) => updatePublishForm("altura", e.target.value)} placeholder="Ej: 4.5" />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label>Superficie aproximada (m², opcional)</label>
                  <input type="number" value={publishForm.superficie} onChange={(e) => updatePublishForm("superficie", e.target.value)} placeholder="Ej: 40" />
                </div>
                <div>
                  <label>Dimensiones (opcional)</label>
                  <input type="text" value={publishForm.dimensiones} onChange={(e) => updatePublishForm("dimensiones", e.target.value)} placeholder="Ej: 8m x 5m" />
                </div>
              </div>

              <label>Tipo de servicio</label>
              <div className="radio-row">
                {(["Formación y práctica", "Muestras / espectáculos"]).map((option) => (
                  <div
                    key={option}
                    className={publishForm.tipoServicio === option ? "radio-opt selected" : "radio-opt"}
                    onClick={() => updatePublishForm("tipoServicio", option)}
                  >
                    {option === "Formación y práctica" ? "Formación y práctica" : "Muestras / espectáculos"}
                  </div>
                ))}
              </div>

              <label>Disciplinas que recibe</label>
              <div className="check-grid">
                {[
                  "Danza contemporánea",
                  "Tango",
                  "Teatro",
                  "Circo",
                  "Danza clásica",
                  "Flamenco",
                  "Danzas urbanas",
                  "Sesiones fotográficas",
                ].map((item) => (
                  <label className="check-item" key={item}>
                    <input type="checkbox" checked={publishForm.disciplinas.includes(item)} onChange={() => toggleArrayValue("disciplinas", item)} />
                    {item}
                  </label>
                ))}
                <label className="check-item">
                  <input type="checkbox" checked={publishForm.disciplinas.includes("Otra")} onChange={() => toggleArrayValue("disciplinas", "Otra")} />
                  Otra
                </label>
              </div>
              {publishForm.disciplinas.includes("Otra") && (
                <input type="text" value={publishForm.disciplinaOtra} onChange={(e) => updatePublishForm("disciplinaOtra", e.target.value)} placeholder="¿Qué otra disciplina recibe?" />
              )}

              <label>Características del espacio</label>
              <div className="check-grid">
                {[
                  "Piso flotante",
                  "Espejos",
                  "Barras",
                  "Sonido propio",
                  "Iluminación teatral",
                  "Vestuarios",
                  "Camarines",
                  "Aire acondicionado",
                  "Gradas",
                  "Estacionamiento",
                  "Equipo para fotografía",
                  "Fondo fotográfico",
                ].map((item) => (
                  <label className="check-item" key={item}>
                    <input type="checkbox" checked={publishForm.caracteristicas.includes(item)} onChange={() => toggleArrayValue("caracteristicas", item)} />
                    {item}
                  </label>
                ))}
                <label className="check-item">
                  <input type="checkbox" checked={publishForm.caracteristicas.includes("Otra")} onChange={() => toggleArrayValue("caracteristicas", "Otra")} />
                  Otra
                </label>
              </div>
              {publishForm.caracteristicas.includes("Otra") && (
                <input type="text" value={publishForm.caracteristicaOtra} onChange={(e) => updatePublishForm("caracteristicaOtra", e.target.value)} placeholder="¿Qué otra característica tiene?" />
              )}

              <div className="section-title">Cómo querés recibir las solicitudes de alquiler</div>
              <div className="check-grid">
                {[
                  "WhatsApp",
                  "Email",
                ].map((item) => (
                  <label className="check-item" key={item}>
                    <input type="checkbox" checked={publishForm.medios.includes(item)} onChange={() => toggleArrayValue("medios", item)} />
                    {item}
                  </label>
                ))}
                <label className="check-item">
                  <input type="checkbox" checked={publishForm.medios.includes("Otro")} onChange={() => toggleArrayValue("medios", "Otro")} />
                  Otro medio
                </label>
              </div>
              {publishForm.medios.includes("Otro") && (
                <input type="text" value={publishForm.medioOtro} onChange={(e) => updatePublishForm("medioOtro", e.target.value)} placeholder="Ej: Instagram @estudiomarea, llamado telefónico, etc." />
              )}

              <div className="section-title">Tarifa y disponibilidad</div>
              <label>Tarifa de referencia — rango (opcional)</label>
              <div className="form-row">
                <div><input type="number" value={publishForm.precioDesde} onChange={(e) => updatePublishForm("precioDesde", e.target.value)} placeholder="Desde $" /></div>
                <div><input type="number" value={publishForm.precioHasta} onChange={(e) => updatePublishForm("precioHasta", e.target.value)} placeholder="Hasta $" /></div>
              </div>
              <div className="form-row">
                <div>
                  <label>Unidad</label>
                  <select value={publishForm.unidad} onChange={(e) => updatePublishForm("unidad", e.target.value)}>
                    <option>Por hora</option>
                    <option>Por turno</option>
                    <option>Por día</option>
                    <option>A coordinar</option>
                  </select>
                </div>
                {publishForm.unidad === "Por turno" && (
                  <div>
                    <label>Duración del turno</label>
                    <select value={publishForm.turnoDuracion} onChange={(e) => updatePublishForm("turnoDuracion", e.target.value)}>
                      <option>3 horas</option>
                      <option>4 horas</option>
                      <option>6 horas</option>
                    </select>
                  </div>
                )}
              </div>
              <label className="checkbox-inline"><input type="checkbox" checked={publishForm.mostrarPrecio} onChange={(e) => updatePublishForm("mostrarPrecio", e.target.checked)} />Mostrar esta tarifa públicamente en el buscador</label>

              <label>Días disponibles</label>
              <div className="check-grid">
                {[
                  "Lunes",
                  "Martes",
                  "Miércoles",
                  "Jueves",
                  "Viernes",
                  "Sábado",
                  "Domingo",
                ].map((item) => (
                  <label className="check-item" key={item}>
                    <input type="checkbox" checked={publishForm.dias.includes(item)} onChange={() => toggleArrayValue("dias", item)} />
                    {item}
                  </label>
                ))}
              </div>

              <label>Franjas horarias</label>
              <div className="check-grid">
                {[
                  "Mañana (6 a 12hs)",
                  "Tarde (12 a 18hs)",
                  "Noche (18 a 00hs)",
                ].map((item) => (
                  <label className="check-item" key={item}>
                    <input type="checkbox" checked={publishForm.franjas.includes(item)} onChange={() => toggleArrayValue("franjas", item)} />
                    {item}
                  </label>
                ))}
                <label className="check-item">
                  <input type="checkbox" checked={publishForm.franjas.includes("A coordinar")} onChange={() => toggleArrayValue("franjas", "A coordinar")} />
                  A coordinar
                </label>
              </div>

              <label>Notas de horario (opcional)</label>
              <textarea value={publishForm.horariosNotas} onChange={(e) => updatePublishForm("horariosNotas", e.target.value)} placeholder="Excepciones, feriados, o cualquier aclaración adicional" />

              <div className="reassure-box">
                <strong>Antes de enviar:</strong> sumarte no tiene costo, no implica exclusividad y vos elegís qué mostrar públicamente (precio, dirección exacta, etc.). El contacto para alquilar siempre queda directo con vos — Ensaya no cobra comisión en esta etapa. Podés pedir que te den de baja cuando quieras.
              </div>

              <label className="consent-row">
                <input type="checkbox" checked={publishForm.consent} onChange={(e) => updatePublishForm("consent", e.target.checked)} />
                Entiendo las condiciones para sumar mi espacio y confirmo que soy dueño/a, coordinador/a, encargado/a u otra persona autorizada de este lugar.
              </label>

              <button className="btn-submit" type="submit">Enviar espacio para revisión</button>
              <p className="footer-note">Un espacio del equipo de Ensaya revisa cada solicitud antes de publicarla.</p>
            </form>
          ) : (
            <div className="confirm show">
              <h2>¡Gracias!</h2>
              <p>Recibimos los datos de tu espacio. Nuestro equipo los revisa y, una vez aprobado, aparece en el buscador de Ensaya — te avisamos por el medio que elegiste cuando esté publicado.</p>
            </div>
          )}
        </div>
      </div>
    )}
  </main>;
}

function SpaceCard({ space, onSelect }: { space: Space; onSelect: (space: Space) => void }) { return <article className="ensaya-card" onClick={() => onSelect(space)}><div className="space-card-top"><div className="space-initial">{space.name.charAt(0)}</div><div><h3>{space.name}</h3><p>{space.barrio} · hasta {space.cap} personas</p></div></div><div className="space-badges"><span className={space.tipo === "Premium" ? "badge premium" : "badge rapida"}>{space.tipo}</span>{space.tRespuesta <= 30 && <span className="badge rapida">Respuesta rápida</span>}</div><div className="space-tags">{space.feats.slice(0, 3).map((feature) => <span key={feature}>{feature}</span>)}</div><div className="space-bottom"><span>{space.precio}</span><button className="btn-consult" onClick={(event) => { event.stopPropagation(); onSelect(space); }}>Consultar</button></div></article>; }
function DetailModal({ space, onClose }: { space: Space; onClose: () => void }) { return <div className="ensaya-modal-backdrop" onClick={onClose}><aside className="ensaya-detail" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose}>×</button><div className="inner-label">Sala de ensayo</div><h2>{space.name}</h2><p>{space.barrio} · {space.arte.join(", ")} · hasta {space.cap} personas</p><h3>Características</h3><div className="space-tags">{space.feats.map((feature) => <span key={feature}>{feature}</span>)}</div><h3>Tarifa de referencia</h3><p>{space.precio}</p><h3>Disponibilidad esta semana</h3><div className="schedule-grid">{["Lun 18h", "Lun 20h", "Mar 10h", "Mié 19h", "Jue 18h", "Vie 15h", "Sáb 11h", "Sáb 17h"].map((slot, index) => <span className={index === 1 || index === 4 ? "slot busy" : "slot"} key={slot}>{slot}</span>)}</div><a className="btn btn-block" href={`https://wa.me/${space.wpp}?text=Hola%2C%20te%20escribo%20desde%20Ensaya%20para%20consultar%20disponibilidad.`} target="_blank" rel="noreferrer">Consultar disponibilidad</a></aside></div>; }
function AdminView({
  spaces,
  pendingSpaces,
  onPublish,
  onApprove,
  onReject,
}: {
  spaces: Space[];
  pendingSpaces: PendingRequest[];
  onPublish: () => void;
  onApprove: (request: PendingRequest) => void;
  onReject: (request: PendingRequest) => void;
}) {
  return <section className="admin-wrap"><div className="admin-hero"><div className="inner-label">Ensaya · Gestión</div><h2>Panel de gestión mensual</h2><p>Revisá los espacios activos e incorporá nuevas salas al listado.</p></div><div className="admin-grid"><div className="admin-panel"><h3>Espacios activos</h3><p className="hint">Los que ya están publicados en el buscador.</p>{spaces.map((space) => <div className="space-list-item" key={space.id}><span>{space.name} · {space.barrio}</span><span>{space.tipo}</span></div>)}<button className="btn btn-add" onClick={onPublish}>Sumar espacio al listado</button></div><div className="admin-panel"><h3>Solicitudes pendientes</h3><p className="hint">Revisión previa antes de publicar.</p>{pendingSpaces.length ? pendingSpaces.map((request) => <div className="space-list-item space-list-item--stacked" key={request.id}><div><strong>{request.nombre_espacio}</strong><span>{request.barrio ?? "Sin barrio"}</span></div><div className="approval-actions"><button className="mini-btn mini-btn--approve" onClick={() => onApprove(request)}>Aprobar</button><button className="mini-btn mini-btn--reject" onClick={() => onReject(request)}>Rechazar</button></div></div>) : <p className="hint">No hay solicitudes pendientes por revisar.</p>}<Link className="btn-outline" href="/ensaya/salas">Ver listado público</Link></div></div></section>; }
