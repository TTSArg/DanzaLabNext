import Link from "next/link";
import Image from "next/image";
import { PageIntro, WhatsAppIcon } from "../components/site";
import { textosActividad } from "../../lib/agenda";

export default function LaboratoriosPage() {
	return (
		<main className="page">
			<div className="inner">
				<PageIntro
					label="Formación"
					title="Laboratorios"
					description="Facilitamos espacios donde investigar y/o explorar el Tango Danza"
				/>

				<div className="lab-catalogue">
					<section className="lab-column" aria-labelledby="lab-column-atto">
						<header className="lab-column-heading">
							<h2 id="lab-column-atto">Quiero explorar con Atto</h2>
							<p>Si ya conocés el enfoque y los métodos de abordaje, o te los han presentado, podés profundizar con Atto en la búsqueda de la improvisación.</p>
						</header>

						<div className="lab-column-list">
							<article className="card lab-card">
								<Image className="lab-card-cover" src="/laboratorios/1-entrenamiento.jpeg" alt="Entrenamiento" width={768} height={1151} sizes="(max-width: 900px) calc(100vw - 4rem), 33vw" quality={90} />
								<div className="lab-tag">Agendable · Laboratorio guiado</div>
								<h3>Entrenamiento</h3>
								<p>Profundizamos en el entrenamiento según las cualidades de cada alumnx, con el objetivo de ampliar los recursos disponibles para la improvisación.</p>
							</article>

							<article className="card lab-card">
								<Image className="lab-card-cover" src="/laboratorios/2-practicando-lo-aprendido.jpeg" alt="Practicando lo aprendido" width={768} height={1046} sizes="(max-width: 900px) calc(100vw - 4rem), 33vw" quality={90} />
								<div className="lab-tag">Agendable · Apropiación</div>
								<h3>Practicando lo aprendido</h3>
								<p>Entrenamos lo que ya aprendiste en otro espacio. Tomamos tiempo para examinar detalles y alternativas con las que puedas apropiarte del conocimiento recibido.</p>
							</article>

							<article className="card lab-card" id="ternura">
								<Image className="lab-card-cover" src="/laboratorios/3-ternura.jpeg" alt="Ternura" width={768} height={1024} sizes="(max-width: 900px) calc(100vw - 4rem), 33vw" quality={90} />
								<div className="lab-tag">Intensivo · Exploración del contacto</div>
								<h3>Ternura</h3>
								<p>{textosActividad.ternuraYContacto}</p>
							</article>
						</div>
						<a
							className="lab-agenda-link"
							href="https://wa.me/5491122430943?text=Hola%2C%20quiero%20agendar%20una%20exploraci%C3%B3n%20con%20Atto."
							target="_blank"
							rel="noreferrer"
						>
							<WhatsAppIcon className="lab-whatsapp-icon" />
							Quiero agendar
						</a>
					</section>

					<section className="lab-column" aria-labelledby="lab-column-chiara-atto">
						<header className="lab-column-heading">
							<h2 id="lab-column-chiara-atto">Quiero explorar con Chiara &amp; Atto</h2>
							<p>Una combinación complementaria donde ponemos la técnica al servicio de la exploración y de la búsqueda de lo genuino. Cuando la técnica se funde con el cuerpo, nace la danza.</p>
							<p className="lab-teachers">
								Docentes:{" "}
								<a href="https://instagram.com/chiaradelatierra" target="_blank" rel="noreferrer">@chiaradelatierra</a>{" "}
								y{" "}
								<a href="https://instagram.com/atto_numpaque" target="_blank" rel="noreferrer">@atto_numpaque</a>
							</p>
						</header>

						<div className="lab-column-list">
							<article className="card lab-card">
								<Image className="lab-card-cover" src="/laboratorios/4-tango-tecnica-poesia-individual.jpg" alt="Chiara y Atto en un abrazo de tango" width={768} height={960} sizes="(max-width: 900px) calc(100vw - 4rem), 33vw" quality={90} />
								<div className="lab-tag">Agendable · Individual o parejas</div>
								<h3>Tango: de la técnica a la poesía</h3>
								<p>
									<a href="https://instagram.com/chiaradelatierra" target="_blank" rel="noreferrer">@chiaradelatierra</a> ofrece un recorrido a través del estudio postural, la mecánica del movimiento y la gramática del tango: los pasos y las secuencias reconocidos dentro de su lenguaje.
								</p>
								<p>
									<a href="https://instagram.com/atto_numpaque" target="_blank" rel="noreferrer">@atto_numpaque</a> acompaña el proceso desde la integración de texturas, tonos y las distintas maneras en que la técnica permite cocrear la danza.
								</p>
							</article>

							<article className="card lab-card">
								<Image className="lab-card-cover" src="/laboratorios/6-tango-tecnica-poesia-grupal.jpeg" alt="Chiara y Atto bailando tango" width={768} height={768} sizes="(max-width: 900px) calc(100vw - 4rem), 33vw" quality={90} />
								<div className="lab-tag">Agendable · Grupal</div>
								<h3>Tango: de la técnica a la poesía</h3>
								<p>La dinámica grupal abre alternativas espaciales que desafían a quienes están en la pista. La técnica y la poesía del movimiento se adaptan, se desvían y se transforman según el espacio disponible y los códigos milongueros.</p>
							</article>
						</div>
						<a
							className="lab-agenda-link"
							href="https://wa.me/5491122430943?text=Hola%2C%20quiero%20agendar%20una%20exploraci%C3%B3n%20con%20Chiara%20y%20Atto."
							target="_blank"
							rel="noreferrer"
						>
							<WhatsAppIcon className="lab-whatsapp-icon" />
							Quiero agendar
						</a>
					</section>

					<section className="lab-column" aria-labelledby="lab-column-dinzel">
						<header className="lab-column-heading">
							<h2 id="lab-column-dinzel">Quiero explorar el método Dinzel de la improvisación</h2>
							<p>
								Esta propuesta reúne el legado teórico de los maestros Rodolfo y Gloria Dinzel,
								fundadores de{" "}
								<a href="https://instagram.com/estudiodinzel.arg" target="_blank" rel="noreferrer">@estudiodinzel.arg</a>{" "}
								y participantes de la fundación de la Universidad del Tango, actual{" "}
								<a href="https://cetba.info/" target="_blank" rel="noreferrer">CETBA (Centro Educativo del Tango de Buenos Aires)</a>.
								{" "}Ese legado se complementa con el desarrollo teórico, práctico y artístico desarrollado por Eric Dinzel y Flavia Kohut{" "}
								<a href="https://instagram.com/ericdinzel.flaviakohut.tango" target="_blank" rel="noreferrer">@ericdinzel.flaviakohut.tango</a>,
								{" "}quienes continúan ampliando el método a través de la técnica, la formación y la puesta en escena del tango en distintos escenarios del mundo.
							</p>
						</header>

						<div className="lab-column-list">
							<article className="card lab-card">
								<Image className="lab-card-cover" src="/laboratorios/7-medite-tango.jpeg" alt="MeDiTe Tango con Adriana y Atto" width={768} height={960} sizes="(max-width: 900px) calc(100vw - 4rem), 33vw" quality={90} />
								<div className="lab-tag">Semanal · Grupo abierto</div>
								<h3>MeDiTe Tango</h3>
								<p>Mecánicas, dinámicas y técnicas para ampliar el disfrute del baile a través de la improvisación.</p>
								<p className="lab-teachers">
									Docentes:{" "}
									<a href="https://instagram.com/adrianabamazzotta" target="_blank" rel="noreferrer">@adrianabamazzotta</a>{" "}
									y{" "}
									<a href="https://instagram.com/atto_numpaque" target="_blank" rel="noreferrer">@atto_numpaque</a>
								</p>
								<p className="lab-schedule">
									Sábados 18 hs en{" "}
									<a href="https://instagram.com/estudiodinzel.arg" target="_blank" rel="noreferrer">@estudiodinzel.arg</a>
								</p>
							</article>

							<article className="card lab-card">
								<Image className="lab-card-cover" src="/laboratorios/8-entrenamiento-improvisacion.png" alt="Adriana y Atto en Entrenamiento para la improvisación" width={768} height={768} sizes="(max-width: 900px) calc(100vw - 4rem), 33vw" quality={90} />
								<div className="lab-tag">Intensivo · Entrenamiento</div>
								<h3>Entrenamiento para la improvisación</h3>
								<p>Investigamos la raíz del movimiento y transitamos desde el impulso individual hacia un diálogo creativo con el otro.</p>
								<p className="lab-teachers">
									Docentes:{" "}
									<a href="https://instagram.com/adrianabamazzotta" target="_blank" rel="noreferrer">@adrianabamazzotta</a>{" "}
									y{" "}
									<a href="https://instagram.com/atto_numpaque" target="_blank" rel="noreferrer">@atto_numpaque</a>
								</p>
							</article>

							<article className="card lab-card">
								<Image className="lab-card-cover" src="/laboratorios/9-transmitir-metodo-dinzel.jpeg" alt="Laboratorio de herramientas pedagógicas del método Dinzel" width={768} height={768} sizes="(max-width: 900px) calc(100vw - 4rem), 33vw" quality={90} />
								<div className="lab-tag">Agendable · Herramientas pedagógicas</div>
								<h3>Transmitir el método Dinzel</h3>
								<p>Laboratorios para explorar herramientas que permitan transmitir el método de la improvisación desde la perspectiva pedagógica de los Dinzel.</p>
							</article>

							<article className="card lab-card">
								<Image className="lab-card-cover" src="/laboratorios/10-la-improvisacion-dinzel.jpeg" alt="Libro La Improvisación, de Gloria y Rodolfo Dinzel" width={768} height={768} sizes="(max-width: 900px) calc(100vw - 4rem), 33vw" quality={90} />
								<div className="lab-tag">Agendable · Teoría</div>
								<h3>La improvisación</h3>
								<p>Encuentros para profundizar en la interpretación y la aplicación al movimiento de las publicaciones de Rodolfo y Gloria Dinzel.</p>
								<ul className="lab-publications">
									<li><em>La Improvisación - El Tango, una Danza</em>, partes I y II, 2da Edición, 2022</li>
									<li><em>Esa ansiosa búsqueda de la Libertad</em>, edición conmemorativa 30 años</li>
								</ul>
								<p className="lab-contact">
									Para adquirir el material escribinos a:
									{" "}<a href="mailto:grupodinzel@gmail.com">grupodinzel@gmail.com</a>
									{" "}o{" "}
									<a href="https://instagram.com/estudiodinzel.arg" target="_blank" rel="noreferrer">@estudiodinzel.arg</a>
								</p>
							</article>
						</div>
						<a
							className="lab-agenda-link"
							href="https://wa.me/5491122430943?text=Hola%2C%20quiero%20agendar%20una%20exploraci%C3%B3n%20del%20m%C3%A9todo%20Dinzel."
							target="_blank"
							rel="noreferrer"
						>
							<WhatsAppIcon className="lab-whatsapp-icon" />
							Quiero agendar
						</a>
					</section>
				</div>

				<p className="composition-note"><em>Explora otras propuestas en &quot;Composición escénica&quot;</em> <Link href="/composicion-escenica" aria-label="Ir a Composición escénica">→</Link></p>
				<div className="button-row"><Link className="btn-outline" href="/novedades">Ver próximas fechas</Link></div>
			</div>
		</main>
	);
}
