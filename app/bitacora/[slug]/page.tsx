import Link from "next/link";
import BitacoraEntryContent from "../entry-content";
import { bitacoraEntries } from "../entries";
import { supabase } from "../../../lib/supabase";
import { BITACORA_POST_FIELDS, bitacoraPostToEntry } from "../post-utils";

export default async function BitacoraDetail({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	let entry = bitacoraEntries.find((item) => item.slug === slug);
	let hasLoadError = false;

	if (!entry) {
		const { data, error } = await supabase
			.from("bitacora_posts")
			.select(BITACORA_POST_FIELDS)
			.eq("slug", slug)
			.eq("status", "published")
			.maybeSingle();

		if (error) {
			console.error("Bitacora entry loading error:", error);
			hasLoadError = true;
		} else if (data) {
			entry = bitacoraPostToEntry(data);
		}
	}

	if (hasLoadError) {
		return (
			<main className="page">
				<div className="inner">
					<div className="inner-label">Bitácora · Error</div>
					<h1>No pudimos cargar esta entrada</h1>
					<p>Intenta de nuevo más tarde.</p>
					<Link className="btn-outline" href="/bitacora">Volver a la bitácora</Link>
				</div>
			</main>
		);
	}

	if (!entry) {
		return (
			<main className="page">
				<div className="inner">
					<div className="inner-label">Bitácora · Sin publicación</div>
					<h1>Entrada no encontrada</h1>
					<div className="divider" />
					<p>Esta entrada todavía no está publicada.</p>
					<Link className="btn-outline" href="/bitacora">Volver a la bitácora</Link>
				</div>
			</main>
		);
	}

	return (
		<main className="page">
			<div className="inner">
				<div className="inner-label">Bitácora · {entry.category}</div>
				<h1 className="bitacora-detail-title">{entry.title}</h1>
				<div className="divider" />
				<BitacoraEntryContent entry={entry} />
				<div className="button-row">
					<Link className="btn-outline" href="/bitacora">Volver a la bitácora</Link>
				</div>
			</div>
		</main>
	);
}
