"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const ambientParticles = [
  { x: 92, y: 142, radius: 2 },
  { x: 210, y: 316, radius: 1.5 },
  { x: 336, y: 108, radius: 2.5 },
  { x: 418, y: 732, radius: 1.5 },
  { x: 526, y: 206, radius: 1.5 },
  { x: 686, y: 112, radius: 2 },
  { x: 808, y: 758, radius: 2.5 },
  { x: 934, y: 218, radius: 1.5 },
  { x: 1048, y: 128, radius: 2 },
  { x: 1182, y: 708, radius: 1.5 },
  { x: 1336, y: 254, radius: 2.5 },
  { x: 128, y: 622, radius: 2.5 },
];

const secondaryAmbientParticles = [
  { x: 168, y: 474, radius: 1.5 },
  { x: 294, y: 814, radius: 2 },
  { x: 454, y: 392, radius: 2.5 },
  { x: 592, y: 624, radius: 1.5 },
  { x: 742, y: 286, radius: 2 },
  { x: 872, y: 562, radius: 1.5 },
  { x: 1014, y: 804, radius: 2.5 },
  { x: 1138, y: 386, radius: 2 },
  { x: 1288, y: 552, radius: 1.5 },
  { x: 1370, y: 112, radius: 2 },
];

const crossingParticles = Array.from({ length: 18 }, (_, index) => {
  const startY = 100 + ((index * 173) % 720);
  const centerY = 300 + ((index * 89) % 300);
  const direction = index % 2 === 0 ? 1 : -1;
  const startX = direction === 1 ? -30 : 1470;
  const endX = direction === 1 ? 1470 : -30;

  return {
    index,
    startX,
    endX,
    startY,
    centerY,
    endY: 100 + ((index * 127 + 270) % 720),
    duration: 8 + (index % 5) * 2,
    delay: -((index * 3) % 17),
  };
});

type LetterParticle = {
  key: string;
  x: number;
  y: number;
  radius: number;
  path: string;
  duration: number;
  delay: number;
  gradientId: string;
};

