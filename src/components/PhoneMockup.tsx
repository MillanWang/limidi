import { Fragment, useEffect, useState } from "react";

interface PhoneMockupProps {
  className?: string;
}

/**
 * Wall-clock seconds for one full 16-step pad/glow loop and for each grid
 * preset staying on screen. Larger = slower tempo; smaller = faster.
 *
 * Pad on-time is `CELL_ACTIVATION_DURATION_SEC`, scaled against
 * `REFERENCE_PATTERN_SEC`. Pass `durationSec` only for the glow envelope.
 */
const PATTERN_CYCLE_SEC = 12;
/** Bar length the pattern data was tuned against (do not change unless you retime GRIDS). */
const REFERENCE_PATTERN_SEC = 3;

/** Opacity crossfade when advancing to the next grid preset (must be < `PATTERN_CYCLE_SEC`). */
const GRID_XFADE_SEC = 0.85;

const GAP = 2;
const SCREEN_X = 42;
const SCREEN_Y = 32;
const SCREEN_W = 216;
const SCREEN_H = 536;

// In-screen header strip (blank) + pad area below.
const HEADER_H = 40;
const GRID_GAP_BELOW_HEADER = 6;
const GRID_BOTTOM_PAD = 8;
const GRID_TOP = SCREEN_Y + HEADER_H + GRID_GAP_BELOW_HEADER;
const GRID_USABLE_H = SCREEN_H - HEADER_H - GRID_GAP_BELOW_HEADER - GRID_BOTTOM_PAD;

const PHONE_CX = 150;
const PHONE_CY = 320;

// ViewBox leaves room around the phone so the glow can swell past the bezel.
const VB_X = -50;
const VB_Y = -20;
const VB_W = 400;
const VB_H = 700;

const STEPS_PER_BAR = 16;
const STEP = PATTERN_CYCLE_SEC / STEPS_PER_BAR;
const ATTACK = 0.005;
const REST = 0.15;

/** Same lit duration for every pad (glow uses its own duration in `buildKeyframes`). */
const CELL_ACTIVATION_DURATION_SEC = 0.24;

/** Hard cap on how many pads may read as lit at once (temporal overlap). */
const MAX_CONCURRENT_ACTIVE_PADS = 3;

// Single round gradient sitting behind the phone. Grows and pops in opacity
// on every grid trigger, then shrinks back to rest between hits.
const GLOW_REST_RX = 130;
const GLOW_PEAK_RX = 220;
const GLOW_REST_RY = 235;
const GLOW_PEAK_RY = 360;
const GLOW_REST_OPACITY = 0.28;
const GLOW_PEAK_OPACITY = 0.95;
// One pulse decay. Short enough that each hit reads as a distinct pulse but
// long enough to feel like a soft breath rather than a flicker.
const GLOW_PULSE_DURATION = 0.22;

interface CellPattern {
  triggers: number[];
}

interface GridConfig {
  cols: number;
  rows: number;
  color: { from: string; to: string };
  patterns: CellPattern[];
}

/**
 * Step indices (0–15) where this pad lights. Orthogonal neighbors sit on
 * different quarter-note lanes (`lane = (r + 2c + …) % 4`), checkerboard
 * parity adds offbeat pairs, and `presetIndex` rotates the map per layout.
 */
function padTriggersForCell(
  rows: number,
  cols: number,
  cellIndex: number,
  presetIndex: number,
): number[] {
  const r = Math.floor(cellIndex / cols);
  const c = cellIndex % cols;
  const edge = (r === 0 || r === rows - 1 ? 1 : 0) ^ (c === 0 || c === cols - 1 ? 1 : 0);
  const lane = (r + 2 * c + presetIndex + edge) % 4;
  const oddSlot = (r + c) % 2;

  const backbone = [0, 4, 8, 12].map((b) => (b + lane) % 16);
  const off =
    oddSlot === 0
      ? [2, 10].map((b) => (b + lane + presetIndex) % 16)
      : [6, 14].map((b) => (b + lane + presetIndex) % 16);
  const twist = (5 * r + 7 * c + 3 * presetIndex + cellIndex) % 16;

  return [...new Set([...backbone, ...off, twist])].sort((a, b) => a - b);
}

