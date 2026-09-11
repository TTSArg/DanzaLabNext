import Link from "next/link";
import { PageIntro } from "../components/site";

const labs = [
	["Grupal · El Motor", "Entrenamiento para la Improvisación", "Investigación sobre la raíz del movimiento. Del impulso individual al diálogo creativo con el otro."],
	["Grupal · La Pregunta", "Mecánicas y Dinámicas", "Transformamos barreras y curiosidades en caminos de exploración corporal. Aquí no se enseñan pasos, se descubren maneras."],
	["Seminario Intensivo · 3 a 5 horas", "Ternura y Contacto", "Autorreconocimiento a través de la polaridad y lo sensoperceptivo. El poder del contacto profundo en el tango improvisado."],
	["Individual · Escucha Total", "Proceso Individual de Danza", "Palabra, observación, contacto y silencio para transitar desde lo sensoperceptivo hasta la técnica del baile."],
	["Individual · Cinética Pura", "Sesión de Danza Compartida", "Una hora de entrenamiento en red donde la comunicación es exclusivamente cinética."],
	["Formación · Pedagogía", "Acompañamiento Pedagógico", "Para quienes desean transmitir la danza con coherencia entre mensaje, concepto y ejercicio."],
];

export default function LaboratoriosPage() { return <main className="page"><div className="inner"><PageIntro label="Formación" title="Laboratorios" description="No impartimos lecciones, facilitamos laboratorios de investigación. El tango es el lenguaje en que se manifiesta la red, no el fin en sí mismo." /><div className="grid">{labs.map(([tag, title, text]) => <article className="card" key={title}><div className="lab-tag">{tag}</div><h3>{title}</h3><p>{text}</p></article>)}</div><div className="button-row"><a className="btn" href="https://wa.me/54000000000">Consultar por un laboratorio</a><Link className="btn-outline" href="/novedades">Ver próximas fechas</Link></div></div></main>; }
