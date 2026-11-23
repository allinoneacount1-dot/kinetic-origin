import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Manifesto } from './components/Manifesto';
import { ExtractionLab } from './components/ExtractionLab';
import { MicroLotCatalogue } from './components/MicroLotCatalogue';
import { CuppingReservation } from './components/CuppingReservation';
import { Footer } from './components/Footer';
import { LotDetailDrawer } from './components/LotDetailDrawer';
import { BagDrawer, type BagItem } from './components/BagDrawer';
import type { GrindOption, MicroLot } from './data/roasteryData';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const [activeSection, setActiveSection] = useState('hero');
  const [fullMotion, setFullMotion] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [inspectedLot, setInspectedLot] = useState<MicroLot | null>(null);
  const [bagOpen, setBagOpen] = useState(false);
  const [bagItems, setBagItems] = useState<BagItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  // Smooth scrolling (Lenis) + GSAP ScrollTrigger choreography
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let rafId = 0;
    let lenis: Lenis | null = null;

    if (fullMotion) {
      lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenisRef.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = window.requestAnimationFrame(raf);
      };
      rafId = window.requestAnimationFrame(raf);
    } else {
      lenisRef.current = null;
    }

    const ctx = gsap.context(() => {
      if (fullMotion) {
        gsap.from('.hero-stagger', {
          y: 28,
          opacity: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        });

        gsap.to('.hero-parallax', {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        gsap.utils.toArray<HTMLElement>('.kinetic-line').forEach((line, idx) => {
          gsap.from(line, {
            y: 36,
            opacity: 0,
            duration: 0.7,
            delay: idx * 0.06,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '#manifesto',
              start: 'top 78%',
              once: true,
            },
          });
        });

        gsap.utils.toArray<HTMLElement>('.reveal-panel').forEach((panel) => {
          gsap.from(panel, {
            y: 26,
            opacity: 0,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 84%',
              once: true,
            },
          });
        });
      }

      // Active section tracking
      ['hero', 'manifesto', 'lab', 'lots', 'cupping'].forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          onEnter: () => setActiveSection(id),
          onEnterBack: () => setActiveSection(id),
        });
      });
    }, root);

    return () => {
      ctx.revert();
      if (rafId) window.cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
      lenisRef.current = null;
    };
  }, [fullMotion]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => {
      setToast((curr) => (curr === msg ? null : curr));
    }, 2600);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    if (lenisRef.current && fullMotion) {
      lenisRef.current.scrollTo(el, { offset: -64 });
    } else {
      el.scrollIntoView({ behavior: fullMotion ? 'smooth' : 'auto' });
    }
  };

  const handleOpenLab = (presetId?: string) => {
    if (presetId) {
      setSelectedPresetId(presetId);
    }
    scrollToSection('lab');
  };

  const handleAddToBag = (lot: MicroLot, grind: GrindOption) => {
    const key = `${lot.id}__${grind}`;
    setBagItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { key, lot, grind, quantity: 1 }];
    });
    showToast(`Added ${lot.name} (${grind}) to Bag`);
  };

  const handleUpdateQty = (key: string, delta: number) => {
    setBagItems((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (key: string) => {
    setBagItems((prev) => prev.filter((item) => item.key !== key));
  };

  const bagCount = bagItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div ref={rootRef} className="paper-grain min-h-screen bg-[#F4F0E8] text-[#1A1614]">
      <Navbar
        activeSection={activeSection}
        bagCount={bagCount}
        fullMotion={fullMotion}
        onToggleMotion={() => setFullMotion((m) => !m)}
        onOpenBag={() => setBagOpen(true)}
        onNavigate={scrollToSection}
      />

      <main>
        <Hero
          onOpenLab={handleOpenLab}
          onExploreLots={() => scrollToSection('lots')}
        />
        <Manifesto />
        <ExtractionLab externalPresetId={selectedPresetId} />
        <MicroLotCatalogue
          onAddToBag={handleAddToBag}
          onInspectLot={(lot) => setInspectedLot(lot)}
        />
        <CuppingReservation />
      </main>

      <Footer onNavigate={scrollToSection} />

      <LotDetailDrawer
        lot={inspectedLot}
        onClose={() => setInspectedLot(null)}
        onAddToBag={handleAddToBag}
        onLoadRecipe={(presetId) => handleOpenLab(presetId)}
      />

      <BagDrawer
        open={bagOpen}
        items={bagItems}
        onClose={() => setBagOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearBag={() => setBagItems([])}
      />

      {/* Non-intrusive inline toast notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full border border-[#1A1614]/15 bg-[#1A1614] px-5 py-3 text-xs font-medium text-[#F4F0E8] shadow-xl"
        >
          <span className="h-2 w-2 rounded-full bg-[#B85028]" />
          <span>{toast}</span>
          <button
            type="button"
            onClick={() => setBagOpen(true)}
            className="font-mono-tab underline underline-offset-2 hover:text-[#B85028]"
          >
            View Bag
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
