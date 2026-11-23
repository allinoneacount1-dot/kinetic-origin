import { ArrowDownRight, Flame, Gauge, Mountain } from 'lucide-react';

interface HeroProps {
  onOpenLab: (presetId?: string) => void;
  onExploreLots: () => void;
}

export function Hero({ onOpenLab, onExploreLots }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-[#1A1614]/12 pb-16 pt-10 md:pb-24 md:pt-16"
    >
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        {/* Asymmetric 12-col editorial grid */}
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="hero-stagger mb-6 inline-flex items-center gap-2 rounded-full border border-[#1A1614]/15 bg-[#EAE3D7] px-3.5 py-1.5 text-xs font-medium text-[#5C524B]">
              <span className="h-2 w-2 rounded-full bg-[#2F4F3E]" />
              <span>Harvest 2026 • Solok, Kerinci &amp; Aceh Gayo</span>
            </div>

            <h1 className="hero-stagger font-display text-[clamp(2.85rem,6.5vw,5.75rem)] font-medium leading-[0.96] tracking-[-0.03em] text-[#1A1614]">
              Extracted by gravity.
              <br />
              Shaped by altitude.
            </h1>

            <p className="hero-stagger mt-7 max-w-xl text-base leading-relaxed text-[#5C524B] md:text-lg">
              Small-batch Sumatra highland micro-lots roasted for transparent filter clarity. Dial in
              your exact extraction yield in our live pour-over lab, explore single-cultivar harvests,
              or reserve a seat at the cupping table.
            </p>

            <div className="hero-stagger mt-9 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => onOpenLab()}
                className="inline-flex items-center gap-2.5 rounded-full bg-[#1A1614] px-6 py-3.5 text-sm font-semibold text-[#F4F0E8] transition-transform duration-200 hover:bg-[#B85028] active:scale-95"
              >
                <span>Open Extraction Lab</span>
                <ArrowDownRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={onExploreLots}
                className="inline-flex items-center gap-2 rounded-full border border-[#1A1614]/25 bg-transparent px-6 py-3.5 text-sm font-semibold text-[#1A1614] transition-colors duration-200 hover:border-[#1A1614] hover:bg-[#EAE3D7]"
              >
                <span>Explore Harvest Lots</span>
              </button>
            </div>

            {/* Live telemetry strip */}
            <div className="hero-stagger mt-12 grid grid-cols-3 gap-4 border-t border-[#1A1614]/12 pt-6 sm:max-w-xl">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#5C524B]">
                  <Mountain className="h-3.5 w-3.5 text-[#B85028]" />
                  <span>Elevation</span>
                </div>
                <p className="font-mono-tab mt-1 text-lg font-semibold text-[#1A1614]">1,650 m</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#5C524B]">
                  <Flame className="h-3.5 w-3.5 text-[#B85028]" />
                  <span>Active Batch</span>
                </div>
                <p className="font-mono-tab mt-1 text-lg font-semibold text-[#1A1614]">#KO-2611</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#5C524B]">
                  <Gauge className="h-3.5 w-3.5 text-[#2F4F3E]" />
                  <span>Target Yield</span>
                </div>
                <p className="font-mono-tab mt-1 text-lg font-semibold text-[#1A1614]">20.4% EY</p>
              </div>
            </div>
          </div>

          {/* Right editorial photography column with parallax */}
          <div className="lg:col-span-5">
            <div className="hero-stagger relative">
              <div className="overflow-hidden rounded-[28px] border border-[#1A1614]/12 bg-[#EAE3D7]">
                <img
                  src="/images/hero-pourover.webp"
                  alt="Artisan pour-over coffee extraction into glass carafe"
                  className="hero-parallax h-[420px] w-full object-cover object-center sm:h-[520px] lg:h-[580px]"
                  loading="eager"
                />
              </div>

              {/* Actionable floating roast card */}
              <div className="mt-4 rounded-2xl border border-[#1A1614]/15 bg-[#F4F0E8]/95 p-4 shadow-lg backdrop-blur-md sm:absolute sm:-left-8 sm:bottom-6 sm:mt-0 sm:w-72">
                <div className="flex items-center justify-between">
                  <span className="font-mono-tab text-[11px] font-medium text-[#2F4F3E]">
                    FRESH OFF DRUM • 48H REST
                  </span>
                  <span className="font-mono-tab text-xs font-semibold text-[#B85028]">87.75 SCA</span>
                </div>
                <p className="font-display mt-1 text-lg font-medium text-[#1A1614]">
                  Solok Limau Cirago #04
                </p>
                <p className="mt-0.5 text-xs text-[#5C524B]">
                  Kaffir lime, white peach, crystalline cane sweetness.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenLab('v60-clarity')}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#EAE3D7] px-3.5 py-2 text-xs font-semibold text-[#1A1614] transition-colors duration-200 hover:bg-[#1A1614] hover:text-[#F4F0E8]"
                >
                  <span>Load V60 Clarity Recipe</span>
                  <ArrowDownRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
