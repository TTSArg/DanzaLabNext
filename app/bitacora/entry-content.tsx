import BitacoraComments from "./comments";
import BitacoraMediaCarousel from "./media-carousel";
import BitacoraParagraph from "./entry-paragraph";
import type { BitacoraEntry } from "./entries";

export default function BitacoraEntryContent({
	entry,
	includeIntroduction = true,
}: {
	entry: BitacoraEntry;
	includeIntroduction?: boolean;
}) {
	return (
		<div className="bitacora-entry-content">
			<article className="bitacora-copy">
				{includeIntroduction && <BitacoraParagraph text={entry.intro} />}
				{entry.content.map((block, index) => {
					if (block.type === "heading") {
						return <h3 className="bitacora-copy__heading" key={index}>{block.text}</h3>;
					}

					if (block.type === "list") {
						return (
							<ul className="bitacora-copy__list" key={index}>
								{block.items.map((item) => (
									<li key={item}><BitacoraParagraph text={item} /></li>
								))}
							</ul>
						);
					}

					return (
						<BitacoraParagraph
							className={block.type === "signature" ? "bitacora-copy__signature" : undefined}
							key={index}
							text={block.text}
						/>
					);
				})}
			</article>
			<BitacoraMediaCarousel mediaItems={entry.media} title={entry.title} />
			<section className="bitacora-comments" aria-label="Comentarios de esta entrada">
				<h3 className="bitacora-comments__heading">
					Tu opinión abre puertas a seguir explorando, déjanos tu comentario
				</h3>
				<BitacoraComments slug={entry.slug} />
			</section>
		</div>
	);
}
