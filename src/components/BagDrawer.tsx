import { useEffect, useState, type FormEvent } from 'react';
import { X, Plus, Minus, Trash2, Tag, CheckCircle2, ShoppingBag } from 'lucide-react';
import { formatIdr, type GrindOption, type MicroLot } from '../data/roasteryData';

export interface BagItem {
  key: string;
  lot: MicroLot;
  grind: GrindOption;
  quantity: number;
}

interface BagDrawerProps {
  open: boolean;
  items: BagItem[];
  onClose: () => void;
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onClearBag: () => void;
}

export function BagDrawer({
  open,
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearBag,
}: BagDrawerProps) {
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingCity, setShippingCity] = useState('Pekanbaru');
  const [formError, setFormError] = useState('');
  const [receipt, setReceipt] = useState<{
    orderId: string;
    total: number;
    name: string;
    city: string;
    itemCount: number;
  } | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const subtotal = items.reduce((sum, item) => sum + item.lot.priceIdr * item.quantity, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 0 ? (subtotal >= 300000 ? 0 : 18000) : 0;
  const total = Math.max(0, subtotal - discount + shipping);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === 'ORIGIN10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoApplied(false);
      setPromoError('Try code ORIGIN10 for 10% off your roast.');
    }
  };

  const handleCheckout = (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (customerName.trim().length < 2) {
      setFormError('Please enter your name for the roast label.');
      return;
    }
    if (!customerEmail.includes('@') || !customerEmail.includes('.')) {
      setFormError('Please enter a valid email address for your brew receipt.');
      return;
    }
    setFormError('');
    const orderId = `KO-${Math.floor(100000 + Math.random() * 900000)}`;
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    setReceipt({
      orderId,
      total,
      name: customerName.trim(),
      city: shippingCity,
      itemCount: count,
    });
    onClearBag();
    setPromoApplied(false);
    setPromoInput('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1A1614]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Roastery shopping bag"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-md flex-col border-l border-[#1A1614]/15 bg-[#F4F0E8] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#1A1614]/12 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-4 w-4 text-[#B85028]" />
            <h3 className="font-display text-xl font-medium text-[#1A1614]">Roast Bag</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#1A1614]/15 bg-[#EAE3D7] text-[#1A1614] hover:bg-[#1A1614] hover:text-[#F4F0E8]"
            aria-label="Close bag"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {receipt ? (
            <div className="rounded-2xl border border-[#2F4F3E]/30 bg-[#EAE3D7] p-6">
              <div className="flex items-center gap-2 text-[#2F4F3E]">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-mono-tab text-xs font-semibold">ROAST QUEUED</span>
              </div>
              <h4 className="font-display mt-2 text-2xl font-medium text-[#1A1614]">
                Thank you, {receipt.name}.
              </h4>
              <p className="mt-2 text-sm text-[#5C524B]">
                Your {receipt.itemCount} bag(s) are scheduled for tomorrow’s morning drum roast and
                dispatch to <strong>{receipt.city}</strong>.
              </p>
              <div className="mt-5 space-y-2 border-t border-[#1A1614]/12 pt-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#5C524B]">Order Reference</span>
                  <span className="font-mono-tab font-semibold text-[#1A1614]">
                    {receipt.orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C524B]">Total Paid</span>
                  <span className="font-mono-tab font-semibold text-[#B85028]">
                    {formatIdr(receipt.total)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReceipt(null);
                  onClose();
                }}
                className="mt-6 w-full rounded-full bg-[#1A1614] px-5 py-3 text-xs font-semibold text-[#F4F0E8] hover:bg-[#B85028]"
              >
                Continue Exploring
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-display text-2xl text-[#1A1614]">Your bag is empty.</p>
              <p className="mt-2 max-w-xs text-sm text-[#5C524B]">
                Select any seasonal Sumatra micro-lot and grind profile to schedule a fresh roast.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 rounded-full bg-[#1A1614] px-5 py-2.5 text-xs font-semibold text-[#F4F0E8] hover:bg-[#B85028]"
              >
                Browse Micro-Lots
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <ul className="space-y-3.5">
                {items.map((item) => (
                  <li
                    key={item.key}
                    className="flex gap-3.5 rounded-2xl border border-[#1A1614]/12 bg-[#EAE3D7]/80 p-3.5"
                  >
                    <img
                      src={item.lot.image}
                      alt={item.lot.name}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-display text-base font-medium leading-tight text-[#1A1614]">
                            {item.lot.name}
                          </p>
                          <p className="font-mono-tab mt-0.5 text-[11px] text-[#5C524B]">
                            {item.grind} • {item.lot.weightG}g
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.key)}
                          className="text-[#5C524B] hover:text-[#B85028]"
                          aria-label={`Remove ${item.lot.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#1A1614]/15 bg-[#F4F0E8] px-2 py-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.key, -1)}
                            className="p-1 text-[#1A1614] hover:text-[#B85028]"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-mono-tab min-w-4 text-center text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.key, 1)}
                            className="p-1 text-[#1A1614] hover:text-[#B85028]"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <span className="font-mono-tab text-xs font-semibold text-[#1A1614]">
                          {formatIdr(item.lot.priceIdr * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Promo Code */}
              <div className="rounded-2xl border border-[#1A1614]/12 bg-[#EAE3D7]/60 p-4">
                <label htmlFor="promo-code" className="flex items-center gap-1.5 text-xs font-semibold text-[#1A1614]">
                  <Tag className="h-3.5 w-3.5 text-[#B85028]" />
                  <span>Promo Code (Try ORIGIN10)</span>
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="promo-code"
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="ORIGIN10"
                    className="font-mono-tab flex-1 rounded-xl border border-[#1A1614]/15 bg-[#F4F0E8] px-3 py-2 text-xs uppercase text-[#1A1614]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="rounded-xl bg-[#1A1614] px-4 py-2 text-xs font-semibold text-[#F4F0E8] hover:bg-[#B85028]"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="mt-1.5 text-xs font-medium text-[#2F4F3E]">
                    ORIGIN10 applied — 10% off your roast!
                  </p>
                )}
                {promoError && <p className="mt-1.5 text-xs text-[#B85028]">{promoError}</p>}
              </div>

              {/* Totals */}
              <div className="space-y-2 border-t border-[#1A1614]/12 pt-4 text-xs">
                <div className="flex justify-between text-[#5C524B]">
                  <span>Subtotal</span>
                  <span className="font-mono-tab font-medium text-[#1A1614]">
                    {formatIdr(subtotal)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#2F4F3E]">
                    <span>Discount (ORIGIN10)</span>
                    <span className="font-mono-tab font-medium">-{formatIdr(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#5C524B]">
                  <span>Courier ({subtotal >= 300000 ? 'Free over 300k' : 'Standard'})</span>
                  <span className="font-mono-tab font-medium text-[#1A1614]">
                    {shipping === 0 ? 'FREE' : formatIdr(shipping)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#1A1614]/12 pt-2.5 text-sm font-semibold text-[#1A1614]">
                  <span>Total</span>
                  <span className="font-mono-tab text-[#B85028]">{formatIdr(total)}</span>
                </div>
              </div>

              {/* Inline Checkout Form */}
              <form onSubmit={handleCheckout} className="space-y-3 border-t border-[#1A1614]/12 pt-4" noValidate>
                <p className="font-mono-tab text-[11px] font-semibold text-[#5C524B]">
                  DISPATCH DETAILS
                </p>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your Name"
                  aria-label="Your Name"
                  className="w-full rounded-xl border border-[#1A1614]/15 bg-[#EAE3D7]/60 px-3.5 py-2.5 text-xs text-[#1A1614]"
                />
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Email for roast tracking"
                  aria-label="Email for roast tracking"
                  className="w-full rounded-xl border border-[#1A1614]/15 bg-[#EAE3D7]/60 px-3.5 py-2.5 text-xs text-[#1A1614]"
                />
                <select
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  aria-label="Shipping City"
                  className="w-full rounded-xl border border-[#1A1614]/15 bg-[#EAE3D7]/60 px-3.5 py-2.5 text-xs text-[#1A1614]"
                >
                  <option value="Pekanbaru">Pekanbaru (Same-Day Roastery Courier)</option>
                  <option value="Bukittinggi / Padang">Bukittinggi / Padang (Next-Day)</option>
                  <option value="Jakarta / Bandung">Jakarta / Bandung (Express Air)</option>
                  <option value="Surabaya / Bali">Surabaya / Bali (Express Air)</option>
                </select>

                {formError && <p className="text-xs font-medium text-[#B85028]">{formError}</p>}

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#B85028] px-5 py-3.5 text-xs font-semibold text-[#F4F0E8] transition-colors hover:bg-[#9B411E]"
                >
                  Place Roast Order — {formatIdr(total)}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
