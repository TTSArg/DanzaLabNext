import Link from "next/link";
import type { BitacoraEntry } from "./entries";

export default function BitacoraEntryDisclosure({ entry }: { entry: BitacoraEntry }) {
	return (
		<Link className="bitacora-read-more" href={`/bitacora/${entry.slug}`}>
			Seguir leyendo
		</Link>
	);
}
