import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function SalaDetail({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const { data: sala } = await supabase.from("salas").select("*").eq("id", slug).maybeSingle();
	const imageUrl = sala?.imagen_url || sala?.foto_url || sala?.image_url;

	if (!sala) {
		return (
			<main className="page">
				<div className="inner">
					<div className="inner-label">App Ensaya · Sala</div>
					<h1>No encontramos esta sala</h1>
					<div className="divider" />
					<p>La sala solicitada no existe o ya no está disponible.</p>
					<Link className="btn-outline" href="/ensaya/salas">Volver a las salas</Link>
				</div>
			</main>
		);
	}

	return (
		<main className="page">
			<div className="inner">
				<div className="inner-label">App Ensaya · Sala</div>
				<div className="sala-detail-hero">
					{imageUrl && <img src={imageUrl} alt={sala.nombre} className="sala-detail-image" />}
					<div className="sala-detail-copy">
						<h1>{sala.nombre}</h1>
						<div className="divider" />
						<p>{`${sala.zona} · $${sala.precio_hora}/hora`}</p>
						<Link className="btn-outline" href="/ensaya/salas">Volver a las salas</Link>
					</div>
				</div>
			</div>
		</main>
	);
}
