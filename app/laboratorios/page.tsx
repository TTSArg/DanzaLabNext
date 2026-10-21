import Link from "next/link";
import { AcompanamientoAgenda } from "./acompanamiento-agenda";
import { ImproFechas } from "./impro-fechas";
import { PageIntro } from "../components/site";
import { WHATSAPP_NUMBER, agenda, textosActividad } from "../../lib/agenda";

function formatAgendaDate(value: string) {
	const [year, month, day] = value.split("-").map(Number);
	return new Intl.DateTimeFormat("es-AR", {
		weekday: "long",
		day: "numeric",
		month: "long",
	}).format(new Date(year, month - 1, day));
}

const validWhatsAppNumber = /^\d{8,15}$/.test(WHATSAPP_NUMBER);

export default function LaboratoriosPage() {
	return (
		<main className="page">
			<div className="inner">
				<PageIntro
					label="Formación"
					title="Laboratorios"
					description="No impartimos lecciones, facilitamos laboratorios de investigación. El tango es el lenguaje en que se manifiesta la red, no el fin en sí mismo."
				/>

				<section className="lab-group" aria-labelledby="lab-group-a">
					<div className="lab-group-heading"><span>Catálogo A</span><h3 id="lab-group-a">Laboratorio Colectivo</h3><div className="divider" /></div>
					<div className="grid">
						<article className="card lab-card lab-card-featured">
							<div className="lab-tag">LABORATORIOS DE</div>
							<h3>IMPRO MILONGUERA</h3>
							<p className="lab-slogan">Entrá a la pista y descubrí lo que todavía no bailaste.</p>
							<p className="lab-schedule">Sábados 18hs · Estudio Dinzel</p>
							<p>{textosActividad.improMilonguera}</p>
							<ImproFechas />
						</article>
						<article className="card lab-card">
							<div className="lab-tag">Grupal · El Motor</div>
							<h3>Entrenamiento para la Improvisación</h3>
							<p>Investigación sobre la raíz del movimiento. Del impulso individual al diálogo creativo con el otro.</p>
						</article>
						<article className="card lab-card">
							<div className="lab-tag">Grupal · La Pregunta</div>
							<h3>Mecánicas y Dinámicas</h3>
							<p>Transformamos barreras y curiosidades en caminos de exploración corporal. Aquí no se enseñan pasos, se descubren maneras.</p>
						</article>
					</div>
				</section>

				<section className="lab-group" aria-labelledby="lab-group-b">
					<div className="lab-group-heading"><span>Catálogo B</span><h3 id="lab-group-b">Seminarios Intensivos</h3><div className="divider" /></div>
					<div className="grid">
						<article className="card lab-card" id="ternura-y-contacto">
							<div className="lab-tag">Intensivo · 3 horas · Viernes de noche</div>
							<h3>Ternura y Contacto</h3>
							<p>{textosActividad.ternuraYContacto}</p>
							<ul className="lab-date-list">
								{agenda.ternuraYContacto.map((activity) => (
									  <li key={activity.id}>{formatAgendaDate(activity.fecha)}</li>
								))}
							</ul>
							<button className="btn lab-signup-pending" type="button" disabled>
								Inscripción por WhatsApp pendiente
							</button>
							{!validWhatsAppNumber && <p className="schedule-todo">TODO: completar el número de WhatsApp antes de habilitar la inscripción.</p>}
							<p className="schedule-todo">TODO: definir el horario de los viernes.</p>
						</article>
					</div>
				</section>

				<section className="lab-group" id="acompanamiento-individual" aria-labelledby="lab-group-c">
					<div className="lab-group-heading"><span>Catálogo C</span><h3 id="lab-group-c">Acompañamiento Individual</h3><div className="divider" /></div>
					<div className="grid">
						<article className="card lab-card">
							<div className="lab-tag">Individual · Escucha Total</div>
							<h3>Proceso Individual de Danza</h3>
							<p>Palabra, observación, contacto y silencio para transitar desde lo sensoperceptivo hasta la técnica del baile.</p>
						</article>
						<article className="card lab-card">
							<div className="lab-tag">Individual · Cinética Pura</div>
							<h3>Danza Compartida</h3>
							<p>Una hora de entrenamiento en red donde la comunicación es exclusivamente cinética.</p>
						</article>
					</div>
					<AcompanamientoAgenda />
				</section>

				<section className="lab-group" aria-labelledby="lab-group-d">
					<div className="lab-group-heading"><span>Catálogo D</span><h3 id="lab-group-d">Transmisión y Legado</h3><div className="divider" /></div>
					<div className="grid">
						<article className="card lab-card">
							<div className="lab-tag">Formación · Pedagogía</div>
							<h3>Acompañamiento Pedagógico</h3>
							<p>Para quienes desean transmitir la danza con coherencia entre mensaje, concepto y ejercicio.</p>
						</article>
						<article className="card lab-card">
							<div className="lab-tag">Formación · Lecturas</div>
							<h3>Lecturas de la Improvisación</h3>
						</article>
					</div>
				</section>

				<p className="composition-note"><em>Paisajes, el método de composición, tiene su propia pestaña</em> <Link href="/composicion-escenica">→</Link></p>
				<div className="button-row"><Link className="btn-outline" href="/novedades">Ver próximas fechas</Link></div>
			</div>
		</main>
	);
}
