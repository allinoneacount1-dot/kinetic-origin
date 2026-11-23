import { useMemo, useState } from 'react';
import { ArrowUpRight, Plus, Sliders } from 'lucide-react';
import {
  formatIdr,
  MICRO_LOTS,
  type GrindOption,
  type MicroLot,
  type ProcessType,
} from '../data/roasteryData';

interface MicroLotCatalogueProps {
  onAddToBag: (lot: MicroLot, grind: GrindOption) => void;
  onInspectLot: (lot: MicroLot) => void;
}

const PROCESSES: ('All' | ProcessType)[] = ['All', 'Washed', 'Honey', 'Natural', 'Anaerobic'];
const GRINDS: GrindOption[] = ['Whole Bean', 'Pour-Over', 'Espresso'];

export function MicroLotCatalogue({ onAddToBag, onInspectLot }: MicroLotCatalogueProps) {
  const [filter, setFilter] = useState<'All' | ProcessType>('All');
  const [sortBy, setSortBy] = useState<'score' | 'price' | 'elevation'>('score');
  const [selectedGrinds, setSelectedGrinds] = useState<Record<string, GrindOption>>({});

  const filteredLots = useMemo(() => {
    const base = filter === 'All' ? MICRO_LOTS : MICRO_LOTS.filter((l) => l.process === filter);
    return [...base].sort((a, b) => {
      if (sortBy === 'score') return b.cuppingScore - a.cuppingScore;
      if (sortBy === 'price') return a.priceIdr - b.priceIdr;
      return b.elevationM - a.elevationM;
    });
  }, [filter, sortBy]);

  const getGrind = (lotId: string): GrindOption => selectedGrinds[lotId] ?? 'Whole Bean';

  return (
    <section id="lots" className="border-b border-[#1A1614]/12 py-20 md:py-28">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="font-mono-tab text-xs font-medium text-[#B85028]">
              03 / SEASONAL MICRO-LOTS
            </p>
            <h2 className="font-display mt-3 text-[clamp(2.1rem,4.2vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.025em] text-[#1A1614]">
              Small-batch harvests, roasted to order.
            </h2>
          </div>

          <div className="flex items-center gap-2.5 self-start lg:self-end">
            <Sliders className="h-4 w-4 text-[#5C524B]" />
            <label htmlFor="lot-sort" className="sr-only">
              Sort micro-lots
            </label>
            <select
              id="lot-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'score' | 'price' | 'elevation')}
              className="rounded-full border border-[#1A1614]/20 bg-[#EAE3D7] px-4 py-2 text-xs font-semibold text-[#1A1614]"
            >
              <option value="score">Sort: Highest SCA Score</option>
              <option value="price">Sort: Price Low to High</option>
              <option value="elevation">Sort: Highest Elevation</option>
            </select>
          </div>
        </div>

        {/* Process Filter Tabs */}
        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter by coffee process">
          {PROCESSES.map((proc) => {
            const active = filter === proc;
            return (
              <button
                key={proc}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(proc)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200 ${
                  active
                    ? 'bg-[#1A1614] text-[#F4F0E8]'
                    : 'border border-[#1A1614]/15 bg-[#EAE3D7]/60 text-[#1A1614] hover:border-[#B85028]'
                }`}
              >
                {proc}
              </button>
            );
          })}
        </div>

        {/* Asymmetric 2-column editorial catalogue (avoiding 3-equal-card SaaS grid) */}
        <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2">
          {filteredLots.map((lot) => {
            const currentGrind = getGrind(lot.id);
            return (
              <article
                key={lot.id}
                className="reveal-panel group flex flex-col overflow-hidden rounded-[26px] border border-[#1A1614]/12 bg-[#EAE3D7]/70 transition-colors duration-200 hover:border-[#1A1614]/35"
              >
                <div className="relative h-64 overflow-hidden bg-[#DDD4C3]">
                  <img
                    src={lot.image}
                    alt={`${lot.name} specialty coffee lot`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="font-mono-tab rounded-full bg-[#1A1614]/90 px-3 py-1 text-[11px] font-semibold text-[#F4F0E8]">
                      {lot.process}
                    </span>
                    <span className="font-mono-tab rounded-full bg-[#F4F0E8]/95 px-3 py-1 text-[11px] font-semibold text-[#2F4F3E]">
                      {lot.cuppingScore} SCA
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onInspectLot(lot)}
                    className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-[#F4F0E8]/95 px-3.5 py-1.5 text-xs font-semibold text-[#1A1614] shadow-sm transition-colors hover:bg-[#1A1614] hover:text-[#F4F0E8]"
                  >
                    <span>Sensory Sheet</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono-tab text-[11px] text-[#5C524B]">
                          {lot.region} • {lot.elevationM} MASL
                        </p>
                        <h3 className="font-display mt-1 text-2xl font-medium text-[#1A1614]">
                          {lot.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="font-mono-tab text-base font-semibold text-[#1A1614]">
                          {formatIdr(lot.priceIdr)}
                        </p>
                        <p className="font-mono-tab text-[11px] text-[#5C524B]">{lot.weightG}g</p>
                      </div>
                    </div>

                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {lot.tastingNotes.map((note) => (
                        <span
                          key={note}
                          className="rounded-full border border-[#1A1614]/12 bg-[#F4F0E8] px-3 py-1 text-xs font-medium text-[#1A1614]"
                        >
                          {note}
                        </span>
                      ))}
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-[#5C524B]">{lot.story}</p>
                  </div>

                  {/* Grind Selector + Add to Bag */}
                  <div className="mt-6 border-t border-[#1A1614]/10 pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-1 rounded-full bg-[#F4F0E8] p-1">
                        {GRINDS.map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() =>
                              setSelectedGrinds((prev) => ({ ...prev, [lot.id]: g }))
                            }
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                              currentGrind === g
                                ? 'bg-[#1A1614] text-[#F4F0E8]'
                                : 'text-[#5C524B] hover:text-[#1A1614]'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => onAddToBag(lot, currentGrind)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#B85028] px-4 py-2 text-xs font-semibold text-[#F4F0E8] transition-transform duration-150 hover:bg-[#9B411E] active:scale-95"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
