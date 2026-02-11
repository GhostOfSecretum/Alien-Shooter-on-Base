'use client';

import { EngineSnapshot } from '@/engine/types';

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 12a8 8 0 1 1-2.34-5.66"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 4v6h-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpeakerIcon({ muted, className }: { muted: boolean; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M11 5 7.5 8H4v8h3.5L11 19V5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {!muted ? (
        <>
          <path
            d="M15.5 8.5a4 4 0 0 1 0 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M18 6a7 7 0 0 1 0 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.75"
          />
        </>
      ) : (
        <path
          d="M21 9 15 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

type HudProps = {
  state: EngineSnapshot;
  onRestart: () => void;
  onToggleSound: () => void;
};

export default function Hud({ state, onRestart, onToggleSound }: HudProps) {
  const buildLabel = process.env.NEXT_PUBLIC_BUILD_LABEL ?? 'v1.0+local';
  const hp = Math.max(0, Math.min(1, state.health / 100));
  const hpColor =
    hp > 0.55 ? 'rgba(34, 197, 94, 0.95)' : hp > 0.25 ? 'rgba(245, 158, 11, 0.95)' : 'rgba(239, 68, 68, 0.95)';

  return (
    <div className="pointer-events-none absolute inset-0 text-white">
      {/* Top-left status panel */}
      <div className="pointer-events-none absolute left-4 top-4 w-[min(390px,calc(100vw-1rem))]">
        <div className="ui-panel ui-scanlines ui-shimmer rounded-2xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.22em] text-slate-300/75 ui-mono">COMBAT TELEMETRY</div>
            <div className="text-[10px] text-slate-400/70 ui-mono">Build {buildLabel}</div>
          </div>

          <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
            <div className="rounded-lg border border-slate-300/10 bg-slate-950/35 px-2 py-1.5 flex flex-col">
              <div className="text-slate-300/70">Wave</div>
              <div className="font-semibold ui-mono">{state.wave ?? 1}</div>
            </div>
            <div className="rounded-lg border border-slate-300/10 bg-slate-950/35 px-2 py-1.5 flex flex-col">
              <div className="text-slate-300/70">Kills</div>
              <div className="font-semibold ui-mono">{state.kills}</div>
            </div>
            <div className="rounded-lg border border-slate-300/10 bg-slate-950/35 px-2 py-1.5 flex flex-col">
              <div className="text-slate-300/70">Score</div>
              <div className="font-semibold ui-mono">{state.score ?? 0}</div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px]">
              <div className="text-slate-300/70">Health</div>
              <div className="ui-mono text-slate-300/80">{Math.max(0, state.health)}</div>
            </div>
            <div className="mt-1 h-2 rounded-full bg-slate-950/60 border border-slate-400/15 overflow-hidden">
              <div
                className="h-full transition-all duration-200"
                style={{
                  width: `${Math.round(hp * 100)}%`,
                  background: `linear-gradient(90deg, ${hpColor} 0%, rgba(34,211,238,0.35) 100%)`,
                  boxShadow: '0 0 26px rgba(34,211,238,0.12)',
                }}
              />
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] rounded-lg border border-slate-300/10 bg-slate-950/35 px-2 py-1.5">
            <div className="text-slate-300/70">Ammo</div>
            <div className="ui-mono text-slate-200/90">{state.ammo}</div>
          </div>
        </div>
      </div>

      {/* Top right buttons */}
      <div className="pointer-events-auto absolute top-4 right-4 flex items-center gap-2">
        <button 
          type="button" 
          className="ui-button ui-scanlines ui-shimmer rounded-xl px-4 py-2 text-[13px] font-semibold tracking-[0.10em] uppercase"
          onClick={onRestart}
        >
          <span className="inline-flex items-center gap-2">
            <RefreshIcon className="ui-icon h-4 w-4 text-cyan-300" />
            Restart
          </span>
        </button>
        <button 
          type="button" 
          className="ui-button ui-scanlines ui-shimmer rounded-xl px-4 py-2 text-[13px] font-semibold tracking-[0.10em] uppercase"
          onClick={onToggleSound}
        >
          <span className="inline-flex items-center gap-2">
            <SpeakerIcon muted={state.muted} className={`ui-icon h-4 w-4 ${state.muted ? 'text-slate-300/70' : 'text-amber-300'}`} />
            {state.muted ? 'Muted' : 'Sound'}
          </span>
        </button>
      </div>

      {/* Game over screen */}
      {state.status === 'gameover' && (
        <div
          className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center text-white overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 35%, rgba(239,68,68,0.22) 0%, transparent 55%),
                              linear-gradient(180deg, rgba(0,0,0,0.92) 0%, rgba(2,6,23,0.96) 100%),
                              url('/game-art/wall_metal.png')`,
            backgroundSize: 'cover, cover, 520px 520px',
            backgroundBlendMode: 'screen, normal, overlay',
          }}
        >
          <div className="absolute inset-0 opacity-[0.10] pointer-events-none"
               style={{
                 backgroundImage:
                   'linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)',
                 backgroundSize: '72px 72px',
               }}
          />

          <div className="relative z-10 flex flex-col items-center gap-6">
            <div 
              className="text-7xl font-black tracking-tight"
              style={{ 
                textShadow: '0 0 70px rgba(239,68,68,0.55), 0 0 140px rgba(239,68,68,0.25)',
                background: 'linear-gradient(180deg, #ffe4e6 0%, #ff4444 35%, #7f1d1d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              GAME OVER
            </div>

            <div className="ui-panel ui-panel--danger ui-scanlines rounded-2xl p-6">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-slate-300/70 text-sm uppercase tracking-widest">Wave</div>
                  <div className="text-3xl font-bold text-white ui-mono">{state.wave ?? 1}</div>
                </div>
                <div>
                  <div className="text-slate-300/70 text-sm uppercase tracking-widest">Kills</div>
                  <div className="text-3xl font-bold text-red-300 ui-mono">{state.kills}</div>
                </div>
                <div>
                  <div className="text-slate-300/70 text-sm uppercase tracking-widest">Score</div>
                  <div className="text-3xl font-bold text-amber-300 ui-mono">{state.score ?? 0}</div>
                </div>
              </div>
            </div>

            <button 
              type="button" 
              className="mt-3 ui-button ui-scanlines rounded-2xl px-12 py-4 text-xl font-black tracking-wider"
              style={{
                borderColor: 'rgba(239,68,68,0.35)',
                background:
                  'linear-gradient(135deg, rgba(239,68,68,0.22) 0%, rgba(15,23,42,0.78) 45%, rgba(2,6,23,0.68) 100%)',
                boxShadow: '0 0 55px rgba(239,68,68,0.14), 0 18px 60px rgba(0,0,0,0.6)',
              }}
              onClick={onRestart}
            >
              TRY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
