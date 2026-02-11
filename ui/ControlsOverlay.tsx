'use client';

import { useRef, useEffect, useState } from 'react';
import type { PointerEvent } from 'react';
import { ControlKey } from '@/engine/input';

type ControlsOverlayProps = {
  onControlChange: (control: ControlKey, active: boolean) => void;
  onJoystickChange?: (x: number, y: number, active: boolean) => void;
  onAimChange?: (x: number, y: number, active: boolean) => void;
};

// Virtual Joystick Component
function VirtualJoystick({ onJoystickChange }: { onJoystickChange?: (x: number, y: number, active: boolean) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const stateRef = useRef({
    active: false,
    originX: 0,
    originY: 0,
    normX: 0,
    normY: 0,
    pointerId: null as number | null,
  });
  const callbackRef = useRef(onJoystickChange);
  callbackRef.current = onJoystickChange;

  const JOYSTICK_SIZE = 132;
  const KNOB_SIZE = 52;
  const MAX_DISTANCE = (JOYSTICK_SIZE - KNOB_SIZE) / 2;
  const DEADZONE = 0.14;

  const emitJoystick = (active: boolean) => {
    callbackRef.current?.(stateRef.current.normX, stateRef.current.normY, active);
  };

  const resetJoystick = () => {
    stateRef.current.pointerId = null;
    stateRef.current.active = false;
    stateRef.current.normX = 0;
    stateRef.current.normY = 0;
    setIsActive(false);
    setJoystickPos({ x: 0, y: 0 });
    emitJoystick(false);
  };

  const updateJoystickFromClientPoint = (clientX: number, clientY: number) => {
    const dx = clientX - stateRef.current.originX;
    const dy = clientY - stateRef.current.originY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      const clampedDistance = Math.min(distance, MAX_DISTANCE);
      const rawMagnitude = clampedDistance / MAX_DISTANCE;
      const normalizedDx = dx / distance;
      const normalizedDy = dy / distance;
      const adjustedMagnitude = rawMagnitude <= DEADZONE
        ? 0
        : (rawMagnitude - DEADZONE) / (1 - DEADZONE);
      const normX = normalizedDx * adjustedMagnitude;
      const normY = normalizedDy * adjustedMagnitude;

      stateRef.current.normX = normX;
      stateRef.current.normY = normY;

      setJoystickPos({
        x: normalizedDx * clampedDistance,
        y: normalizedDy * clampedDistance,
      });
    } else {
      stateRef.current.normX = 0;
      stateRef.current.normY = 0;
      setJoystickPos({ x: 0, y: 0 });
    }

    emitJoystick(stateRef.current.active);
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (stateRef.current.pointerId !== null) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    const container = containerRef.current;
    if (!container) return;

    stateRef.current.pointerId = e.pointerId;
    container.setPointerCapture(e.pointerId);

    const rect = container.getBoundingClientRect();
    stateRef.current.originX = rect.left + rect.width / 2;
    stateRef.current.originY = rect.top + rect.height / 2;
    stateRef.current.active = true;

    updateJoystickFromClientPoint(e.clientX, e.clientY);
    setIsActive(true);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (stateRef.current.pointerId !== e.pointerId) return;
    if (!stateRef.current.active) return;

    e.preventDefault();
    e.stopPropagation();

    updateJoystickFromClientPoint(e.clientX, e.clientY);
  };

  const releasePointerCapture = (pointerId: number) => {
    const container = containerRef.current;
    if (!container) return;
    if (container.hasPointerCapture(pointerId)) {
      container.releasePointerCapture(pointerId);
    }
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (stateRef.current.pointerId !== e.pointerId) return;

    e.preventDefault();
    e.stopPropagation();

    releasePointerCapture(e.pointerId);
    resetJoystick();
  };

  const handlePointerCancel = (e: PointerEvent<HTMLDivElement>) => {
    if (stateRef.current.pointerId !== e.pointerId) return;

    e.preventDefault();
    e.stopPropagation();

    releasePointerCapture(e.pointerId);
    resetJoystick();
  };

  const handleLostPointerCapture = (e: PointerEvent<HTMLDivElement>) => {
    if (stateRef.current.pointerId !== e.pointerId) return;
    resetJoystick();
  };

  useEffect(() => {
    const handleBlur = () => {
      if (stateRef.current.active) {
        resetJoystick();
      }
    };
    window.addEventListener('blur', handleBlur);
    window.addEventListener('visibilitychange', handleBlur);
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('visibilitychange', handleBlur);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="virtual-joystick relative touch-none select-none ui-panel ui-scanlines ui-shimmer rounded-full"
      style={{ width: JOYSTICK_SIZE, height: JOYSTICK_SIZE }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handleLostPointerCapture}
    >
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2"
        style={{
          borderColor: isActive ? 'rgba(34,211,238,0.58)' : 'rgba(148,163,184,0.28)',
          boxShadow: isActive
            ? '0 0 34px rgba(34,211,238,0.22), inset 0 0 0 1px rgba(34,211,238,0.15)'
            : '0 0 18px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.05)',
        }}
      />

      {/* Inner ring */}
      <div className="absolute inset-[12px] rounded-full border"
        style={{
          borderColor: isActive ? 'rgba(245,158,11,0.36)' : 'rgba(148,163,184,0.18)',
          background:
            'radial-gradient(circle at 30% 30%, rgba(34,211,238,0.12) 0%, rgba(2,6,23,0.45) 55%, rgba(0,0,0,0.25) 100%)',
        }}
      />

      {/* Center ring for precision feedback */}
      <div
        className="absolute rounded-full border pointer-events-none"
        style={{
          width: 30,
          height: 30,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          borderColor: isActive ? 'rgba(34,211,238,0.55)' : 'rgba(148,163,184,0.25)',
          boxShadow: isActive ? '0 0 18px rgba(34,211,238,0.2)' : 'none',
        }}
      />
      
      {/* Direction indicators */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute top-2 text-white/25 text-[10px] font-bold tracking-widest">N</div>
        <div className="absolute bottom-2 text-white/25 text-[10px] font-bold tracking-widest">S</div>
        <div className="absolute left-2 text-white/25 text-[10px] font-bold tracking-widest">W</div>
        <div className="absolute right-2 text-white/25 text-[10px] font-bold tracking-widest">E</div>
      </div>
      
      {/* Knob */}
      <div
        className="absolute rounded-full transition-transform duration-75"
        style={{
          width: KNOB_SIZE,
          height: KNOB_SIZE,
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${joystickPos.x}px), calc(-50% + ${joystickPos.y}px))`,
          background: isActive 
            ? 'radial-gradient(circle at 30% 30%, rgba(226,232,240,0.95), rgba(34,211,238,0.85), rgba(2,6,23,0.85))'
            : 'radial-gradient(circle at 30% 30%, rgba(148,163,184,0.85), rgba(15,23,42,0.9), rgba(2,6,23,0.9))',
          boxShadow: isActive 
            ? '0 0 30px rgba(34,211,238,0.34), 0 0 62px rgba(245,158,11,0.12), inset 0 1px 0 rgba(255,255,255,0.25)'
            : '0 10px 20px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)',
          border: isActive ? '2px solid rgba(34,211,238,0.35)' : '2px solid rgba(148,163,184,0.25)',
        }}
      />
    </div>
  );
}

// Aim joystick component (right side of screen)
function AimJoystick({ onAimChange }: { onAimChange?: (x: number, y: number, active: boolean) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const [isOutsideDeadzone, setIsOutsideDeadzone] = useState(false);
  const [deadzonePulse, setDeadzonePulse] = useState(false);
  const deadzonePulseTimeoutRef = useRef<number | null>(null);
  const stateRef = useRef({
    active: false,
    originX: 0,
    originY: 0,
    normX: 0,
    normY: 0,
    outsideDeadzone: false,
    pointerId: null as number | null,
  });
  const callbackRef = useRef(onAimChange);
  callbackRef.current = onAimChange;

  const JOYSTICK_SIZE = 132;
  const KNOB_SIZE = 52;
  const MAX_DISTANCE = (JOYSTICK_SIZE - KNOB_SIZE) / 2;
  const DEADZONE = 0.14;
  const DEADZONE_RING_SIZE = KNOB_SIZE + MAX_DISTANCE * DEADZONE * 2;

  const emitAim = (active: boolean) => {
    callbackRef.current?.(stateRef.current.normX, stateRef.current.normY, active);
  };

  const clearDeadzonePulseTimeout = () => {
    if (deadzonePulseTimeoutRef.current !== null) {
      window.clearTimeout(deadzonePulseTimeoutRef.current);
      deadzonePulseTimeoutRef.current = null;
    }
  };

  const triggerDeadzonePulse = () => {
    clearDeadzonePulseTimeout();
    setDeadzonePulse(true);
    deadzonePulseTimeoutRef.current = window.setTimeout(() => {
      setDeadzonePulse(false);
      deadzonePulseTimeoutRef.current = null;
    }, 140);
  };

  const resetJoystick = () => {
    clearDeadzonePulseTimeout();
    stateRef.current.pointerId = null;
    stateRef.current.active = false;
    stateRef.current.normX = 0;
    stateRef.current.normY = 0;
    stateRef.current.outsideDeadzone = false;
    setIsActive(false);
    setIsOutsideDeadzone(false);
    setDeadzonePulse(false);
    setJoystickPos({ x: 0, y: 0 });
    emitAim(false);
  };

  const updateJoystickFromClientPoint = (clientX: number, clientY: number) => {
    const dx = clientX - stateRef.current.originX;
    const dy = clientY - stateRef.current.originY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      const clampedDistance = Math.min(distance, MAX_DISTANCE);
      const rawMagnitude = clampedDistance / MAX_DISTANCE;
      const normalizedDx = dx / distance;
      const normalizedDy = dy / distance;
      const outsideDeadzone = rawMagnitude > DEADZONE;
      const adjustedMagnitude = rawMagnitude <= DEADZONE
        ? 0
        : (rawMagnitude - DEADZONE) / (1 - DEADZONE);
      const normX = normalizedDx * adjustedMagnitude;
      const normY = normalizedDy * adjustedMagnitude;

      stateRef.current.normX = normX;
      stateRef.current.normY = normY;

      setJoystickPos({
        x: normalizedDx * clampedDistance,
        y: normalizedDy * clampedDistance,
      });

      if (outsideDeadzone !== stateRef.current.outsideDeadzone) {
        stateRef.current.outsideDeadzone = outsideDeadzone;
        setIsOutsideDeadzone(outsideDeadzone);
        if (outsideDeadzone) {
          triggerDeadzonePulse();
        }
      }
    } else {
      stateRef.current.normX = 0;
      stateRef.current.normY = 0;
      setJoystickPos({ x: 0, y: 0 });
      if (stateRef.current.outsideDeadzone) {
        stateRef.current.outsideDeadzone = false;
        setIsOutsideDeadzone(false);
      }
    }

    emitAim(stateRef.current.active);
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (stateRef.current.pointerId !== null) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    const container = containerRef.current;
    if (!container) return;

    stateRef.current.pointerId = e.pointerId;
    container.setPointerCapture(e.pointerId);

    const rect = container.getBoundingClientRect();
    stateRef.current.originX = rect.left + rect.width / 2;
    stateRef.current.originY = rect.top + rect.height / 2;
    stateRef.current.active = true;

    updateJoystickFromClientPoint(e.clientX, e.clientY);
    setIsActive(true);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (stateRef.current.pointerId !== e.pointerId) return;
    if (!stateRef.current.active) return;

    e.preventDefault();
    e.stopPropagation();

    updateJoystickFromClientPoint(e.clientX, e.clientY);
  };

  const releasePointerCapture = (pointerId: number) => {
    const container = containerRef.current;
    if (!container) return;
    if (container.hasPointerCapture(pointerId)) {
      container.releasePointerCapture(pointerId);
    }
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (stateRef.current.pointerId !== e.pointerId) return;

    e.preventDefault();
    e.stopPropagation();

    releasePointerCapture(e.pointerId);
    resetJoystick();
  };

  const handlePointerCancel = (e: PointerEvent<HTMLDivElement>) => {
    if (stateRef.current.pointerId !== e.pointerId) return;

    e.preventDefault();
    e.stopPropagation();

    releasePointerCapture(e.pointerId);
    resetJoystick();
  };

  const handleLostPointerCapture = (e: PointerEvent<HTMLDivElement>) => {
    if (stateRef.current.pointerId !== e.pointerId) return;
    resetJoystick();
  };

  useEffect(() => {
    const handleBlur = () => {
      if (stateRef.current.active) {
        resetJoystick();
      }
    };
    window.addEventListener('blur', handleBlur);
    window.addEventListener('visibilitychange', handleBlur);
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('visibilitychange', handleBlur);
    };
  }, []);

  useEffect(() => () => {
    clearDeadzonePulseTimeout();
  }, []);

  return (
    <div
      ref={containerRef}
      className="virtual-joystick relative touch-none select-none ui-panel ui-scanlines ui-shimmer rounded-full"
      style={{ width: JOYSTICK_SIZE, height: JOYSTICK_SIZE }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handleLostPointerCapture}
    >
      <div className="absolute inset-0 rounded-full border-2"
        style={{
          borderColor: isActive ? 'rgba(245,158,11,0.58)' : 'rgba(148,163,184,0.28)',
          boxShadow: isActive
            ? '0 0 34px rgba(245,158,11,0.22), inset 0 0 0 1px rgba(245,158,11,0.15)'
            : '0 0 18px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.05)',
        }}
      />

      <div className="absolute inset-[12px] rounded-full border"
        style={{
          borderColor: isActive ? 'rgba(34,211,238,0.36)' : 'rgba(148,163,184,0.18)',
          background:
            'radial-gradient(circle at 30% 30%, rgba(245,158,11,0.12) 0%, rgba(2,6,23,0.45) 55%, rgba(0,0,0,0.25) 100%)',
        }}
      />

      <div
        className="absolute rounded-full border pointer-events-none"
        style={{
          width: 30,
          height: 30,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          borderColor: isActive ? 'rgba(245,158,11,0.55)' : 'rgba(148,163,184,0.25)',
          boxShadow: isActive ? '0 0 18px rgba(245,158,11,0.2)' : 'none',
        }}
      />

      {/* Deadzone ring: when knob stays inside, aim/fire vector remains zero */}
      <div
        className="absolute rounded-full border pointer-events-none"
        style={{
          width: DEADZONE_RING_SIZE,
          height: DEADZONE_RING_SIZE,
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${deadzonePulse ? 1.08 : 1})`,
          transition: 'transform 120ms ease-out, border-color 120ms ease-out, box-shadow 120ms ease-out',
          borderStyle: 'dashed',
          borderColor: deadzonePulse
            ? 'rgba(34,211,238,0.75)'
            : isOutsideDeadzone
              ? 'rgba(245,158,11,0.58)'
              : isActive
                ? 'rgba(245,158,11,0.42)'
                : 'rgba(148,163,184,0.25)',
          boxShadow: deadzonePulse
            ? '0 0 20px rgba(34,211,238,0.24)'
            : isOutsideDeadzone
              ? '0 0 14px rgba(245,158,11,0.22)'
              : isActive
                ? '0 0 12px rgba(245,158,11,0.14)'
                : 'none',
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="ui-mono text-[10px] tracking-[0.24em] text-white/35">AIM</div>
      </div>

      <div
        className="absolute rounded-full transition-transform duration-75"
        style={{
          width: KNOB_SIZE,
          height: KNOB_SIZE,
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${joystickPos.x}px), calc(-50% + ${joystickPos.y}px))`,
          background: isActive
            ? 'radial-gradient(circle at 30% 30%, rgba(226,232,240,0.95), rgba(245,158,11,0.85), rgba(2,6,23,0.85))'
            : 'radial-gradient(circle at 30% 30%, rgba(148,163,184,0.85), rgba(15,23,42,0.9), rgba(2,6,23,0.9))',
          boxShadow: isActive
            ? '0 0 30px rgba(245,158,11,0.34), 0 0 62px rgba(34,211,238,0.12), inset 0 1px 0 rgba(255,255,255,0.25)'
            : '0 10px 20px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)',
          border: isActive ? '2px solid rgba(245,158,11,0.35)' : '2px solid rgba(148,163,184,0.25)',
        }}
      />
    </div>
  );
}

export default function ControlsOverlay({ onControlChange, onJoystickChange, onAimChange }: ControlsOverlayProps) {
  void onControlChange;

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Joystick area (left side) */}
      <div className="pointer-events-auto absolute left-4 bottom-24">
        <VirtualJoystick onJoystickChange={onJoystickChange} />
      </div>

      {/* Aim joystick (right side) - only on mobile */}
      <div className="pointer-events-auto absolute right-4 bottom-24 md:hidden">
        <AimJoystick onAimChange={onAimChange} />
      </div>

      {/* Mobile hint at bottom */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden">
        <div className="ui-panel ui-scanlines ui-shimmer rounded-full px-5 py-2 text-[11px] text-slate-300/70 border border-slate-300/15">
          <span className="ui-mono">MOVE</span> left · <span className="ui-mono">AIM/FIRE</span> right
        </div>
      </div>
    </div>
  );
}
