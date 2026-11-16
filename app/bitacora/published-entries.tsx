"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import BitacoraEntryCard from "./entry-card";
import { BITACORA_POST_FIELDS, bitacoraPostToEntry } from "./post-utils";
import type { BitacoraEntry } from "./entries";

export default function BitacoraPublishedEntries() {
	const [entries, setEntries] = useState<BitacoraEntry[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		let isActive = true;

		async function loadPublishedEntries() {
			const { data, error } = await supabase
				.from("bitacora_posts")
				.select(BITACORA_POST_FIELDS)
				.eq("status", "published")
				.order("published_at", { ascending: false });

			if (!isActive) return;
			if (error) {
				if (error.code === "PGRST205") {
					console.info("Bitacora posts table is not configured; showing the published static entries.");
				} else {
					console.error("Bitacora published entries loading error:", error);
					setHasError(true);
				}
			} else {
				setEntries((data ?? []).map(bitacoraPostToEntry));
			}
			setIsLoading(false);
		}

		void loadPublishedEntries();
		return () => {
			isActive = false;
		};
	}, []);

	return (
		<>
			{isLoading && <p className="bitacora-published-status" role="status">Cargando publicaciones...</p>}
			{hasError && (
				<p className="bitacora-published-status" role="alert">
					No se pudieron cargar las publicaciones nuevas.
				</p>
			)}
			{entries.map((entry) => <BitacoraEntryCard key={entry.slug} entry={entry} />)}
		</>
	);
}
