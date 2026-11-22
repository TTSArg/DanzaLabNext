"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";

type BitacoraComment = {
	id: string;
	name: string;
	body: string;
	created_at: string;
};

export default function BitacoraComments({ slug }: { slug: string }) {
	const [comments, setComments] = useState<BitacoraComment[]>([]);
	const [name, setName] = useState("");
	const [body, setBody] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		let isActive = true;

		async function loadComments() {
			const { data, error } = await supabase
				.from("bitacora_comments")
				.select("id, name, body, created_at")
				.eq("slug", slug)
				.order("created_at", { ascending: false });

			if (!isActive) return;
			if (error) {
				console.error("Bitacora comment loading error:", error);
			} else {
				setComments(data ?? []);
			}
			setIsLoading(false);
		}

		void loadComments();
		return () => {
			isActive = false;
		};
	}, [slug]);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const cleanName = name.trim();
		const cleanBody = body.trim();

		if (!cleanName || cleanName.length > 80 || !cleanBody || cleanBody.length > 2000) {
			setMessage("Escribe tu nombre (hasta 80 caracteres) y un comentario (hasta 2000 caracteres).");
			return;
		}

		setIsSubmitting(true);
		setMessage("");
		const { data, error } = await supabase
			.from("bitacora_comments")
			.insert({ slug, name: cleanName, body: cleanBody })
			.select("id, name, body, created_at")
			.single();

		if (error) {
			console.error("Bitacora comment submission error:", error);
			setMessage("No se pudo publicar el comentario. Intenta de nuevo más tarde.");
		} else {
			setComments((current) => [data, ...current]);
			setName("");
			setBody("");
			setMessage("Tu comentario se publicó correctamente.");
		}
		setIsSubmitting(false);
	}

	return (
		<div className="bitacora-comments__content">
			<form className="bitacora-comments__form" onSubmit={handleSubmit}>
				<label>
					Tu nombre
					<input
						type="text"
						name="name"
						value={name}
						onChange={(event) => setName(event.target.value)}
						maxLength={80}
						autoComplete="name"
						required
					/>
				</label>
				<label>
					Tu comentario
					<textarea
						name="body"
						value={body}
						onChange={(event) => setBody(event.target.value)}
						maxLength={2000}
						rows={4}
						required
					/>
				</label>
				<button className="btn-submit" type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Publicando..." : "Publicar comentario"}
				</button>
				<p className="bitacora-comments__message" role="status" aria-live="polite">
					{message}
				</p>
			</form>
			<section className="bitacora-comments__list" aria-label="Comentarios publicados">
				{isLoading ? (
					<p>Cargando comentarios...</p>
				) : comments.length === 0 ? (
					null
				) : (
					comments.map((comment) => (
						<article className="bitacora-comment" key={comment.id}>
							<div>
								<strong>{comment.name}</strong>
								<time dateTime={comment.created_at}>
									{new Intl.DateTimeFormat("es-AR", {
										dateStyle: "medium",
										timeStyle: "short",
									}).format(new Date(comment.created_at))}
								</time>
							</div>
							<p>{comment.body}</p>
						</article>
					))
				)}
			</section>
		</div>
	);
}
