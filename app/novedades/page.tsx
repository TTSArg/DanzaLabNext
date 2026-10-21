import { PageIntro } from "../components/site";
import { TableroNovedades } from "./tablero-novedades";

export default function NovedadesPage() {
	return (
		<main className="page">
			<div className="inner">
				<PageIntro
					label="Agenda · Eventos · Obras"
					title="Novedades"
					description="Laboratorios abiertos, obras en escena, seminarios y todo lo que Danza Lab está poniendo en movimiento."
				/>
				<p className="news-subtitle">Lo que viene, en un solo lugar.</p>
				<TableroNovedades />
			</div>
		</main>
	);
}