function makeRowMajorPatterns(rows: number, cols: number, presetIndex: number): CellPattern[] {
  return Array.from({ length: rows * cols }, (_, i) => ({
    triggers: padTriggersForCell(rows, cols, i, presetIndex),
  }));
}

interface PadLitInterval {
  start: number;
  end: number;
  step: number;
}

/** Lit window per trigger; matches `buildKeyframes` timing. */
function padLitIntervals(triggers: number[]): PadLitInterval[] {
  const sorted = [...triggers].sort((a, b) => a - b);
  if (sorted.length === 0) return [];
  const durationScale = PATTERN_CYCLE_SEC / REFERENCE_PATTERN_SEC;
  const scaledDuration = CELL_ACTIVATION_DURATION_SEC * durationScale;
  const out: PadLitInterval[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const tStart = sorted[i] * STEP;
    const tPeak = Math.min(PATTERN_CYCLE_SEC, tStart + ATTACK);
    const nextStart = i + 1 < sorted.length ? sorted[i + 1] * STEP : PATTERN_CYCLE_SEC;
    const naturalEnd = tStart + ATTACK + scaledDuration;
    const tEnd = Math.max(
      tPeak + 0.001,
      Math.min(naturalEnd, nextStart - 0.005, PATTERN_CYCLE_SEC),
    );
    out.push({ start: tPeak, end: tEnd, step: sorted[i] });
  }
  return out;
}

function countPadsLitAt(t: number, patterns: CellPattern[]): number {
  let n = 0;
  for (const p of patterns) {
    if (padLitIntervals(p.triggers).some(({ start, end }) => t >= start && t <= end)) n++;
  }
  return n;
}

function worstTimeAndCount(patterns: CellPattern[]): { t: number; count: number } {
  const samples = 600;
  let bestT = 0;
  let bestCount = 0;
  for (let i = 0; i <= samples; i++) {
    const tt = (i / samples) * PATTERN_CYCLE_SEC;
    const c = countPadsLitAt(tt, patterns);
    if (c > bestCount) {
      bestCount = c;
      bestT = tt;
    }
  }
  const span = PATTERN_CYCLE_SEC / samples;
  const refine = 200;
  for (let i = 0; i <= refine; i++) {
    const tt = bestT - span + (2 * span * i) / refine;
    if (tt < 0 || tt > PATTERN_CYCLE_SEC) continue;
    const c = countPadsLitAt(tt, patterns);
    if (c > bestCount) {
      bestCount = c;
      bestT = tt;
    }
  }
  return { t: bestT, count: bestCount };
}

/**
 * Drops trigger steps until coarse sampling never sees more than `maxConcurrent`
 * pads in the lit part of their opacity envelope at the same instant.
 */
function throttleConcurrentPadPatterns(
  patterns: CellPattern[],
  maxConcurrent: number,
): CellPattern[] {
  const result = patterns.map((p) => ({ triggers: [...p.triggers] }));
  const maxIters = 1200;
  for (let iter = 0; iter < maxIters; iter++) {
    const { t, count } = worstTimeAndCount(result);
    if (count <= maxConcurrent) break;

    const active: Array<{ idx: number; lit: PadLitInterval[] }> = [];
    for (let idx = 0; idx < result.length; idx++) {
      const lit = padLitIntervals(result[idx].triggers).filter(
        (iv) => t >= iv.start && t <= iv.end,
      );
      if (lit.length > 0) active.push({ idx, lit });
    }
    active.sort((a, b) => result[b.idx].triggers.length - result[a.idx].triggers.length);

    let removed = false;
    for (const { idx, lit } of active) {
      const cellTriggers = result[idx].triggers;
      for (const iv of lit) {
        if (cellTriggers.length > 1) {
          result[idx].triggers = cellTriggers.filter((s) => s !== iv.step);
          removed = true;
          break;
        }
      }
      if (removed) break;
    }

    if (!removed && active[0]?.lit[0]) {
      const idx = active[0].idx;
      const step = active[0].lit[0].step;
      result[idx].triggers = result[idx].triggers.filter((s) => s !== step);
    } else if (!removed) {
      break;
    }
  }
  return result;
}

