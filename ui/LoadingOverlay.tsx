'use client';

type LoadingOverlayProps = {
  progress: number;
};

function Spinner({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12a9 9 0 1 1-2.64-6.36"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function LoadingOverlay({ progress }: LoadingOverlayProps) {
  const percent = Math.max(0, Math.min(100, Math.round(progress * 100)));
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-white overflow-hidden pointer-events-none"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 16%, rgba(34,211,238,0.16) 0%, transparent 56%),
                          radial-gradient(circle at 22% 86%, rgba(245,158,11,0.11) 0%, transparent 54%),
                          linear-gradient(180deg, rgba(3,8,20,0.90) 0%, rgba(0,0,0,0.96) 100%),
                          url('/game-art/floor.png')`,
        backgroundSize: 'cover, cover, cover, 260px 260px',
        backgroundBlendMode: 'screen, screen, normal, overlay',
      }}
    >
      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.09] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.11) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.11) 1px, transparent 1px)',
          backgroundSize: '62px 62px',
        }}
      />

      <div className="ui-panel ui-scanlines ui-shimmer rounded-2xl px-7 py-6 w-[min(560px,92vw)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="text-[11px] tracking-[0.25em] text-slate-300/80 uppercase ui-mono">INITIALIZING</div>
            <div className="text-2xl font-semibold tracking-tight">Alien Core Systems</div>
            <div className="text-[11px] text-slate-400/75 ui-mono uppercase tracking-[0.16em]">
              Orbital Uplink / Texture Streaming
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Spinner className="ui-icon h-5 w-5 text-cyan-200/80 animate-spin" />
            <div className="text-sm text-slate-200/90 ui-mono">{percent}%</div>
          </div>
        </div>

        <div className="mt-5">
          <div className="relative h-3.5 rounded-full bg-slate-950/70 border border-slate-300/15 overflow-hidden">
            <div
              className="h-full transition-all duration-200"
              style={{
                width: `${percent}%`,
                background:
                  'linear-gradient(90deg, rgba(34,211,238,0.15) 0%, rgba(34,211,238,0.85) 35%, rgba(245,158,11,0.88) 100%)',
                boxShadow: '0 0 28px rgba(34,211,238,0.28), 0 0 38px rgba(245,158,11,0.20)',
              }}
            />
            <div
              className="absolute inset-y-0 w-20 -skew-x-[24deg] bg-white/20 pointer-events-none"
              style={{
                left: `calc(${percent}% - 2.5rem)`,
                opacity: percent > 5 ? 0.5 : 0,
                filter: 'blur(4px)',
              }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400/80">
            <span className="ui-mono">WASM / TEXTURES / AUDIO</span>
            <span className="ui-mono">COLD START OPTIMIZED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
