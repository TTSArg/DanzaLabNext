import Link from "next/link";
import { PageIntro } from "../components/site";
import BitacoraEntryCard from "./entry-card";
import { bitacoraEntries } from "./entries";
import BitacoraPublishedEntries from "./published-entries";

export default function BitacoraPage() {
	return (
		<main className="page">
			<div className="inner">
				<PageIntro
					label="Reflexiones · Notas de clase"
					title="Bitácora"
					description="Pensamientos sobre la danza, el cuerpo, la improvisación y sus intersecciones con lo humano."
				/>
				<div className="bitacora-list">
					<BitacoraPublishedEntries />
					{bitacoraEntries.map((entry) => (
						<BitacoraEntryCard key={entry.slug} entry={entry} />
					))}
				</div>
				<div className="button-row">
					<Link className="btn-outline" href="/">
						Volver al inicio
					</Link>
				</div>
			</div>
		</main>
	);
}
