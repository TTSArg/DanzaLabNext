import Link from "next/link";
import BitacoraEntryDisclosure from "./entry-disclosure";
import BitacoraParagraph from "./entry-paragraph";
import type { BitacoraEntry } from "./entries";

export default function BitacoraEntryCard({ entry }: { entry: BitacoraEntry }) {
	return (
		<article className="card bitacora-entry">
			<div className="bit-tag">{entry.category}</div>
			<h3>
				<Link href={`/bitacora/${entry.slug}`}>{entry.title}</Link>
			</h3>
			<BitacoraParagraph
				className="bitacora-entry__excerpt"
				text={entry.intro}
			/>
			<BitacoraEntryDisclosure entry={entry} />
		</article>
	);
}
