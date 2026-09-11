import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function SalaDetail({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const { data: sala } = await supabase.from("salas").select("*").eq("id", slug).maybeSingle();
	const imageUrl = sala?.imagen_url || sala?.foto_url || sala?.image_url;

	const normalizeImageList = (value: unknown): string[] => {
		if (!value) return [];
		if (Array.isArray(value)) {
			return value
				.map((item) => (typeof item === "string" ? item.trim() : String(item ?? "").trim()))
				.filter(Boolean);
		}
		if (typeof value === "string") {
			const trimmed = value.trim();
			if (!trimmed) return [];
			try {
				const parsed = JSON.parse(trimmed);
				if (Array.isArray(parsed)) {
					return parsed
						.map((item) => (typeof item === "string" ? item.trim() : String(item ?? "").trim()))
						.filter(Boolean);
				}
			} catch {
				// no-op
			}
			return trimmed
				.split(",")
				.map((item) => item.trim())
				.filter(Boolean);
		}
		return [];
	};

	const additionalImages = normalizeImageList(sala?.fotos_adicionales);
	const galleryImages = [imageUrl, ...additionalImages].filter((item): item is string => Boolean(item && item.trim()));

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

				{galleryImages.length > 1 && (
					<div className="sala-gallery">
						<h2>Más fotos</h2>
						<div className="sala-gallery-grid">
							{galleryImages.slice(1).map((photoUrl, index) => (
								<img key={`${photoUrl}-${index}`} src={photoUrl} alt={`${sala.nombre} - foto ${index + 2}`} className="sala-gallery-image" />
							))}
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
