import { useState, type FormEvent } from 'react';
import { ArrowUp, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes('@') || !email.includes('.')) {
      setError('Enter a valid email to join harvest drop alerts.');
      return;
    }
    setError('');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="py-16">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-10 border-b border-[#1A1614]/12 pb-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="font-display text-3xl font-medium tracking-tight text-[#1A1614]">
              Kinetic Origin
            </span>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#5C524B]">
              Small-batch Sumatra highland roastery &amp; interactive pour-over lab. Roasted weekly
              in small drums for transparent terroir expression.
            </p>
            <p className="font-mono-tab mt-4 text-xs text-[#5C524B]">
              0°28&apos;14&quot;N 101°27&apos;02&quot;E • Pekanbaru &amp; Bukittinggi, Indonesia
            </p>
          </div>

          <div className="lg:col-span-3">
            <p className="font-mono-tab text-xs font-semibold text-[#1A1614]">NAVIGATION</p>
            <ul className="mt-3 space-y-2 text-sm text-[#5C524B]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('manifesto')}
                  className="hover:text-[#B85028]"
                >
                  Highland Thesis &amp; Origins
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('lab')}
                  className="hover:text-[#B85028]"
                >
                  Interactive Extraction Lab
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('lots')}
                  className="hover:text-[#B85028]"
                >
                  Seasonal Micro-Lots
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('cupping')}
                  className="hover:text-[#B85028]"
                >
                  Private Cupping Table
                </button>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="font-mono-tab text-xs font-semibold text-[#1A1614]">
              HARVEST DROP ALERTS
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[#5C524B]">
              Get notified first when micro-lots from Solok, Kerinci P88, and Pantan Musara leave
              the roaster.
            </p>

            {subscribed ? (
              <div className="mt-4 flex items-center gap-2 rounded-2xl border border-[#2F4F3E]/30 bg-[#EAE3D7] px-4 py-3 text-xs font-medium text-[#2F4F3E]">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>You&apos;re on the harvest dispatch list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-4 flex gap-2" noValidate>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  aria-label="Email for harvest alerts"
                  className="flex-1 rounded-full border border-[#1A1614]/15 bg-[#EAE3D7] px-4 py-2.5 text-xs text-[#1A1614]"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#1A1614] px-5 py-2.5 text-xs font-semibold text-[#F4F0E8] hover:bg-[#B85028]"
                >
                  Join
                </button>
              </form>
            )}
            {error && <p className="mt-1.5 text-xs text-[#B85028]">{error}</p>}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#5C524B]">
          <span>© 2026 Kinetic Origin Roastery Lab. Built with GSAP, Lenis &amp; React.</span>
          <button
            type="button"
            onClick={() => onNavigate('hero')}
            className="inline-flex items-center gap-1.5 font-medium text-[#1A1614] hover:text-[#B85028]"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