function randomValue(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function HeroParticleLayer() {
  const layerRef = useRef<SVGSVGElement>(null);
  const [particles, setParticles] = useState<LetterParticle[]>([]);
  const [size, setSize] = useState({ width: 1440, height: 900 });

  useEffect(() => {
    const svg = layerRef.current;
    if (!svg) return;
    const hero = svg.closest<HTMLElement>("#hero");
    if (!hero) return;
    const heroElement: HTMLElement = hero;

    let active = true;
    let frameId = 0;

    function buildParticles() {
      if (!active) return;
      const heroBounds = heroElement.getBoundingClientRect();
      const width = Math.max(1, heroBounds.width);
      const height = Math.max(1, heroBounds.height);
      const nextParticles: LetterParticle[] = [];
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d", { willReadFrequently: true });

      if (!context) {
        console.error("No se pudo preparar el muestreo tipográfico de las partículas del hero.");
        return;
      }

      heroElement.querySelectorAll<HTMLElement>(".hero-word-text").forEach((word, wordIndex) => {
        const bounds = word.getBoundingClientRect();
        const style = getComputedStyle(word);
        canvas.width = Math.max(1, Math.ceil(bounds.width));
        canvas.height = Math.max(1, Math.ceil(bounds.height));
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "#fff";
        context.fillText(word.textContent ?? "", canvas.width / 2, canvas.height / 2);

        const image = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const step = 5;
        const gradientId = wordIndex === 0 ? "danza-particle-gradient" : "lab-particle-gradient";
        let particleIndex = 0;

        for (let y = 1; y < canvas.height - 1; y += step) {
          for (let x = 1; x < canvas.width - 1; x += step) {
            if (image[(y * canvas.width + x) * 4 + 3] < 180) continue;

            const seed = particleIndex + wordIndex * 10000;
            const startX = bounds.left - heroBounds.left + x;
            const startY = bounds.top - heroBounds.top + y;
            const targetX = randomValue(seed + 1) * width;
            const targetY = randomValue(seed + 2) * height;
            const deltaX = targetX - startX;
            const deltaY = targetY - startY;
            const swayX = (randomValue(seed + 3) - 0.5) * width * 0.65;
            const swayY = (randomValue(seed + 4) - 0.5) * height * 0.65;
            const path = [
              "M 0 0",
              `C ${deltaX * 0.22 + swayX} ${deltaY * 0.18 - swayY}`,
              `${deltaX * 0.78 - swayX} ${deltaY * 0.82 + swayY}`,
              `${deltaX} ${deltaY}`,
              `C ${deltaX * 0.76 + swayX} ${deltaY * 0.82 - swayY}`,
              `${deltaX * 0.2 - swayX} ${deltaY * 0.2 + swayY}`,
              "0 0",
            ].join(" ");
            const duration = 16;

            nextParticles.push({
              key: `${wordIndex}-${particleIndex}`,
              x: startX,
              y: startY,
              radius: 0.7 + randomValue(seed + 6) * 1.7,
              path,
              duration,
              delay: 0,
              gradientId,
            });
            particleIndex += 1;
          }
        }
      });

      setSize({ width, height });
      setParticles(nextParticles);
    }

    function scheduleBuild() {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(buildParticles);
    }

    const resizeObserver = new ResizeObserver(scheduleBuild);
    resizeObserver.observe(heroElement);
    document.fonts.ready.then(scheduleBuild);
    scheduleBuild();

    return () => {
      active = false;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <svg
      ref={layerRef}
      className="hero-burst-particles"
      viewBox={`0 0 ${size.width} ${size.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="danza-particle-gradient" gradientUnits="userSpaceOnUse" x1="0" x2={size.width}>
          <stop offset="0%" stopColor="#fffaf6" />
          <stop offset="22%" stopColor="#ffe1cf" />
          <stop offset="48%" stopColor="#ffb27f" />
          <stop offset="74%" stopColor="#ff8c42" />
          <stop offset="100%" stopColor="#e96b28" />
        </linearGradient>
        <linearGradient id="lab-particle-gradient" gradientUnits="userSpaceOnUse" x1="0" x2={size.width}>
          <stop offset="0%" stopColor="#ffc49d" />
          <stop offset="25%" stopColor="#ffad7a" />
          <stop offset="52%" stopColor="#ff914e" />
          <stop offset="76%" stopColor="#e97830" />
          <stop offset="100%" stopColor="#c95624" />
        </linearGradient>
      </defs>
      {particles.map((particle) => (
        <circle
          key={particle.key}
          cx={particle.x}
          cy={particle.y}
          r={particle.radius}
          fill={`url(#${particle.gradientId})`}
        >
          <animateMotion
            path={particle.path}
            dur={`${particle.duration}s`}
            begin={`${particle.delay}s`}
            keyPoints="0;0;0.5;1;1"
            keyTimes="0;0.18;0.5;0.82;1"
            keySplines="0.35 0 0.65 1;0.35 0 0.65 1;0.35 0 0.65 1;0.35 0 0.65 1"
            calcMode="spline"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;1;0.12;1;1"
            keyTimes="0;0.18;0.5;0.82;1"
            dur={`${particle.duration}s`}
            begin={`${particle.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}

function ParticleWord({ label }: { label: string }) {
  return (
    <span className={`hero-word hero-word--${label.toLowerCase()}`}>
      <span className="hero-word-text" aria-hidden="true">{label}</span>
    </span>
  );
}

export default function HomeHero() {
  useEffect(() => {
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

    return () => {
      sectionObserver.disconnect();
      window.removeEventListener("scroll", updateNav);
      nav?.classList.remove("solid");
    };
  }, []);

  return (
    <section id="hero">
      <div className="hero-bg" aria-hidden="true" />
      <svg
        className="hero-particles"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g className="hero-particle-field">
          {[0, 60].map((offset) => (
            <g key={offset} transform={`translate(0 ${offset})`}>
              {ambientParticles.map((particle) => (
                <circle
                  key={`${particle.x}-${particle.y}`}
                  cx={particle.x}
                  cy={particle.y}
                  r={particle.radius}
                />
              ))}
            </g>
          ))}
        </g>
        <g className="hero-particle-field hero-particle-field--second">
          {[0, 60].map((offset) => (
            <g key={offset} transform={`translate(0 ${offset})`}>
              {secondaryAmbientParticles.map((particle) => (
                <circle
                  key={`${particle.x}-${particle.y}`}
                  cx={particle.x}
                  cy={particle.y}
                  r={particle.radius}
                />
              ))}
            </g>
          ))}
        </g>
        <g className="hero-crossing-particles">
          {crossingParticles.map((particle) => (
            <circle
              key={particle.index}
              cx={particle.startX}
              cy={particle.startY}
              r={particle.index % 3 === 0 ? 1.5 : 1.25}
            >
              <animate
                attributeName="cx"
                values={`${particle.startX};720;${particle.endX}`}
                keyTimes="0;0.52;1"
                dur={`${particle.duration}s`}
                begin={`${particle.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values={`${particle.startY};${particle.centerY};${particle.endY}`}
                keyTimes="0;0.52;1"
                dur={`${particle.duration}s`}
                begin={`${particle.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.9;0"
                keyTimes="0;0.18;1"
                dur={`${particle.duration}s`}
                begin={`${particle.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>
      </svg>

      <h1 className="hero-title" aria-label="Danza Lab">
        <ParticleWord label="DANZA" />
        <span className="hero-sub" aria-hidden="true">
          Explorar · Entrenar · Crear
        </span>
        <ParticleWord label="LAB" />
      </h1>
      <HeroParticleLayer />

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