const GRIDS: GridConfig[] = [
  {
    cols: 4,
    rows: 4,
    color: { from: "#a855f7", to: "#7c3aed" },
    patterns: throttleConcurrentPadPatterns(
      makeRowMajorPatterns(4, 4, 0),
      MAX_CONCURRENT_ACTIVE_PADS,
    ),
  },
  {
    cols: 3,
    rows: 3,
    color: { from: "#ec4899", to: "#be185d" },
    patterns: throttleConcurrentPadPatterns(
      makeRowMajorPatterns(3, 3, 1),
      MAX_CONCURRENT_ACTIVE_PADS,
    ),
  },
  {
    cols: 3,
    rows: 2,
    color: { from: "#22d3ee", to: "#0891b2" },
    patterns: throttleConcurrentPadPatterns(
      makeRowMajorPatterns(2, 3, 2),
      MAX_CONCURRENT_ACTIVE_PADS,
    ),
  },
  {
    cols: 2,
    rows: 3,
    color: { from: "#f59e0b", to: "#b45309" },
    patterns: throttleConcurrentPadPatterns(
      makeRowMajorPatterns(3, 2, 3),
      MAX_CONCURRENT_ACTIVE_PADS,
    ),
  },
  {
    cols: 2,
    rows: 2,
    color: { from: "#10b981", to: "#047857" },
    patterns: throttleConcurrentPadPatterns(
      makeRowMajorPatterns(2, 2, 4),
      MAX_CONCURRENT_ACTIVE_PADS,
    ),
  },
];

interface KeyframePattern extends CellPattern {
  /** Omit for pads — uses `CELL_ACTIVATION_DURATION_SEC`. */
  durationSec?: number;
}

function buildKeyframes(pattern: KeyframePattern) {
  const sorted = [...pattern.triggers].sort((a, b) => a - b);
  const pts: Array<[number, number]> = [[0, REST]];
  const durationScale = PATTERN_CYCLE_SEC / REFERENCE_PATTERN_SEC;
  const durationSec = pattern.durationSec ?? CELL_ACTIVATION_DURATION_SEC;
  const scaledDuration = durationSec * durationScale;

  for (let i = 0; i < sorted.length; i++) {
    const tStart = sorted[i] * STEP;
    const tPeak = Math.min(PATTERN_CYCLE_SEC, tStart + ATTACK);
    const nextStart = i + 1 < sorted.length ? sorted[i + 1] * STEP : PATTERN_CYCLE_SEC;
    const naturalEnd = tStart + ATTACK + scaledDuration;
    const tEnd = Math.max(
      tPeak + 0.001,
      Math.min(naturalEnd, nextStart - 0.005, PATTERN_CYCLE_SEC),
    );

    if (tStart > 0) pts.push([tStart, REST]);
    pts.push([tPeak, 1]);
    pts.push([tEnd, REST]);
  }

  pts.push([PATTERN_CYCLE_SEC, REST]);
  pts.sort((a, b) => a[0] - b[0]);

  return {
    keyTimes: pts
      .map(([t]) => Math.max(0, Math.min(1, t / PATTERN_CYCLE_SEC)).toFixed(5))
      .join(";"),
    values: pts.map(([, v]) => v.toString()).join(";"),
  };
}

function mapValuesToRange(values: string, low: number, high: number): string {
  const span = 1 - REST;
  return values
    .split(";")
    .map((v) => {
      const num = parseFloat(v);
      const fraction = Math.max(0, Math.min(1, (num - REST) / span));
      return (low + fraction * (high - low)).toFixed(3);
    })
    .join(";");
}

function slotGridIndex(slot: 0 | 1, visibleBuffer: 0 | 1, currentGrid: number): number {
  const next = (currentGrid + 1) % GRIDS.length;
  return slot === visibleBuffer ? currentGrid : next;
}

