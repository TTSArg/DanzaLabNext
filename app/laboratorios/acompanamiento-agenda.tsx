"use client";

import { useEffect, useState } from "react";
import {
  DURACION_TURNO_MINUTOS,
  WHATSAPP_NUMBER,
  agenda,
  turnosOcupados,
} from "../../lib/agenda";

const validWhatsAppNumber = /^\d{8,15}$/.test(WHATSAPP_NUMBER);

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDay(date: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

function addMinutes(time: string, minutes: number) {
  const [hours, remainder] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + remainder + minutes;
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
}

function getUpcomingDays(today: Date) {
  return Array.from({ length: 14 }, (_, offset) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
    return { date, key: localDateKey(date) };
  });
}

function getTurnTimes() {
  const times: string[] = [];
  const startMinutes = Number(agenda.acompanamientoIndividual.desde.slice(0, 2)) * 60;
  const endMinutes = Number(agenda.acompanamientoIndividual.hasta.slice(0, 2)) * 60;

  for (let minutes = startMinutes; minutes + DURACION_TURNO_MINUTOS <= endMinutes; minutes += DURACION_TURNO_MINUTOS) {
    times.push(`${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`);
  }

  return times;
}

function buildWhatsAppHref(message: string) {
  if (!validWhatsAppNumber) return undefined;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function AcompanamientoAgenda() {
  const [now, setNow] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setNow(new Date()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const days = now ? getUpcomingDays(now) : [];
  const times = getTurnTimes();
  const minimumLeadMs = agenda.acompanamientoIndividual.anticipacionMinimaHoras * 60 * 60 * 1000;
  const selectedMessage = selectedSlot
    ? `Hola Danza Lab, quisiera consultar por un turno de acompañamiento individual el ${selectedSlot.date} a las ${selectedSlot.time}.`
    : "Hola Danza Lab, quisiera consultar por otro día u horario para acompañamiento individual.";
  const selectedHref = buildWhatsAppHref(selectedMessage);
  const otherTimeHref = buildWhatsAppHref(selectedMessage.replace(/quisiera consultar por un turno.*\./, "quisiera consultar por otro día u horario para acompañamiento individual."));

  return (
    <div className="appointment-schedule">
      <div className="appointment-intro">
        <h4>Elegí tu horario</h4>
        <p>
          Turnos de lunes a viernes, de 18 a 21 hs. Se desarrollan en dos espacios de Villa Crespo,
          muy cerca del Subte B (estaciones Ángel Gallardo y Malabia). La dirección exacta se comparte
          al confirmar el turno. Podés agendar con hasta un día de anticipación. Si necesitás otro día
          u horario, escribime directamente.
        </p>
        <p className="appointment-duration-note">
          Los turnos se muestran cada {DURACION_TURNO_MINUTOS} minutos. <span>TODO: confirmar duración exacta.</span>
        </p>
      </div>

      {!now ? (
        <p className="schedule-loading" aria-live="polite">Preparando horarios disponibles...</p>
      ) : (
        <div className="appointment-days" aria-label="Turnos disponibles en los próximos 14 días">
          {days.map(({ date, key }) => {
            const weekday = date.getDay();
            const selectableDay = weekday >= 1 && weekday <= 5;

            return (
              <section className="appointment-day" key={key}>
                <h5>{formatDay(date)}</h5>
                {selectableDay ? (
                  <div className="appointment-slots">
                    {times.map((time) => {
                      const slotDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(time.slice(0, 2)), Number(time.slice(3, 5)));
                      const isTooSoon = slotDate.getTime() - now.getTime() < minimumLeadMs;
                      const isOccupied = turnosOcupados.some((slot) => slot.fecha === key && slot.hora === time);
                      const disabled = isTooSoon || isOccupied;
                      const isSelected = selectedSlot?.date === key && selectedSlot.time === time;

                      return (
                        <button
                          type="button"
                          className={`appointment-slot${isSelected ? " is-selected" : ""}`}
                          key={time}
                          disabled={disabled}
                          aria-pressed={isSelected}
                          title={isOccupied ? "Este turno ya está ocupado" : isTooSoon ? "Este turno requiere al menos 24 horas de anticipación" : undefined}
                          onClick={() => {
                            setSelectedSlot({ date: key, time });
                            const href = buildWhatsAppHref(`Hola Danza Lab, quisiera consultar por un turno de acompañamiento individual el ${key} a las ${time}.`);
                            if (href) window.open(href, "_blank", "noopener,noreferrer");
                          }}
                        >
                          {time}–{addMinutes(time, DURACION_TURNO_MINUTOS)}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="appointment-unavailable">No hay turnos estos días.</p>
                )}
              </section>
            );
          })}
        </div>
      )}

      <div className="appointment-actions">
        <a
          className={`btn${selectedHref ? "" : " is-disabled"}`}
          href={selectedHref}
          target={selectedHref ? "_blank" : undefined}
          rel={selectedHref ? "noreferrer" : undefined}
          aria-disabled={!selectedHref}
          onClick={(event) => { if (!selectedHref) event.preventDefault(); }}
        >
          {selectedSlot ? `Consultar turno del ${selectedSlot.date} a las ${selectedSlot.time}` : "Elegí un turno para consultar"}
        </a>
        {!validWhatsAppNumber && <p className="schedule-todo">TODO: completar el número de WhatsApp para habilitar las consultas y reservas.</p>}
        <a
          className={`btn-outline${otherTimeHref ? "" : " is-disabled"}`}
          href={otherTimeHref}
          target={otherTimeHref ? "_blank" : undefined}
          rel={otherTimeHref ? "noreferrer" : undefined}
          aria-disabled={!otherTimeHref}
          onClick={(event) => { if (!otherTimeHref) event.preventDefault(); }}
        >
          Escribir por WhatsApp para otro día u horario
        </a>
      </div>
      <p className="schedule-disclaimer">La agenda no bloquea turnos automáticamente; la disponibilidad se confirma al coordinar.</p>
    </div>
  );
}
