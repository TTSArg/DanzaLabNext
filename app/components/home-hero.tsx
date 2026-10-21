"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type Point = { x: number; y: number };
type Particle = Point & {
  tx: number;
  ty: number;
  r: number;
  rgb: [number, number, number];
  ex: number | null;
  ey: number | null;
  phaseOffset: number;
  wiggle: number;
};

const phaseDurations = [2, 2.8, 2.2, 1.8];

export default function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const bgCanvas = bgCanvasRef.current;
    const mainCanvas = mainCanvasRef.current;
    const bgContext = bgCanvas?.getContext("2d");
    const mainContext = mainCanvas?.getContext("2d");

    if (!hero || !bgCanvas || !mainCanvas || !bgContext || !mainContext) {
      console.error("No se pudo inicializar el canvas del hero.");
      return;
    }

    const heroElement = hero!;
    const backgroundCanvas = bgCanvas!;
    const titleCanvas = mainCanvas!;
    const backgroundContext = bgContext!;
    const titleContext = mainContext!;

    let bgWidth = 0;
    let bgHeight = 0;
    let width = 0;
    let height = 0;
    let targets: Point[] = [];
    let particles: Particle[] = [];
    let phase = 0;
    let elapsed = 0;
    let lastTime = 0;
    let frameId = 0;
    let active = true;

    const backgroundParticles = Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      radius: Math.random() * 2.5 + 0.5,
      velocity: 0.08 + Math.random() * 0.18,
      opacity: 0.15 + Math.random() * 0.35,
      color: Math.random() < 0.35 ? "255,140,66" : "173,109,47",
    }));

    function randomPosition(): Point {
      return { x: Math.random() * width, y: Math.random() * height };
    }

    function gradientColor(x: number): [number, number, number] {
      const percentage = width > 0 ? x / width : 0;
      if (percentage < 0.15) return [244, 244, 244];
      if (percentage < 0.55) {
        const amount = (percentage - 0.15) / 0.4;
        return [
          Math.round(244 + (255 - 244) * amount),
          Math.round(244 + (140 - 244) * amount),
          Math.round(244 + (66 - 244) * amount),
        ];
      }

      const amount = (percentage - 0.55) / 0.45;
      return [
        Math.round(255 + (173 - 255) * amount),
        Math.round(140 + (109 - 140) * amount),
        Math.round(66 + (47 - 66) * amount),
      ];
    }

    function buildTargets() {
      const offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;
      const offscreenContext = offscreenCanvas.getContext("2d");
      if (!offscreenContext) {
        console.error("No se pudo crear el canvas auxiliar del hero.");
        return;
      }

      const fontSize = Math.min(width * 0.19, 120);
      offscreenContext.font = `800 ${fontSize}px ${getComputedStyle(document.body).fontFamily}`;
      offscreenContext.textAlign = "center";
      offscreenContext.textBaseline = "middle";
      offscreenContext.fillStyle = "#fff";
      const lineHeight = fontSize * 1.05;
      offscreenContext.fillText("DANZA", width / 2, height * 0.38 - lineHeight * 0.5);
      offscreenContext.fillText("LAB", width / 2, height * 0.38 + lineHeight * 0.5);

      const imageData = offscreenContext.getImageData(0, 0, width, height).data;
      targets = [];
      const step = Math.max(3, Math.floor(width / 160));
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          if (imageData[(y * width + x) * 4 + 3] > 100) {
            targets.push({ x, y });
          }
        }
      }

      const count = Math.min(targets.length, 2200);
      particles = Array.from({ length: count }, (_, index) => {
        const target = targets[index % targets.length];
        const start = randomPosition();
        return {
          ...start,
          tx: target.x,
          ty: target.y,
          r: Math.random() * 1.4 + 0.4,
          rgb: gradientColor(target.x),
          ex: null,
          ey: null,
          phaseOffset: Math.random() * Math.PI * 2,
          wiggle: Math.random() * 0.6 + 0.2,
        };
      });
      phase = 0;
      elapsed = 0;
    }

    function resize() {
      const bounds = heroElement.getBoundingClientRect();
      width = Math.floor(bounds.width);
      height = Math.floor(bounds.height);
      if (width <= 0 || height <= 0) return;

      bgWidth = backgroundCanvas.width = width;
      bgHeight = backgroundCanvas.height = height;
      titleCanvas.width = width;
      titleCanvas.height = height;
      buildTargets();
    }

    function easeInOut(value: number) {
      return value < 0.5 ? 2 * value * value : -1 + (4 - 2 * value) * value;
    }

    function drawBackground() {
      backgroundContext.clearRect(0, 0, bgWidth, bgHeight);
      backgroundParticles.forEach((particle) => {
        particle.y -= particle.velocity * 0.06;
        if (particle.y < -2) particle.y = 102;
        backgroundContext.beginPath();
        backgroundContext.arc(
          (particle.x * bgWidth) / 100,
          (particle.y * bgHeight) / 100,
          particle.radius,
          0,
          Math.PI * 2,
        );
        backgroundContext.fillStyle = `rgba(${particle.color},${particle.opacity})`;
        backgroundContext.fill();
      });
    }

    function animate(timestamp: number) {
      const delta = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      elapsed += delta;

      drawBackground();
      titleContext.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        let opacity = 1;

        if (phase === 0) {
          particle.x += Math.sin(timestamp * 0.0005 + particle.phaseOffset) * 0.4;
          particle.y += Math.cos(timestamp * 0.0004 + particle.phaseOffset * 1.3) * 0.4;
          if (particle.x < 0) particle.x = width;
          if (particle.x > width) particle.x = 0;
          if (particle.y < 0) particle.y = height;
          if (particle.y > height) particle.y = 0;
          opacity = 0.2 + Math.sin(timestamp * 0.001 + particle.phaseOffset) * 0.1;
        } else if (phase === 1) {
          const progress = easeInOut(Math.min(elapsed / phaseDurations[1], 1));
          const wobble = (1 - progress) * 5;
          particle.x +=
            (particle.tx - particle.x) * (0.04 + progress * 0.04) +
            Math.sin(timestamp * 0.002 + particle.phaseOffset) * wobble * 0.1;
          particle.y +=
            (particle.ty - particle.y) * (0.04 + progress * 0.04) +
            Math.cos(timestamp * 0.002 + particle.phaseOffset) * wobble * 0.1;
          opacity = 0.25 + progress * 0.7;
        } else if (phase === 2) {
          particle.x =
            particle.tx + Math.sin(timestamp * 0.0015 + particle.phaseOffset) * 1.2 * particle.wiggle;
          particle.y =
            particle.ty + Math.cos(timestamp * 0.0012 + particle.phaseOffset) * particle.wiggle;
          opacity = 0.85 + Math.sin(timestamp * 0.0018 + particle.phaseOffset) * 0.1;
        } else {
          if (particle.ex === null || particle.ey === null) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 150 + Math.random() * Math.max(width, height) * 0.5;
            particle.ex = particle.tx + Math.cos(angle) * distance;
            particle.ey = particle.ty + Math.sin(angle) * distance;
          }
          const progress = Math.pow(Math.min(elapsed / phaseDurations[3], 1), 3);
          particle.x = particle.tx + (particle.ex - particle.tx) * progress;
          particle.y = particle.ty + (particle.ey - particle.ty) * progress;
          opacity = (1 - progress) * 0.85;
        }

        const [red, green, blue] = particle.rgb;
        titleContext.beginPath();
        titleContext.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        titleContext.fillStyle = `rgba(${red},${green},${blue},${opacity})`;
        titleContext.fill();
      });

      if (elapsed >= phaseDurations[phase]) {
        elapsed = 0;
        if (phase === 3 && targets.length > 0) {
          particles.forEach((particle) => {
            const start = randomPosition();
            const target = targets[Math.floor(Math.random() * targets.length)];
            particle.x = start.x;
            particle.y = start.y;
            particle.tx = target.x;
            particle.ty = target.y;
            particle.rgb = gradientColor(target.x);
            particle.ex = null;
            particle.ey = null;
          });
        }
        phase = (phase + 1) % phaseDurations.length;
      }

      if (active) frameId = requestAnimationFrame(animate);
    }

    function startAnimation() {
      if (!active) return;
      resize();
      if (targets.length === 0) {
        console.error("No se encontraron partículas para formar el título del hero.");
        return;
      }
      frameId = requestAnimationFrame((timestamp) => {
        lastTime = timestamp;
        animate(timestamp);
      });
    }

    const observer = new ResizeObserver(resize);
    observer.observe(heroElement);
    window.addEventListener("resize", resize);
    const nav = document.querySelector(".site-nav");
    const updateNav = () => nav?.classList.toggle("solid", window.scrollY > 60);
    window.addEventListener("scroll", updateNav);
    updateNav();

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target instanceof HTMLElement) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "none";
          }
        });
      },
      { threshold: 0.08 },
    );
    ["#manifiesto", "#atto"].forEach((selector) => {
      const element = document.querySelector(selector);
      if (element instanceof HTMLElement) {
        element.style.cssText =
          "opacity:0;transform:translateY(18px);transition:opacity .9s ease,transform .9s ease;";
        sectionObserver.observe(element);
      }
    });

    resize();
    document.fonts.ready.then(startAnimation);

    return () => {
      active = false;
      cancelAnimationFrame(frameId);
      observer.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateNav);
      nav?.classList.remove("solid");
    };
  }, []);

  return (
    <section id="hero" ref={heroRef}>
      <div className="hero-bg" />
      <canvas
        id="bgCanvas"
        ref={bgCanvasRef}
        aria-hidden="true"
      />
      <canvas
        id="mainCanvas"
        ref={mainCanvasRef}
        role="img"
        aria-label="Danza Lab"
      />

      <div className="hero-sub">Explorar · Entrenar · Crear</div>

      <div className="hero-content">
        <p className="hero-desc">
          Investigamos el cuerpo en movimiento, donde lo genuino se nutre de técnica para
          amplificar la capacidad de improvisación en tango.
        </p>
        <p className="hero-desc2">
          Abordamos la danza como pulsión de lo vivo — una constante transformación de tejidos
          que aguardan a ser descubiertos.
        </p>
        <div className="cta-group">
          <Link href="/laboratorios" className="btn primary">
            Laboratorios
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="/composicion-escenica" className="btn">
            Composición Escénica
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <div className="scroll-line" />
      </div>
    </section>
  );
}
