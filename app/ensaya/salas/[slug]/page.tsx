import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function SalaDetail({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const { data: sala } = await supabase.from("salas").select("*").eq("id", slug).maybeSingle();
	return <main className="page"><div className="inner"><div className="inner-label">App Ensaya · Sala</div><h1>{sala?.nombre ?? "Sala de ensayo"}</h1><div className="divider" /><p>{sala ? `${sala.zona} · $${sala.precio_hora}/hora` : "No encontramos esta sala."}</p><Link className="btn-outline" href="/ensaya/salas">Volver a las salas</Link></div></main>;
}
