export const agenda = {
  laboratorioSemanal: {
    id: "impro-milonguera",
    nombre: "Impro Milonguera",
    dia: "sábado",
    hora: "18:00",
    lugar: "Estudio Dinzel",
    desde: "2026-10-17",
    hasta: "2027-03-27",
    fechasSinLaboratorio: ["2026-12-26", "2027-01-02"],
    // TODO: Omitir estas fechas de la agenda pública hasta confirmar cómo se resuelve cada coincidencia.
    fechasAConfirmar: ["2026-11-28", "2027-01-30", "2027-03-20"],
    notaAConfirmar:
      "Coinciden con intensivos de Paisajes: el laboratorio se delega o el intensivo se da de 11 a 17 hs.",
  },
  paisajesIntensivos: [
    {
      id: "paisajes-nov",
      inicio: "2026-11-28",
      fin: "2026-11-29",
      cierre: "puesta en escena",
    },
    { id: "paisajes-ene", inicio: "2027-01-30", fin: "2027-01-31" },
    { id: "paisajes-mar", inicio: "2027-03-20", fin: "2027-03-21" },
  ],
  // TODO: Definir los horarios de los viernes sin asignar horas supuestas.
  ternuraYContacto: [
    { id: "ternura-ene", fecha: "2027-01-15", dia: "viernes", hora: "[A DEFINIR]", duracionHoras: 3 },
    { id: "ternura-feb", fecha: "2027-02-19", dia: "viernes", hora: "[A DEFINIR]", duracionHoras: 3 },
    { id: "ternura-mar", fecha: "2027-03-19", dia: "viernes", hora: "[A DEFINIR]", duracionHoras: 3 },
  ],
  acompanamientoIndividual: {
    dias: ["lunes", "martes", "miércoles", "jueves", "viernes"],
    desde: "18:00",
    hasta: "21:00",
    duracionTurnoMinutos: 60,
    anticipacionMinimaHoras: 24,
  },
} as const;

// TODO: Completar con el número internacional sin signo + antes de habilitar los enlaces de WhatsApp.
export const WHATSAPP_NUMBER = "[COMPLETAR]";

// TODO: Confirmar si las sesiones de acompañamiento duran 60 minutos.
export const DURACION_TURNO_MINUTOS = agenda.acompanamientoIndividual.duracionTurnoMinutos;

export const turnosOcupados: Array<{ fecha: string; hora: string }> = [];

export const textosActividad = {
  improMilonguera:
    "Un laboratorio abierto de improvisación pensado para la milonga: investigar cómo salir del repertorio, escuchar, y encontrar movimiento nuevo en cada baile.",
  paisajesNoviembre:
    "Paisajes vuelve en formato intensivo. Durante un fin de semana vamos a partir de un estímulo (una imagen, un recuerdo, una textura) y a atenderlo sin juicio hasta que empiece a pedir movimiento. Después, en el camino del hecho humano al hecho artístico, lo vamos a ir acotando: qué entra, qué queda afuera, cómo se enlaza. El resultado es un lenguaje propio que se comparte frente a otras personas que están haciendo la misma búsqueda. No hace falta experiencia previa.",
  ternuraYContacto:
    "Un encuentro de 3 horas centrado en la polaridad y lo sensoperceptivo. El foco está en el poder del contacto profundo en el tango improvisado, no en la terminología técnica.",
  fraseFlyerPaisajes:
    "Entrá a la escena con lo que tenés y encontrá cómo decirlo con el cuerpo.",
} as const;

export const novedadesDinamicas: Array<{
  id: string;
  inicio: string;
  fin: string;
  titulo: string;
  enfoque: string;
  flyer: string;
  destino: string;
  fraseFlyer?: string;
  detallesFlyer?: string;
  pendientesFlyer?: string[];
}> = [
  {
    ...agenda.paisajesIntensivos[0],
    titulo: "Paisajes — Intensivo, con puesta en escena",
    enfoque: textosActividad.paisajesNoviembre,
    flyer: "",
    fraseFlyer: textosActividad.fraseFlyerPaisajes,
    detallesFlyer: "Intensivo · 28 y 29 de noviembre · Abierto a todas las personas, con o sin recorrido en danza.",
    pendientesFlyer: ["horario", "lugar", "contacto"],
    destino: "/composicion-escenica",
  },
  ...agenda.ternuraYContacto.map((actividad) => ({
    ...actividad,
    inicio: actividad.fecha,
    fin: actividad.fecha,
    titulo: "Ternura y Contacto — viernes de noche",
    enfoque: textosActividad.ternuraYContacto,
    flyer: "",
    destino: "/laboratorios",
  })),
  ...agenda.paisajesIntensivos.slice(1).map((actividad) => ({
    ...actividad,
    titulo: "Paisajes — Intensivo",
    enfoque: "",
    flyer: "",
    destino: "/composicion-escenica",
  })),
];
