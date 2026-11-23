import { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Copy,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import {
  BREW_PRESETS,
  computeExtractionMetrics,
  type BrewPreset,
} from '../data/roasteryData';
import { formatClock, useBrewTimer } from '../hooks/useBrewTimer';

interface ExtractionLabProps {
  externalPresetId: string | null;
}

export function ExtractionLab({ externalPresetId }: ExtractionLabProps) {
  const [activePreset, setActivePreset] = useState<BrewPreset>(BREW_PRESETS[0]);
  const [doseG, setDoseG] = useState(BREW_PRESETS[0].doseG);
  const [ratio, setRatio] = useState(BREW_PRESETS[0].ratio);
  const [tempC, setTempC] = useState(BREW_PRESETS[0].tempC);
  const [grindMicrons, setGrindMicrons] = useState(BREW_PRESETS[0].grindMicrons);
  const [copied, setCopied] = useState(false);

  const timer = useBrewTimer(activePreset.stages);

  const applyPreset = (preset: BrewPreset) => {
    setActivePreset(preset);
    setDoseG(preset.doseG);
    setRatio(preset.ratio);
    setTempC(preset.tempC);
    setGrindMicrons(preset.grindMicrons);
    timer.reset();
  };

  useEffect(() => {
    if (!externalPresetId) return;
    const found = BREW_PRESETS.find((p) => p.id === externalPresetId);
    if (found) {
      applyPreset(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalPresetId]);

  const metrics = computeExtractionMetrics(doseG, ratio, tempC, grindMicrons);

  // Dynamic SVG extraction curve points (viewBox 0 0 560 220)
  const curvePeakY = Math.max(28, Math.min(175, 200 - (metrics.ey - 14) * 15));
  const controlX1 = 150 - (620 - grindMicrons) * 0.12;
  const controlY1 = curvePeakY + 32;
  const svgPath = `M 24 196 C ${Math.round(controlX1)} ${Math.round(controlY1)}, 340 ${Math.round(
    curvePeakY - 10
  )}, 536 ${Math.round(curvePeakY)}`;

  // Playhead X along curve
  const playX = 24 + (timer.progressPct / 100) * 512;
  const playT = timer.progressPct / 100;
  const playY =
    Math.pow(1 - playT, 2) * 196 +
    2 * (1 - playT) * playT * (curvePeakY + 12) +
    Math.pow(playT, 2) * curvePeakY;

  const handleCopyRecipe = async () => {
    const lines = [
      `KINETIC ORIGIN — ${activePreset.name} (${activePreset.brewer})`,
      `Dose: ${doseG}g | Water: ${metrics.totalWaterMl}ml (1:${ratio}) | Temp: ${tempC}°C | Grind: ${grindMicrons}μm`,
      `Est. Yield: ${metrics.ey}% EY | ${metrics.tds}% TDS (${metrics.diagnosis.label})`,
      ...activePreset.stages.map(
        (s, i) =>
          `${i + 1}. ${s.name} (${s.durationSec}s) -> ${Math.round(
            metrics.totalWaterMl * s.targetRatioPct
          )}g — ${s.note}`
      ),
    ].join('\n');

    try {
      await navigator.clipboard.writeText(lines);
    } catch {
      // Fallback for non-secure contexts
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="lab" className="border-b border-[#1A1614]/12 py-20 md:py-28">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="font-mono-tab text-xs font-medium text-[#B85028]">
              02 / INTERACTIVE EXTRACTION LAB
            </p>
            <h2 className="font-display mt-3 text-[clamp(2.1rem,4.2vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.025em] text-[#1A1614]">
              Dial your pour before water hits the bed.
            </h2>
          </div>

          <button
            type="button"
            onClick={handleCopyRecipe}
            className="inline-flex items-center gap-2 self-start rounded-full border border-[#1A1614]/20 bg-[#EAE3D7] px-4 py-2.5 text-xs font-semibold text-[#1A1614] transition-colors duration-200 hover:border-[#1A1614] hover:bg-[#1A1614] hover:text-[#F4F0E8] lg:self-end"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#2F4F3E]" />
                <span>Recipe Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Brew Sheet</span>
              </>
            )}
          </button>
        </div>

        {/* Preset Selector Bar */}
        <div className="mt-8 flex flex-wrap gap-2.5" role="group" aria-label="Brew recipe presets">
          {BREW_PRESETS.map((preset) => {
            const isSelected = preset.id === activePreset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#1A1614] text-[#F4F0E8] shadow-sm'
                    : 'border border-[#1A1614]/15 bg-[#EAE3D7]/70 text-[#1A1614] hover:border-[#B85028]'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>

        {/* Main 12-Col Asymmetric Lab Workspace */}
        <div className="mt-8 grid grid-cols-1 gap-7 lg:grid-cols-12">
          {/* Left: Parameter Sliders */}
          <div className="reveal-panel rounded-[26px] border border-[#1A1614]/12 bg-[#EAE3D7] p-6 md:p-7 lg:col-span-5">
            <div className="flex items-center justify-between border-b border-[#1A1614]/10 pb-4">
              <div>
                <p className="font-display text-xl font-medium text-[#1A1614]">
                  {activePreset.brewer}
                </p>
                <p className="mt-0.5 text-xs text-[#5C524B]">{activePreset.description}</p>
              </div>
              <SlidersHorizontal className="h-5 w-5 shrink-0 text-[#B85028]" />
            </div>

            <div className="mt-6 space-y-6">
              {/* Dose Slider */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="slider-dose" className="text-sm font-medium text-[#1A1614]">
                    Coffee Dose
                  </label>
                  <span className="font-mono-tab text-sm font-semibold text-[#B85028]">
                    {doseG} g
                  </span>
                </div>
                <input
                  id="slider-dose"
                  type="range"
                  min={12}
                  max={24}
                  step={1}
                  value={doseG}
                  onChange={(e) => setDoseG(Number(e.target.value))}
                  className="kinetic-slider"
                />
                <div className="font-mono-tab mt-1 flex justify-between text-[11px] text-[#5C524B]">
                  <span>12g solo</span>
                  <span>24g carafe</span>
                </div>
              </div>

              {/* Ratio Slider */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="slider-ratio" className="text-sm font-medium text-[#1A1614]">
                    Brew Ratio
                  </label>
                  <span className="font-mono-tab text-sm font-semibold text-[#B85028]">
                    1 : {ratio.toFixed(1)} ({metrics.totalWaterMl} ml)
                  </span>
                </div>
                <input
                  id="slider-ratio"
                  type="range"
                  min={12}
                  max={18}
                  step={0.5}
                  value={ratio}
                  onChange={(e) => setRatio(Number(e.target.value))}
                  className="kinetic-slider"
                />
                <div className="font-mono-tab mt-1 flex justify-between text-[11px] text-[#5C524B]">
                  <span>1:12 intense</span>
                  <span>1:18 tea-like</span>
                </div>
              </div>

              {/* Water Temp Slider */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="slider-temp" className="text-sm font-medium text-[#1A1614]">
                    Water Temperature
                  </label>
                  <span className="font-mono-tab text-sm font-semibold text-[#B85028]">
                    {tempC}°C
                  </span>
                </div>
                <input
                  id="slider-temp"
                  type="range"
                  min={86}
                  max={96}
                  step={1}
                  value={tempC}
                  onChange={(e) => setTempC(Number(e.target.value))}
                  className="kinetic-slider"
                />
                <div className="font-mono-tab mt-1 flex justify-between text-[11px] text-[#5C524B]">
                  <span>86°C dark/natural</span>
                  <span>96°C dense light</span>
                </div>
              </div>

              {/* Grind Microns Slider */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="slider-grind" className="text-sm font-medium text-[#1A1614]">
                    Grind Particle Size
                  </label>
                  <span className="font-mono-tab text-sm font-semibold text-[#B85028]">
                    {grindMicrons} μm
                  </span>
                </div>
                <input
                  id="slider-grind"
                  type="range"
                  min={420}
                  max={900}
                  step={20}
                  value={grindMicrons}
                  onChange={(e) => setGrindMicrons(Number(e.target.value))}
                  className="kinetic-slider"
                />
                <div className="font-mono-tab mt-1 flex justify-between text-[11px] text-[#5C524B]">
                  <span>420μm fine</span>
                  <span>900μm coarse</span>
                </div>
              </div>
            </div>

            {/* Real-time Diagnosis Card */}
            <div className="mt-7 rounded-2xl border border-[#1A1614]/12 bg-[#F4F0E8] p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#5C524B]">Sensory Diagnosis</span>
                <span
                  className={`font-mono-tab rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    metrics.diagnosis.tone === 'optimal'
                      ? 'bg-[#2F4F3E] text-[#F4F0E8]'
                      : 'bg-[#B85028] text-[#F4F0E8]'
                  }`}
                >
                  {metrics.diagnosis.label}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#5C524B]">
                {metrics.diagnosis.advice}
              </p>
            </div>
          </div>

          {/* Right: Live Curve + Multi-Stage Brew Timer */}
          <div className="reveal-panel flex flex-col gap-6 lg:col-span-7">
            {/* Telemetry & Live SVG Curve */}
            <div className="rounded-[26px] border border-[#1A1614]/12 bg-[#F4F0E8] p-6">
              <div className="grid grid-cols-3 gap-4 border-b border-[#1A1614]/10 pb-5">
                <div>
                  <span className="text-xs text-[#5C524B]">Total Water</span>
                  <p className="font-mono-tab mt-1 text-2xl font-semibold text-[#1A1614]">
                    {metrics.totalWaterMl} <span className="text-sm font-normal">ml</span>
                  </p>
                </div>
                <div>
                  <span className="text-xs text-[#5C524B]">Extraction Yield</span>
                  <p className="font-mono-tab mt-1 text-2xl font-semibold text-[#2F4F3E]">
                    {metrics.ey}%
                  </p>
                </div>
                <div>
                  <span className="text-xs text-[#5C524B]">Strength (TDS)</span>
                  <p className="font-mono-tab mt-1 text-2xl font-semibold text-[#B85028]">
                    {metrics.tds}%
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs text-[#5C524B]">
                  <span>Real-time Extraction Curve</span>
                  <span className="font-mono-tab">Sweet Spot Band: 19.0% – 21.5% EY</span>
                </div>
                <svg
                  viewBox="0 0 560 220"
                  className="h-44 w-full overflow-visible rounded-2xl bg-[#EAE3D7]/60 p-2"
                  role="img"
                  aria-label={`Extraction curve predicting ${metrics.ey}% yield and ${metrics.tds}% TDS`}
                >
                  {/* Optimal band */}
                  <rect x="24" y="62" width="512" height="44" rx="6" fill="#2F4F3E" fillOpacity="0.11" />
                  <line x1="24" y1="62" x2="536" y2="62" stroke="#2F4F3E" strokeDasharray="4 4" strokeOpacity="0.45" />
                  <line x1="24" y1="106" x2="536" y2="106" stroke="#2F4F3E" strokeDasharray="4 4" strokeOpacity="0.45" />
                  <text x="32" y="56" fontSize="10" fill="#2F4F3E" className="font-mono-tab">
                    OPTIMAL CLARITY ZONE
                  </text>

                  {/* Dynamic curve */}
                  <path
                    d={svgPath}
                    fill="none"
                    stroke="#B85028"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Live timer playhead */}
                  <circle cx={playX} cy={playY} r="7" fill="#1A1614" stroke="#F4F0E8" strokeWidth="2.5" />
                </svg>
              </div>
            </div>

            {/* Live Multi-Stage Brew Timer */}
            <div className="rounded-[26px] border border-[#1A1614]/15 bg-[#1A1614] p-6 text-[#F4F0E8]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="font-mono-tab text-xs text-[#F4F0E8]/65">
                    LIVE POUR GUIDE • STAGE {timer.stageIndex + 1}/{activePreset.stages.length}
                  </span>
                  <div className="mt-1 flex items-baseline gap-3">
                    <span className="font-mono-tab text-4xl font-semibold tracking-tight sm:text-5xl">
                      {formatClock(timer.elapsedSec)}
                    </span>
                    <span className="font-mono-tab text-sm text-[#F4F0E8]/60">
                      / {formatClock(timer.totalSec)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={timer.toggleRun}
                    className="inline-flex items-center gap-2 rounded-full bg-[#B85028] px-5 py-2.5 text-sm font-semibold text-[#F4F0E8] transition-transform duration-150 hover:bg-[#9B411E] active:scale-95"
                  >
                    {timer.isRunning ? (
                      <>
                        <Pause className="h-4 w-4" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        <span>{timer.isFinished ? 'Brew Again' : 'Start Pour'}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={timer.nextStage}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#F4F0E8]/20 text-[#F4F0E8] transition-colors hover:bg-[#F4F0E8]/10"
                    title="Jump to next pour stage"
                    aria-label="Next pour stage"
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={timer.reset}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#F4F0E8]/20 text-[#F4F0E8] transition-colors hover:bg-[#F4F0E8]/10"
                    title="Reset timer"
                    aria-label="Reset timer"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => timer.setChimeEnabled(!timer.chimeEnabled)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#F4F0E8]/20 text-[#F4F0E8] transition-colors hover:bg-[#F4F0E8]/10"
                    title={timer.chimeEnabled ? 'Mute stage chime' : 'Enable stage chime'}
                    aria-label={timer.chimeEnabled ? 'Mute stage chime' : 'Enable stage chime'}
                  >
                    {timer.chimeEnabled ? (
                      <Volume2 className="h-4 w-4 text-[#B85028]" />
                    ) : (
                      <VolumeX className="h-4 w-4 text-[#F4F0E8]/50" />
                    )}
                  </button>
                </div>
              </div>

              {/* Active Stage Progress Bar */}
              <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-[#F4F0E8]/15">
                <div
                  className="h-full rounded-full bg-[#B85028] transition-all duration-300"
                  style={{ width: `${timer.progressPct}%` }}
                />
              </div>

              {/* Stage List */}
              <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {activePreset.stages.map((stage, idx) => {
                  const isCurrent = idx === timer.stageIndex && !timer.isFinished;
                  const targetWeight = Math.round(metrics.totalWaterMl * stage.targetRatioPct);
                  return (
                    <div
                      key={stage.name}
                      className={`rounded-xl border p-3 transition-colors ${
                        isCurrent
                          ? 'border-[#B85028] bg-[#F4F0E8]/10'
                          : 'border-[#F4F0E8]/10 bg-[#F4F0E8]/[0.03]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#F4F0E8]">
                          {idx + 1}. {stage.name}
                        </span>
                        <span className="font-mono-tab text-xs text-[#B85028]">
                          → {targetWeight}g ({stage.durationSec}s)
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] leading-snug text-[#F4F0E8]/65">{stage.note}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
