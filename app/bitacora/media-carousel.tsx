"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, SyntheticEvent } from "react";
import type { BitacoraMedia, BitacoraMediaList } from "./entries";

const MAX_VIDEO_DURATION_SECONDS = 15;
type ImageMedia = Extract<BitacoraMedia, { type: "image" }>;

function BitacoraVideo({ media }: { media: Extract<BitacoraMedia, { type: "video" }> }) {
	const [status, setStatus] = useState<"checking" | "ready" | "too-long" | "error" | "manual-play">("checking");

	function handleLoadedMetadata(event: SyntheticEvent<HTMLVideoElement>) {
		const video = event.currentTarget;
		if (!Number.isFinite(video.duration) || video.duration > MAX_VIDEO_DURATION_SECONDS) {
			video.pause();
			setStatus("too-long");
			return;
		}

		setStatus("ready");
		void video.play().catch(() => setStatus("manual-play"));
	}

	return (
		<>
			<video
				className="bitacora-carousel__video"
				src={media.src}
				aria-label={media.alt}
				controls={status !== "too-long" && status !== "error"}
				playsInline
				muted
				loop
				preload="metadata"
				onLoadedMetadata={handleLoadedMetadata}
				onError={() => setStatus("error")}
			/>
			{status !== "ready" && (
				<div className="bitacora-carousel__video-message" role="status">
					{status === "checking" && "Verificando la duración del video…"}
					{status === "too-long" && "Este video supera el máximo permitido de 15 segundos."}
					{status === "error" && "No se pudo cargar este video."}
					{status === "manual-play" && "Presiona reproducir para iniciar el loop."}
				</div>
			)}
		</>
	);
}

function BitacoraCaption({ caption, className }: { caption: string; className: string }) {
	const parts = caption.split(/(@[A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)*)/g);

	return (
		<p className={className}>
			{parts.map((part, index) => {
				if (!part.startsWith("@")) {
					return part;
				}

				const username = part.slice(1);
				return (
					<a
						key={`${username}-${index}`}
						href={`https://www.instagram.com/${username}/`}
						target="_blank"
						rel="noopener noreferrer"
					>
						{part}
					</a>
				);
			})}
		</p>
	);
}

export default function BitacoraMediaCarousel({
	mediaItems,
	title,
}: {
	mediaItems: BitacoraMediaList;
	title: string;
}) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [expandedImage, setExpandedImage] = useState<ImageMedia | null>(null);
	const imageDialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = imageDialogRef.current;
		if (expandedImage && dialog && !dialog.open) {
			dialog.showModal();
		}
	}, [expandedImage]);

	if (mediaItems.length === 0) {
		return (
			<div className="bitacora-carousel bitacora-carousel--empty" aria-label={`Galería de ${title}`}>
				<span>Galería de imágenes y videos</span>
				<p>Las fotos o videos de esta entrada se agregarán aquí.</p>
			</div>
		);
	}

	const media = mediaItems[activeIndex];

	function closeImageDialog() {
		const dialog = imageDialogRef.current;
		if (dialog?.open) {
			dialog.close();
		}
		setExpandedImage(null);
	}

	function handleDialogClick(event: SyntheticEvent<HTMLDialogElement>) {
		if (event.target === event.currentTarget) {
			closeImageDialog();
		}
	}

	function handleDialogCancel(event: SyntheticEvent<HTMLDialogElement>) {
		event.preventDefault();
		closeImageDialog();
	}

	function handleDialogKeyDown(event: ReactKeyboardEvent<HTMLDialogElement>) {
		if (event.key === "Escape") {
			event.preventDefault();
			closeImageDialog();
		}
	}

	return (
		<>
			<div className="bitacora-carousel" aria-label={`Galería de ${title}`}>
				<div className="bitacora-carousel__frame">
					{media.type === "image" ? (
						<button
							className="bitacora-carousel__image-trigger"
							type="button"
							aria-label={`Ampliar imagen: ${media.alt}`}
							aria-haspopup="dialog"
							onClick={() => setExpandedImage(media)}
						>
							<Image
								src={media.src}
								alt={media.alt}
								fill
								sizes="(max-width: 760px) 100vw, 900px"
								className="bitacora-carousel__image"
							/>
						</button>
					) : (
						<BitacoraVideo key={media.src} media={media} />
					)}
					{mediaItems.length > 1 && (
						<>
							<button
								className="bitacora-carousel__arrow bitacora-carousel__arrow--previous"
								type="button"
								aria-label="Ver elemento anterior"
								onClick={() => setActiveIndex((activeIndex - 1 + mediaItems.length) % mediaItems.length)}
							>
								‹
							</button>
							<button
								className="bitacora-carousel__arrow bitacora-carousel__arrow--next"
								type="button"
								aria-label="Ver elemento siguiente"
								onClick={() => setActiveIndex((activeIndex + 1) % mediaItems.length)}
							>
								›
							</button>
							<div className="bitacora-carousel__dots" aria-label="Elegir elemento">
								{mediaItems.map((item, index) => (
									<button
										key={`${item.type}:${item.src}`}
										type="button"
										className="bitacora-carousel__dot"
										aria-label={`Ver elemento ${index + 1}`}
										aria-current={index === activeIndex ? "true" : undefined}
										onClick={() => setActiveIndex(index)}
									/>
								))}
							</div>
						</>
					)}
				</div>
				{media.caption && (
					<BitacoraCaption caption={media.caption} className="bitacora-carousel__caption" />
				)}
			</div>
			<dialog
				className="bitacora-image-dialog"
				aria-label="Vista ampliada de la imagen"
				ref={imageDialogRef}
				onClick={handleDialogClick}
				onCancel={handleDialogCancel}
				onKeyDown={handleDialogKeyDown}
				onClose={() => setExpandedImage(null)}
			>
				{expandedImage && (
					<div className="bitacora-image-dialog__content">
						<div className="bitacora-image-dialog__frame">
							<Image
								src={expandedImage.src}
								alt={expandedImage.alt}
								fill
								sizes="(max-width: 760px) 94vw, 1200px"
								className="bitacora-image-dialog__image"
							/>
							<button
								className="bitacora-image-dialog__close"
								type="button"
								aria-label="Cerrar imagen ampliada"
								onClick={closeImageDialog}
							>
								×
							</button>
						</div>
						{expandedImage.caption && (
							<BitacoraCaption
								caption={expandedImage.caption}
								className="bitacora-image-dialog__caption"
							/>
						)}
					</div>
				)}
			</dialog>
		</>
	);
}
