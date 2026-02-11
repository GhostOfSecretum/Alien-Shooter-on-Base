'use client';

type StartOverlayProps = {
  onStart: () => void;
};

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function StartOverlay({ onStart }: StartOverlayProps) {
  const gameVersion = process.env.NEXT_PUBLIC_GAME_VERSION ?? 'v1.0';
  const buildHash = process.env.NEXT_PUBLIC_BUILD_HASH ?? 'local';

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center text-white overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(circle at 62% 22%, rgba(34,211,238,0.20) 0%, transparent 56%),
                          radial-gradient(circle at 20% 82%, rgba(245,158,11,0.13) 0%, transparent 54%),
                          linear-gradient(180deg, rgba(2,8,23,0.90) 0%, rgba(0,0,0,0.96) 100%),
                          url('/game-art/wall_tech.png')`,
        backgroundSize: 'cover, cover, cover, 540px 540px',
        backgroundBlendMode: 'screen, screen, normal, overlay',
      }}
    >
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.11] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.11) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.11) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-4 pointer-events-none">
        {/* Title */}
        <div className="relative">
          <h1 
            className="text-6xl md:text-8xl font-black tracking-tight ui-float"
            style={{ 
              textShadow: '0 0 50px rgba(34, 211, 238, 0.45), 0 0 120px rgba(245, 158, 11, 0.2)',
              background: 'linear-gradient(180deg, #e2e8f0 0%, #22d3ee 35%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))',
            }}
          >
            ALIEN SWARM
          </h1>
          <div className="absolute -inset-4 bg-cyan-500/15 blur-3xl -z-10 animate-pulse" />
        </div>

        <div className="text-xl md:text-2xl text-slate-300/75 font-light tracking-[0.35em] uppercase ui-mono">
          EXTERMINATION PROTOCOL
        </div>

        {/* Divider */}
        <div className="w-72 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent my-4" />

        {/* Controls */}
        <div className="ui-panel ui-scanlines ui-shimmer rounded-2xl p-6 max-w-md">
          <div className="text-amber-300 font-bold text-center mb-4 tracking-[0.25em] text-xs ui-mono">TACTICAL INPUT MAP</div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div className="text-slate-300/70">Movement</div>
            <div className="text-white ui-mono">W A S D</div>
            <div className="text-slate-300/70">Aim</div>
            <div className="text-white ui-mono">MOUSE / TOUCH</div>
            <div className="text-slate-300/70">Fire</div>
            <div className="text-white ui-mono">LMB / SPACE</div>
            <div className="text-slate-300/70">Restart</div>
            <div className="text-white ui-mono">↻</div>
          </div>
        </div>

        {/* Tips */}
        <div className="text-slate-400/70 text-xs text-center max-w-sm mt-2 space-y-1">
          <p>Survive waves of alien creatures</p>
          <p>Collect <span className="text-green-400">health</span>, <span className="text-yellow-400">ammo</span> and <span className="text-blue-400">armor</span></p>
          <p>Reach the <span className="text-green-300">EXIT</span> to advance</p>
        </div>

        {/* Start button */}
        <button 
          type="button" 
          className="mt-8 pointer-events-auto ui-button ui-button--primary ui-shimmer rounded-2xl px-16 py-5 font-black text-2xl uppercase tracking-wider transition-all duration-300 hover:scale-[1.03] active:scale-[0.99]"
          onClick={onStart}
        >
          <span className="text-white inline-flex items-center gap-3">
            START GAME
            <ArrowRightIcon className="ui-icon h-6 w-6 text-cyan-200/90" />
          </span>
        </button>

        {/* Version */}
        <div className="text-slate-500/70 text-xs mt-4 ui-mono">
          {gameVersion} ({buildHash}) - Top-Down Shooter
        </div>
      </div>
    </div>
  );
}
