"use client";

import { useEffect, useState } from "react";
import { agenda } from "../../lib/agenda";

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getUpcomingLabDates(today: Date) {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(`${agenda.laboratorioSemanal.hasta}T00:00:00`);
  const excludedDates = new Set<string>([
    ...agenda.laboratorioSemanal.fechasSinLaboratorio,
    ...agenda.laboratorioSemanal.fechasAConfirmar,
  ]);
  const dates: Date[] = [];

  for (const date = start; date <= end && dates.length < 4; date.setDate(date.getDate() + 1)) {
    const key = localDateKey(date);
    if (date.getDay() === 6 && key >= agenda.laboratorioSemanal.desde && !excludedDates.has(key)) {
      dates.push(new Date(date));
    }
  }

  return dates;
}

export function ImproFechas() {
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setToday(new Date()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!today) return <p className="lab-dates">Próximas fechas: sábados 18 hs.</p>;

  const dates = getUpcomingLabDates(today);
  const labels = dates.map((date) =>
    new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long" }).format(date),
  );

  return (
    <p className="lab-dates">
      {labels.length ? `Próximas fechas: ${labels.join(" · ")} · 18 hs.` : "El ciclo de este período ya finalizó."}
    </p>
  );
}
