"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, SyntheticEvent } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const MEDIA_BUCKET = "bitacora-media";
const MAX_MEDIA_ITEMS = 3;
const MAX_MEDIA_SIZE = 50 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);

type BitacoraDraft = {
	id: string;
	slug: string;
	category: string;
	title: string;
	body: string;
	caption: string;
	created_at: string;
};

function createPostSlug(title: string) {
	const base = title
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "")
		.slice(0, 140)
		.replace(/-+$/g, "") || "entrada";
	return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}

function readVideoDuration(file: File): Promise<number> {
	return new Promise((resolve, reject) => {
		const objectUrl = URL.createObjectURL(file);
		const video = document.createElement("video");
		video.preload = "metadata";
		video.onloadedmetadata = () => {
			const duration = video.duration;
			URL.revokeObjectURL(objectUrl);
			resolve(duration);
		};
		video.onerror = () => {
			URL.revokeObjectURL(objectUrl);
			reject(new Error(`No se pudo leer el video ${file.name}.`));
		};
		video.src = objectUrl;
	});
}

function safeFileName(fileName: string) {
	return fileName
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-zA-Z0-9._-]+/g, "-")
		.slice(0, 100);
}

export default function BitacoraPostManager() {
	const [drafts, setDrafts] = useState<BitacoraDraft[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState("");
	const [actionMessage, setActionMessage] = useState("");
	const [isPublishing, setIsPublishing] = useState<string | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [category, setCategory] = useState("Reflexión");
	const [otherCategory, setOtherCategory] = useState("");
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [caption, setCaption] = useState("");
	const [files, setFiles] = useState<File[]>([]);
	const [formError, setFormError] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const dialogRef = useRef<HTMLDialogElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const loadDrafts = useCallback(async () => {
		setIsLoading(true);
		const { data, error } = await supabase
			.from("bitacora_posts")
			.select("id, slug, category, title, body, caption, created_at")
			.eq("status", "draft")
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Bitacora draft loading error:", error);
			setLoadError("No se pudieron cargar los borradores. Verifica que la migración de Bitácora esté aplicada.");
		} else {
			setDrafts(data ?? []);
			setLoadError("");
		}
		setIsLoading(false);
	}, []);

	useEffect(() => {
		void Promise.resolve().then(loadDrafts);
	}, [loadDrafts]);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (isFormOpen && dialog && !dialog.open) {
			dialog.showModal();
		} else if (!isFormOpen && dialog?.open) {
			dialog.close();
		}
	}, [isFormOpen]);

	function resetForm() {
		setCategory("Reflexión");
		setOtherCategory("");
		setTitle("");
		setBody("");
		setCaption("");
		setFiles([]);
		setFormError("");
		formRef.current?.reset();
	}

	function closeDialog() {
		if (!isSaving) setIsFormOpen(false);
	}

	function handleDialogClick(event: SyntheticEvent<HTMLDialogElement>) {
		if (event.target === event.currentTarget) closeDialog();
	}

	function handleDialogCancel(event: SyntheticEvent<HTMLDialogElement>) {
		event.preventDefault();
		closeDialog();
	}

	function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
		const selectedFiles = Array.from(event.target.files ?? []);
		if (selectedFiles.length > MAX_MEDIA_ITEMS) {
			setFormError(`Puedes adjuntar hasta ${MAX_MEDIA_ITEMS} fotos o videos.`);
			event.target.value = "";
			setFiles([]);
			return;
		}
		setFiles(selectedFiles);
		setFormError("");
	}

	async function validateMedia() {
		for (const file of files) {
			if (file.size > MAX_MEDIA_SIZE) {
				return `${file.name} supera el límite de 50 MB.`;
			}
			if (ALLOWED_IMAGE_TYPES.has(file.type)) continue;
			if (ALLOWED_VIDEO_TYPES.has(file.type)) {
				try {
					const duration = await readVideoDuration(file);
					if (!Number.isFinite(duration) || duration > 15) {
						return `${file.name} supera el máximo permitido de 15 segundos.`;
					}
				} catch (error) {
					return error instanceof Error ? error.message : `No se pudo validar ${file.name}.`;
				}
				continue;
			}
			return `${file.name} no tiene un formato compatible. Usa JPG, PNG, WebP, MP4 o WebM.`;
		}
		return "";
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setFormError("");

		const cleanTitle = title.trim();
		const cleanBody = body.trim();
		const cleanCaption = caption.trim();
		const cleanCategory = category === "otra" ? otherCategory.trim() : category;

		if (!cleanTitle || cleanTitle.length > 180 || !cleanBody || cleanBody.length > 30000) {
			setFormError("Completa un título (hasta 180 caracteres) y el texto (hasta 30.000 caracteres).");
			return;
		}
		if (!cleanCategory || cleanCategory.length > 80 || cleanCaption.length > 2000) {
			setFormError("Revisa la categoría y el epígrafe (máximo 2.000 caracteres).");
			return;
		}

		setIsSaving(true);
		const mediaError = await validateMedia();
		if (mediaError) {
			setFormError(mediaError);
			setIsSaving(false);
			return;
		}

		const slug = createPostSlug(cleanTitle);
		const uploadedPaths: string[] = [];

		try {
			const media: Array<{ type: "image" | "video"; src: string; alt: string }> = [];
			for (const file of files) {
				const path = `${slug}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
				const { data, error } = await supabase.storage
					.from(MEDIA_BUCKET)
					.upload(path, file, { cacheControl: "31536000", contentType: file.type });
				if (error) {
					throw new Error(`No se pudo subir ${file.name}: ${error.message}`);
				}
				uploadedPaths.push(data.path);
				const { data: publicUrl } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(data.path);
				const fileLabel = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
				media.push({
					type: ALLOWED_IMAGE_TYPES.has(file.type) ? "image" : "video",
					src: publicUrl.publicUrl,
					alt: fileLabel || cleanTitle,
				});
			}

			const { error } = await supabase.from("bitacora_posts").insert({
				slug,
				category: cleanCategory,
				title: cleanTitle,
				body: cleanBody,
				caption: cleanCaption,
				media,
				status: "draft",
			});
			if (error) {
				throw new Error(`No se pudo guardar el borrador: ${error.message}`);
			}

			await loadDrafts();
			setActionMessage("Borrador guardado. Puedes revisarlo y publicarlo cuando esté listo.");
			resetForm();
			setIsFormOpen(false);
		} catch (error) {
			console.error("Bitacora draft save error:", error);
			const { error: cleanupError } = uploadedPaths.length
				? await supabase.storage.from(MEDIA_BUCKET).remove(uploadedPaths)
				: { error: null };
			if (cleanupError) {
				console.error("Bitacora media cleanup error:", cleanupError);
			}
			const details = error instanceof Error ? error.message : "Error desconocido";
			setFormError(
				cleanupError
					? `${details} No se pudieron limpiar todos los archivos subidos.`
					: details,
			);
		} finally {
			setIsSaving(false);
		}
	}

	async function publishDraft(draft: BitacoraDraft) {
		setIsPublishing(draft.id);
		setActionMessage("");
		const publishedAt = new Date().toISOString();
		const { data, error } = await supabase
			.from("bitacora_posts")
			.update({ status: "published", published_at: publishedAt, updated_at: publishedAt })
			.eq("id", draft.id)
			.eq("status", "draft")
			.select("id")
			.maybeSingle();

		if (error) {
			console.error("Bitacora draft publishing error:", error);
			setActionMessage("No se pudo publicar el borrador. Intenta de nuevo.");
		} else if (!data) {
			setActionMessage("Este borrador ya no está disponible para publicar.");
			await loadDrafts();
		} else {
			setDrafts((current) => current.filter((item) => item.id !== draft.id));
			setActionMessage(`“${draft.title}” ya está publicada en Bitácora.`);
		}
		setIsPublishing(null);
	}

	return (
		<section className="bitacora-admin-manager" aria-labelledby="bitacora-admin-heading">
			<div className="bitacora-admin-manager__header">
				<div>
					<h2 id="bitacora-admin-heading">Bitácora</h2>
					<p className="hint">Crea borradores y publícalos cuando estén listos.</p>
				</div>
				<div className="bitacora-admin-manager__actions">
					<Link className="btn-outline" href="/bitacora">Ver Bitácora</Link>
					<button className="btn" type="button" onClick={() => setIsFormOpen(true)}>
						Nueva publicación
					</button>
				</div>
			</div>
			{actionMessage && <p className="bitacora-admin-manager__message" role="status">{actionMessage}</p>}
			{loadError && <p className="admin-error" role="alert">{loadError}</p>}
			{isLoading ? (
				<p className="hint">Cargando borradores...</p>
			) : drafts.length === 0 ? (
				<p className="hint">No hay borradores pendientes.</p>
			) : (
				<div className="bitacora-draft-list">
					{drafts.map((draft) => (
						<article className="bitacora-draft" key={draft.id}>
							<div>
								<span className="bitacora-draft__category">{draft.category}</span>
								<h3>{draft.title}</h3>
								<p>{draft.body.slice(0, 220)}{draft.body.length > 220 ? "…" : ""}</p>
							</div>
							<button
								className="mini-btn mini-btn--approve"
								type="button"
								disabled={isPublishing !== null}
								onClick={() => void publishDraft(draft)}
							>
								{isPublishing === draft.id ? "Publicando..." : "Publicar"}
							</button>
						</article>
					))}
				</div>
			)}

			<dialog
				className="bitacora-post-dialog"
				aria-label="Crear publicación de Bitácora"
				ref={dialogRef}
				onClick={handleDialogClick}
				onCancel={handleDialogCancel}
				onClose={() => setIsFormOpen(false)}
			>
				<div className="bitacora-post-dialog__content">
					<button
						className="modal-close"
						type="button"
						aria-label="Cerrar formulario"
						onClick={closeDialog}
					>
						×
					</button>
					<div className="inner-label">Bitácora · Nuevo borrador</div>
					<h2>Nueva publicación</h2>
					<p className="hint">Al guardar, quedará como borrador; podrás publicarlo cuando esté listo.</p>
					<form className="admin-form bitacora-post-form" ref={formRef} onSubmit={handleSubmit}>
						<label>
							Categoría
							<select value={category} onChange={(event) => setCategory(event.target.value)} required>
								<option value="Reflexión">Reflexión personal</option>
								<option value="Notas de clase">Nota de clase</option>
								<option value="otra">Otra</option>
							</select>
						</label>
						{category === "otra" && (
							<label>
								¿Cuál?
								<input
									type="text"
									value={otherCategory}
									onChange={(event) => setOtherCategory(event.target.value)}
									maxLength={80}
									required
								/>
							</label>
						)}
						<label>
							Título
							<input
								type="text"
								value={title}
								onChange={(event) => setTitle(event.target.value)}
								maxLength={180}
								required
							/>
						</label>
						<label>
							Texto o cuerpo del post
							<textarea
								value={body}
								onChange={(event) => setBody(event.target.value)}
								maxLength={30000}
								rows={9}
								placeholder="Separa los párrafos con una línea en blanco."
								required
							/>
						</label>
						<p className="bitacora-post-form__hint">
							El primer párrafo será la vista previa; el texto completo aparecerá al abrir la publicación.
						</p>
						<label>
							Fotografías o videos (hasta {MAX_MEDIA_ITEMS})
							<input
								ref={fileInputRef}
								type="file"
								accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
								multiple
								onChange={handleFileChange}
							/>
						</label>
						{files.length > 0 && (
							<ul className="bitacora-post-form__files">
								{files.map((file) => <li key={`${file.name}:${file.size}`}>{file.name}</li>)}
							</ul>
						)}
						<label>
							Epígrafe de las fotos y videos
							<textarea
								value={caption}
								onChange={(event) => setCaption(event.target.value)}
								maxLength={2000}
								rows={3}
							/>
						</label>
						<p className="bitacora-post-form__hint">
							Los videos deben durar hasta 15 segundos y pesar como máximo 50 MB.
						</p>
						{formError && <p className="admin-error" role="alert">{formError}</p>}
						<div className="bitacora-post-form__actions">
							<button className="btn-outline" type="button" onClick={closeDialog} disabled={isSaving}>
								Cancelar
							</button>
							<button className="btn" type="submit" disabled={isSaving}>
								{isSaving ? "Guardando..." : "Guardar borrador"}
							</button>
						</div>
					</form>
				</div>
			</dialog>
		</section>
	);
}
