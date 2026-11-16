import type { BitacoraEntry, BitacoraMedia, BitacoraMediaList } from "./entries";

export const BITACORA_POST_FIELDS = "slug, category, title, body, caption, media";

export type BitacoraPostRecord = {
	slug: string;
	category: string;
	title: string;
	body: string;
	caption: string | null;
	media: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function normalizeMedia(value: unknown, caption: string | null): BitacoraMediaList {
	const items: BitacoraMedia[] = [];
	if (!Array.isArray(value)) return [];

	for (const item of value.slice(0, 3)) {
		if (!isRecord(item) || typeof item.src !== "string" || typeof item.alt !== "string") {
			continue;
		}

		if (item.type === "image" || item.type === "video") {
			items.push({
				type: item.type,
				src: item.src,
				alt: item.alt,
				caption: caption?.trim() || undefined,
			});
		}
	}

	const [first, second, third] = items;
	if (first && second && third) return [first, second, third];
	if (first && second) return [first, second];
	if (first) return [first];
	return [];
}

export function bitacoraPostToEntry(post: BitacoraPostRecord): BitacoraEntry {
	const paragraphs = post.body.split(/\r?\n\s*\r?\n/).map((text) => text.trim()).filter(Boolean);
	const intro = paragraphs.shift() ?? post.body.trim();

	return {
		slug: post.slug,
		category: post.category,
		title: post.title,
		intro,
		content: paragraphs.map((text) => ({ type: "paragraph", text })),
		media: normalizeMedia(post.media, post.caption),
	};
}
