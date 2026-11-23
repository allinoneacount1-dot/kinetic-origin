import { useState } from 'react';
import { Compass, Droplets, Layers, Award } from 'lucide-react';
import { TERROIR_ORIGINS } from '../data/roasteryData';

const MANIFESTO_LINES = [
  'Coffee is not a commodity.',
  'It is volcanic soil, mountain fog,',
  'and two minutes of measured gravity.',
];

export function Manifesto() {
  const [selectedId, setSelectedId] = useState(TERROIR_ORIGINS[0].id);
  const current = TERROIR_ORIGINS.find((t) => t.id === selectedId) ?? TERROIR_ORIGINS[0];

  return (
    <section
      id="manifesto"
      className="border-b border-[#1A1614]/12 py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        {/* Kinetic Scroll-Revealed Manifesto */}
        <div className="max-w-4xl">
          <p className="font-mono-tab mb-5 text-xs font-medium text-[#B85028]">
            01 / THE HIGHLAND THESIS
          </p>
          <div className="space-y-1">
            {MANIFESTO_LINES.map((line, idx) => (
              <p
                key={idx}
                className="kinetic-line font-display text-[clamp(2rem,4.5vw,3.75rem)] font-medium leading-[1.08] tracking-[-0.025em] text-[#1A1614]"
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Interactive Terroir Coordinate Explorer */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <div className="flex flex-col gap-2.5" role="tablist" aria-label="Sumatra coffee origins">
              {TERROIR_ORIGINS.map((origin) => {
                const active = origin.id === current.id;
                return (
                  <button
                    key={origin.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedId(origin.id)}
                    className={`group flex items-center justify-between rounded-2xl border p-4 text-left transition-all duration-200 ${
                      active
                        ? 'border-[#1A1614] bg-[#1A1614] text-[#F4F0E8]'
                        : 'border-[#1A1614]/12 bg-[#EAE3D7]/60 text-[#1A1614] hover:border-[#B85028]'
                    }`}
                  >
                    <div>
                      <span className="font-display text-xl font-medium block">{origin.name}</span>
                      <span
                        className={`font-mono-tab mt-0.5 block text-xs ${
                          active ? 'text-[#F4F0E8]/75' : 'text-[#5C524B]'
                        }`}
                      >
                        {origin.coordinates}
                      </span>
                    </div>
                    <span
                      className={`font-mono-tab rounded-full px-3 py-1 text-xs font-semibold ${
                        active
                          ? 'bg-[#B85028] text-[#F4F0E8]'
                          : 'bg-[#F4F0E8] text-[#1A1614]'
                      }`}
                    >
                      {origin.elevation.split(' ')[0]}m+
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-[#1A1614]/12 bg-[#EAE3D7] p-6">
              <p className="text-sm leading-relaxed text-[#1A1614]">{current.narrative}</p>

              <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-[#1A1614]/12 pt-5">
                <div>
                  <dt className="flex items-center gap-1.5 text-xs text-[#5C524B]">
                    <Compass className="h-3.5 w-3.5 text-[#B85028]" />
                    <span>Altitude</span>
                  </dt>
                  <dd className="font-mono-tab mt-1 text-sm font-semibold text-[#1A1614]">
                    {current.elevation}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-xs text-[#5C524B]">
                    <Droplets className="h-3.5 w-3.5 text-[#B85028]" />
                    <span>Rainfall</span>
                  </dt>
                  <dd className="font-mono-tab mt-1 text-sm font-semibold text-[#1A1614]">
                    {current.rainfall}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-xs text-[#5C524B]">
                    <Layers className="h-3.5 w-3.5 text-[#B85028]" />
                    <span>Soil Profile</span>
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-[#1A1614]">{current.soil}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-xs text-[#5C524B]">
                    <Award className="h-3.5 w-3.5 text-[#2F4F3E]" />
                    <span>Season Avg</span>
                  </dt>
                  <dd className="font-mono-tab mt-1 text-sm font-semibold text-[#2F4F3E]">
                    {current.cuppingAvg}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="reveal-panel overflow-hidden rounded-[28px] border border-[#1A1614]/12 bg-[#EAE3D7]">
              <img
                src={current.image}
                alt={`${current.name} highland coffee origin`}
                className="h-[360px] w-full object-cover transition-opacity duration-300 sm:h-[460px]"
              />
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#1A1614]/10 bg-[#F4F0E8] px-6 py-4">
                <div>
                  <span className="font-mono-tab text-xs text-[#5C524B]">PRIMARY CULTIVARS</span>
                  <p className="text-sm font-semibold text-[#1A1614]">{current.varietals}</p>
                </div>
                <span className="font-mono-tab rounded-full border border-[#1A1614]/15 bg-[#EAE3D7] px-3 py-1 text-xs text-[#1A1614]">
                  Direct Trade Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