// Stylized iPhone mockup. Cycles through 4x4, 3x3, 3x2, 2x3, 2x2 grid
// layouts, each playing a drum pattern. Two glow layers crossfade with the
// pad grids when changing preset.
export function PhoneMockup({ className }: PhoneMockupProps) {
  const [currentGrid, setCurrentGrid] = useState(0);
  const [visibleBuffer, setVisibleBuffer] = useState<0 | 1>(0);
  const [bufOpacity, setBufOpacity] = useState<[number, number]>([1, 0]);

  useEffect(() => {
    const visibleBufRef = { current: 0 as 0 | 1 };
    const currentRef = { current: 0 };
    const fadeEndTimerRef = { current: undefined as ReturnType<typeof setTimeout> | undefined };

    const intervalId = window.setInterval(() => {
      if (fadeEndTimerRef.current !== undefined) {
        clearTimeout(fadeEndTimerRef.current);
      }

      const out = visibleBufRef.current;
      const settled: [number, number] = out === 0 ? [1, 0] : [0, 1];
      const faded: [number, number] = out === 0 ? [0, 1] : [1, 0];

      setBufOpacity(settled);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setBufOpacity(faded);
        });
      });

      fadeEndTimerRef.current = window.setTimeout(() => {
        const nextGrid = (currentRef.current + 1) % GRIDS.length;
        const nextBuf = (1 - out) as 0 | 1;
        currentRef.current = nextGrid;
        visibleBufRef.current = nextBuf;
        setCurrentGrid(nextGrid);
        setVisibleBuffer(nextBuf);
        fadeEndTimerRef.current = undefined;
      }, GRID_XFADE_SEC * 1000);
    }, PATTERN_CYCLE_SEC * 1000);

    return () => {
      clearInterval(intervalId);
      if (fadeEndTimerRef.current !== undefined) {
        clearTimeout(fadeEndTimerRef.current);
      }
    };
  }, []);

  const bufTransition = `opacity ${GRID_XFADE_SEC}s ease-in-out`;

  const renderBufferGlow = (slot: 0 | 1) => {
    const gi = slotGridIndex(slot, visibleBuffer, currentGrid);
    const grid = GRIDS[gi];
    const { patterns } = grid;
    const allTriggers = [...new Set(patterns.flatMap((p) => p.triggers))].sort((a, b) => a - b);
    const glowFrames = buildKeyframes({
      triggers: allTriggers.length ? allTriggers : [0, 8],
      durationSec: GLOW_PULSE_DURATION,
    });
    return (
      <g
        key={`glow-wrap-${slot}-${gi}`}
        style={{ opacity: bufOpacity[slot], transition: bufTransition }}
      >
        <ellipse
          cx={PHONE_CX}
          cy={PHONE_CY}
          rx={GLOW_REST_RX}
          ry={GLOW_REST_RY}
          fill={`url(#pm-glow-b${slot})`}
          opacity={GLOW_REST_OPACITY}
        >
          <animate
            attributeName="rx"
            values={mapValuesToRange(glowFrames.values, GLOW_REST_RX, GLOW_PEAK_RX)}
            keyTimes={glowFrames.keyTimes}
            dur={`${PATTERN_CYCLE_SEC}s`}
            repeatCount="indefinite"
            calcMode="linear"
          />
          <animate
            attributeName="ry"
            values={mapValuesToRange(glowFrames.values, GLOW_REST_RY, GLOW_PEAK_RY)}
            keyTimes={glowFrames.keyTimes}
            dur={`${PATTERN_CYCLE_SEC}s`}
            repeatCount="indefinite"
            calcMode="linear"
          />
          <animate
            attributeName="opacity"
            values={mapValuesToRange(glowFrames.values, GLOW_REST_OPACITY, GLOW_PEAK_OPACITY)}
            keyTimes={glowFrames.keyTimes}
            dur={`${PATTERN_CYCLE_SEC}s`}
            repeatCount="indefinite"
            calcMode="linear"
          />
        </ellipse>
      </g>
    );
  };

  const renderBufferPads = (slot: 0 | 1) => {
    const gi = slotGridIndex(slot, visibleBuffer, currentGrid);
    const grid = GRIDS[gi];
    const { cols, rows, patterns } = grid;
    const cellW = (SCREEN_W - (cols - 1) * GAP) / cols;
    const cellH = (GRID_USABLE_H - (rows - 1) * GAP) / rows;
    const cellRx = Math.max(3, Math.min(cellW, cellH) * 0.1);

    return (
      <g
        key={`pads-${slot}-${gi}`}
        style={{ opacity: bufOpacity[slot], transition: bufTransition }}
      >
        {patterns.map((pattern, idx) => {
          const row = Math.floor(idx / cols);
          const col = idx % cols;
          const x = SCREEN_X + col * (cellW + GAP);
          const y = GRID_TOP + row * (cellH + GAP);
          const { keyTimes, values } = buildKeyframes(pattern);
          return (
            <rect
              key={`${slot}-${gi}-${idx}`}
              x={x}
              y={y}
              width={cellW}
              height={cellH}
              rx={cellRx}
              fill={`url(#pm-color-b${slot})`}
              opacity={REST}
            >
              <animate
                attributeName="opacity"
                dur={`${PATTERN_CYCLE_SEC}s`}
                repeatCount="indefinite"
                keyTimes={keyTimes}
                values={values}
                calcMode="linear"
              />
            </rect>
          );
        })}
      </g>
    );
  };

  const incoming = (1 - visibleBuffer) as 0 | 1;
  const glowPaintOrder = [incoming, visibleBuffer] as const;
  const padPaintOrder = [incoming, visibleBuffer] as const;

  return (
    <svg
      viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
      className={className}
      role="img"
      aria-label="LiMIDI mobile app cycling through MIDI pad grids with a glowing pulse behind the phone"
    >
      <defs>
        <linearGradient id="pm-bezel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a1a26" />
          <stop offset="100%" stopColor="#0a0a12" />
        </linearGradient>
        {([0, 1] as const).map((slot) => {
          const gi = slotGridIndex(slot, visibleBuffer, currentGrid);
          const { color } = GRIDS[gi];
          return (
            <Fragment key={`pm-grad-b${slot}-${gi}`}>
              <radialGradient id={`pm-glow-b${slot}`} cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor={color.from} stopOpacity="0.95" />
                <stop offset="45%" stopColor={color.to} stopOpacity="0.4" />
                <stop offset="100%" stopColor={color.to} stopOpacity="0" />
              </radialGradient>
              <linearGradient id={`pm-color-b${slot}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={color.from} />
                <stop offset="100%" stopColor={color.to} />
              </linearGradient>
            </Fragment>
          );
        })}
        <clipPath id="pm-screen-clip">
          <rect x={SCREEN_X} y={SCREEN_Y} width={SCREEN_W} height={SCREEN_H} rx={26} />
        </clipPath>
      </defs>

      {glowPaintOrder.map((slot) => renderBufferGlow(slot))}

      <rect
        x="30"
        y="20"
        width="240"
        height="560"
        rx="36"
        fill="url(#pm-bezel)"
        stroke="#2a2a3a"
        strokeWidth="2"
      />

      <rect x={SCREEN_X} y={SCREEN_Y} width={SCREEN_W} height={SCREEN_H} rx={26} fill="#0a0a12" />

      <g clipPath="url(#pm-screen-clip)">
        <rect x={SCREEN_X} y={SCREEN_Y} width={SCREEN_W} height={HEADER_H} fill="#12121c" />
        <line
          x1={SCREEN_X}
          y1={SCREEN_Y + HEADER_H}
          x2={SCREEN_X + SCREEN_W}
          y2={SCREEN_Y + HEADER_H}
          stroke="#2a2a3a"
          strokeWidth="1"
        />
        {padPaintOrder.map((slot) => renderBufferPads(slot))}
      </g>

      <rect x="120" y="40" width="60" height="14" rx="7" fill="#000" />

      <rect x="120" y="556" width="60" height="4" rx="2" fill="#2a2a3a" />
    </svg>
  );
}
