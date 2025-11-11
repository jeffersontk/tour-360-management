'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';

// 👉 ajuste o caminho se seu JSON estiver noutro lugar
import animationData from '../../public/assets/animations/360degrees.json';

const NEXT_ROUTE = '/dashboard';

export default function Splash() {
  const router = useRouter();
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const [durationMs, setDurationMs] = useState(2400); // fallback
  const [progress, setProgress] = useState(0);        // 0–100

  const reduced = useMemo(
    () => typeof window !== 'undefined' &&
          window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    // cast to any because the Lottie ref type may not expose getLottie in the typing
    const anim = (lottieRef.current as any)?.getLottie?.();
    if (!anim) return;

    anim.loop = false;

    const handleComplete = () => router.replace(NEXT_ROUTE);
    anim.addEventListener('complete', handleComplete);

    // pega a duração real (em segundos) -> ms
    const ms = (anim.getDuration?.(true) ?? 2.4) * 1000;
    setDurationMs(ms);

    // progresso “fake” suave, sincronizado com a duração
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const el = t - start;
      const pct = Math.min(100, (el / ms) * 100);
      setProgress(pct);
      if (pct < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // fallback duro: se algo der errado, redireciona
    const id = window.setTimeout(() => router.replace(NEXT_ROUTE), ms + 300);

    return () => {
      anim.removeEventListener('complete', handleComplete);
      window.clearTimeout(id);
      cancelAnimationFrame(raf);
    };
  }, [router]);

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[radial-gradient(1200px_800px_at_50%_40%,hsl(var(--primary)/0.12),transparent_60%)]">
      {/* glow/ornamentos */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <section
        aria-label="Carregando aplicação"
        className="relative z-10 w-[min(92vw,560px)]"
      >
        <div className="rounded-3xl border border-border/60 bg-background/70 p-8 shadow-2xl backdrop-blur-xl">
          {/* Título */}
          <h1 className="mb-4 text-center text-2xl font-semibold tracking-tight text-foreground">
            Editor Tour
          </h1>

          {/* Lottie */}
          <div className="mx-auto mb-4 w-[min(82%,420px)]">
            <Lottie
              lottieRef={lottieRef}
              animationData={animationData}
              autoplay={!reduced}
              loop={false}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          {/* Barra de progresso */}
          <div className="mx-auto mb-2 mt-4 w-[min(82%,420px)]">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-150 ease-out"
                style={{ width: `${progress}%` }}
                aria-hidden
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Preparando recursos</span>
              <span aria-live="polite" aria-atomic="true">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Texto auxiliar com “dots” animados */}
          <p
            className="mt-4 text-center text-sm text-muted-foreground"
            aria-live="polite"
          >
            Preparando sua experiência 360°
            <span className="inline-block w-6 text-left">
              <span className="animate-[fadeDots_1.4s_steps(4,end)_infinite]">...</span>
            </span>
          </p>

          {/* Botão de pular (fallback manual) */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => router.replace(NEXT_ROUTE)}
              className="rounded-full border border-border/60 bg-background px-4 py-1.5 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
            >
              Pular
            </button>
          </div>
        </div>
      </section>

      {/* keyframes locais */}
      <style jsx>{`
        @keyframes fadeDots {
          0% { content: ''; }
          25% { content: '.'; }
          50% { content: '..'; }
          75% { content: '...'; }
          100% { content: ''; }
        }
        /* truque para animar os três pontos */
        span.animate-[fadeDots_1.4s_steps(4,end)_infinite]::after {
          display: inline-block;
          content: '';
          animation: fadeDots 1.4s steps(4, end) infinite;
        }
      `}</style>
    </main>
  );
}
