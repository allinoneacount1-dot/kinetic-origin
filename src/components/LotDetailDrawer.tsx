import { useEffect, useState } from 'react';
import { X, Plus, FlaskConical, Mountain, Flame } from 'lucide-react';
import { formatIdr, type GrindOption, type MicroLot } from '../data/roasteryData';

interface LotDetailDrawerProps {
  lot: MicroLot | null;
  onClose: () => void;
  onAddToBag: (lot: MicroLot, grind: GrindOption) => void;
  onLoadRecipe: (presetId: string) => void;
}

const GRINDS: GrindOption[] = ['Whole Bean', 'Pour-Over', 'Espresso'];

export function LotDetailDrawer({
  lot,
  onClose,
  onAddToBag,
  onLoadRecipe,
}: LotDetailDrawerProps) {
  const [grind, setGrind] = useState<GrindOption>('Whole Bean');

  useEffect(() => {
    if (!lot) return;
    setGrind('Whole Bean');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lot, onClose]);

  if (!lot) return null;

  const sensoryBars = [
    { label: 'Acidity', value: lot.sensory.acidity },
    { label: 'Sweetness', value: lot.sensory.sweetness },
    { label: 'Body', value: lot.sensory.body },
    { label: 'Clarity', value: lot.sensory.clarity },
    { label: 'Finish', value: lot.sensory.finish },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1A1614]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={`${lot.name} sensory sheet`}
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-[#1A1614]/15 bg-[#F4F0E8] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#1A1614]/12 bg-[#F4F0E8]/95 px-6 py-4 backdrop-blur-md">
          <div>
            <span className="font-mono-tab text-[11px] font-semibold text-[#B85028]">
              SENSORY DOSSIER
            </span>
            <h3 className="font-display text-xl font-medium text-[#1A1614]">{lot.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#1A1614]/15 bg-[#EAE3D7] text-[#1A1614] transition-colors hover:bg-[#1A1614] hover:text-[#F4F0E8]"
            aria-label="Close sensory sheet"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-6 p-6">
          <div className="overflow-hidden rounded-2xl border border-[#1A1614]/12 bg-[#EAE3D7]">
            <img
              src={lot.image}
              alt={`${lot.name} roasted coffee lot`}
              className="h-52 w-full object-cover"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-[#1A1614]/12 bg-[#EAE3D7] p-4">
            <div>
              <span className="flex items-center gap-1 text-[11px] text-[#5C524B]">
                <Mountain className="h-3 w-3 text-[#B85028]" /> Altitude
              </span>
              <p className="font-mono-tab mt-0.5 text-sm font-semibold text-[#1A1614]">
                {lot.elevationM} m
              </p>
            </div>
            <div>
              <span className="flex items-center gap-1 text-[11px] text-[#5C524B]">
                <Flame className="h-3 w-3 text-[#B85028]" /> Roast
              </span>
              <p className="mt-0.5 text-sm font-semibold text-[#1A1614]">{lot.roastLevel}</p>
            </div>
            <div>
              <span className="text-[11px] text-[#5C524B]">SCA Score</span>
              <p className="font-mono-tab mt-0.5 text-sm font-semibold text-[#2F4F3E]">
                {lot.cuppingScore}
              </p>
            </div>
          </div>

          <div>
            <p className="font-mono-tab text-[11px] text-[#5C524B]">
              {lot.region} • {lot.varietal} • {lot.roastDate}
            </p>
            <p className="mt-2.5 text-sm leading-relaxed text-[#1A1614]">{lot.story}</p>
          </div>

          {/* Sensory Profile Bars */}
          <div className="rounded-2xl border border-[#1A1614]/12 bg-[#EAE3D7]/70 p-5">
            <h4 className="font-mono-tab text-xs font-semibold text-[#1A1614]">
              CUPPING PROFILE (0–100)
            </h4>
            <div className="mt-4 space-y-3">
              {sensoryBars.map((bar) => (
                <div key={bar.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-medium text-[#1A1614]">{bar.label}</span>
                    <span className="font-mono-tab font-semibold text-[#B85028]">{bar.value}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1A1614]/12">
                    <div
                      className="h-full rounded-full bg-[#1A1614]"
                      style={{ width: `${bar.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grind Selector */}
          <div>
            <span className="text-xs font-semibold text-[#5C524B]">Select Grind Profile</span>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {GRINDS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrind(g)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                    grind === g
                      ? 'border-[#1A1614] bg-[#1A1614] text-[#F4F0E8]'
                      : 'border-[#1A1614]/15 bg-[#EAE3D7] text-[#1A1614] hover:border-[#B85028]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#1A1614]/12 bg-[#F4F0E8] p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-[#5C524B]">{lot.weightG}g • Roasted to order</span>
            <span className="font-mono-tab text-lg font-semibold text-[#1A1614]">
              {formatIdr(lot.priceIdr)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                onLoadRecipe(lot.recommendedPresetId);
                onClose();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1A1614]/20 bg-[#EAE3D7] px-4 py-3 text-xs font-semibold text-[#1A1614] transition-colors hover:bg-[#1A1614] hover:text-[#F4F0E8]"
            >
              <FlaskConical className="h-3.5 w-3.5" />
              <span>Dial in Lab</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onAddToBag(lot, grind);
                onClose();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B85028] px-4 py-3 text-xs font-semibold text-[#F4F0E8] transition-colors hover:bg-[#9B411E]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add to Bag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
