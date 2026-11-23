import { ShoppingBag, Sparkles, PauseCircle, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  activeSection: string;
  bagCount: number;
  fullMotion: boolean;
  onToggleMotion: () => void;
  onOpenBag: () => void;
  onNavigate: (sectionId: string) => void;
}

const NAV_ITEMS = [
  { id: 'manifesto', label: 'Origin' },
  { id: 'lab', label: 'Extraction Lab' },
  { id: 'lots', label: 'Micro-Lots' },
  { id: 'cupping', label: 'Cupping Table' },
];

export function Navbar({
  activeSection,
  bagCount,
  fullMotion,
  onToggleMotion,
  onOpenBag,
  onNavigate,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id: string) => {
    setMobileOpen(false);
    onNavigate(id);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#1A1614]/12 bg-[#F4F0E8]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between px-5 py-3.5 md:px-10">
        <button
          type="button"
          onClick={() => handleNav('hero')}
          className="group flex items-center gap-3 text-left"
          aria-label="Kinetic Origin Home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1A1614]/20 bg-[#1A1614] text-[#F4F0E8] font-display text-sm font-semibold transition-transform duration-200 group-hover:scale-105">
            KO
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-base font-semibold tracking-tight text-[#1A1614]">
              Kinetic Origin
            </span>
            <span className="font-mono-tab text-[10px] text-[#5C524B]">
              SUMATRA ROASTERY LAB
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-[#1A1614] text-[#F4F0E8]'
                    : 'text-[#5C524B] hover:bg-[#EAE3D7] hover:text-[#1A1614]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleMotion}
            aria-pressed={fullMotion}
            className="hidden items-center gap-1.5 rounded-full border border-[#1A1614]/15 bg-[#EAE3D7] px-3.5 py-2 text-xs font-medium text-[#1A1614] transition-colors duration-200 hover:border-[#B85028] sm:inline-flex"
            title="Toggle full-motion scroll choreography"
          >
            {fullMotion ? (
              <>
                <Sparkles className="h-3.5 w-3.5 text-[#B85028]" />
                <span>Motion: Full</span>
              </>
            ) : (
              <>
                <PauseCircle className="h-3.5 w-3.5 text-[#5C524B]" />
                <span>Motion: Calm</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenBag}
            className="relative inline-flex items-center gap-2 rounded-full bg-[#B85028] px-4 py-2 text-sm font-semibold text-[#F4F0E8] transition-transform duration-200 hover:bg-[#9B411E] active:scale-95"
            aria-label={`Open shopping bag with ${bagCount} items`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Bag</span>
            <span className="font-mono-tab inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F4F0E8] px-1.5 text-xs font-semibold text-[#1A1614]">
              {bagCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#1A1614]/15 bg-[#EAE3D7] text-[#1A1614] md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#1A1614]/10 bg-[#F4F0E8] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`rounded-xl px-4 py-2.5 text-left text-sm font-medium ${
                  activeSection === item.id
                    ? 'bg-[#1A1614] text-[#F4F0E8]'
                    : 'bg-[#EAE3D7]/60 text-[#1A1614]'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={onToggleMotion}
              className="mt-1 flex items-center justify-between rounded-xl border border-[#1A1614]/15 px-4 py-2.5 text-sm font-medium text-[#1A1614]"
            >
              <span>Scroll Choreography</span>
              <span className="font-mono-tab text-xs text-[#B85028]">
                {fullMotion ? 'Full Motion' : 'Calm Mode'}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
