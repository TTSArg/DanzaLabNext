"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { novedadesDinamicas } from "../../lib/agenda";

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateRange(start: string, end: string) {
  const [startYear, startMonth, startDay] = start.split("-").map(Number);
  const [endYear, endMonth, endDay] = end.split("-").map(Number);
  const startDate = new Date(startYear, startMonth - 1, startDay);
  const endDate = new Date(endYear, endMonth - 1, endDay);
  const startLabel = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short" }).format(startDate).replace(".", "");

  if (start === end) {
    return new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(startDate);
  }

  const endLabel = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", year: "numeric" }).format(endDate).replace(".", "");
  return `${startLabel} y ${endLabel}`;
}

export function TableroNovedades() {
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setToday(localDateKey(new Date())), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const activities = [...novedadesDinamicas].sort((first, second) => first.inicio.localeCompare(second.inicio));
  const upcoming = today ? activities.filter((activity) => activity.fin >= today) : activities;
  const past = today ? activities.filter((activity) => activity.fin < today).sort((first, second) => second.inicio.localeCompare(first.inicio)) : [];

  return (
    <div className="news-board">
      <section className="news-section" aria-labelledby="news-upcoming">
        <div className="news-section-heading">
          <div className="inner-label">Agenda</div>
          <h3 id="news-upcoming">Próximamente</h3>
          <div className="divider" />
        </div>
        <div className="grid news-grid">
          <Link className="card news-card news-card-link" href="/laboratorios">
            <div className="nov-type">Laboratorio · Sábados 18 hs</div>
            <h4>Impro Milonguera</h4>
            <p>Estudio Dinzel · Sábados de octubre a marzo</p>
            <p>Un laboratorio abierto de improvisación pensado para la milonga: investigar cómo salir del repertorio, escuchar, y encontrar movimiento nuevo en cada baile.</p>
          </Link>
          <Link className="card news-card news-card-link" href="/laboratorios#acompanamiento-individual">
            <div className="nov-type">Acompañamiento individual</div>
            <h4>Turnos de lunes a viernes · 18 a 21 hs</h4>
            <p>Espacios en Villa Crespo, cerca del Subte B. La coordinación y confirmación se realizan de manera directa.</p>
          </Link>
          <Link className="card news-card news-card-link" href="/ensaya">
            <div className="nov-type">App Ensaya</div>
            <h4>¿Buscás dónde ensayar?</h4>
            <p>Descubrí Ensaya →</p>
          </Link>
          {upcoming.map((activity) => (
            <Link className="card news-card news-card-link" href={activity.destino} key={activity.id}>
              <div className="nov-type">{activity.titulo}</div>
              {activity.flyer && <Image className="news-flyer" src={activity.flyer} alt={`Flyer de ${activity.titulo}`} width={960} height={960} />}
              <h4>{activity.titulo}</h4>
              <p className="news-date">{formatDateRange(activity.inicio, activity.fin)}</p>
              {activity.enfoque && <p>{activity.enfoque}</p>}
              {activity.fraseFlyer && <blockquote>{activity.fraseFlyer}</blockquote>}
              {activity.detallesFlyer && <p className="news-flyer-details">{activity.detallesFlyer}</p>}
              {activity.pendientesFlyer && <p className="news-todo">TODO: completar {activity.pendientesFlyer.join(", ")} del intensivo.</p>}
            </Link>
          ))}
        </div>
      </section>

      <section className="news-section news-archive" aria-labelledby="news-past">
        <div className="news-section-heading">
          <div className="inner-label">Archivo</div>
          <h3 id="news-past">Ya pasó</h3>
          <div className="divider" />
        </div>
        {past.length ? (
          <div className="grid news-grid">
            {past.map((activity) => (
              <article className="card news-card news-card-past" key={activity.id}>
                <div className="nov-type">Ya pasó</div>
                <h4>{activity.titulo}</h4>
                <p className="news-date">{formatDateRange(activity.inicio, activity.fin)}</p>
                {activity.enfoque && <p>{activity.enfoque}</p>}
              </article>
            ))}
          </div>
        ) : (
          <p className="news-empty">Pronto vas a ver acá el archivo de lo que fue sucediendo.</p>
        )}
      </section>
    </div>
  );
}
