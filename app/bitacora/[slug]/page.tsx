import Link from "next/link";

export default async function BitacoraDetail({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	return <main className="page"><div className="inner"><div className="inner-label">Bitácora · Reflexión</div><h1>{slug.replaceAll("-", " ")}</h1><div className="divider" /><p>Esta entrada de la bitácora está en proceso de escritura.</p><Link className="btn-outline" href="/bitacora">Volver a la bitácora</Link></div></main>;
}
