import { useState, type FormEvent } from 'react';
import { Calendar, Clock, Users, CheckCircle2, MapPin, Minus, Plus } from 'lucide-react';
import { CUPPING_SESSIONS, formatIdr } from '../data/roasteryData';

const DATES = ['Thu, 26 Nov', 'Fri, 27 Nov', 'Sat, 28 Nov', 'Sun, 29 Nov'];
const TIME_SLOTS = ['10:00 WIB', '13:30 WIB', '16:00 WIB', '19:00 WIB'];

export function CuppingReservation() {
  const [sessionId, setSessionId] = useState(CUPPING_SESSIONS[0].id);
  const [selectedDate, setSelectedDate] = useState(DATES[2]);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[1]);
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState('');
  const [guestContact, setGuestContact] = useState('');
  const [error, setError] = useState('');
  const [ticket, setTicket] = useState<{
    code: string;
    sessionTitle: string;
    date: string;
    time: string;
    guests: number;
    name: string;
    total: number;
  } | null>(null);

  const activeSession =
    CUPPING_SESSIONS.find((s) => s.id === sessionId) ?? CUPPING_SESSIONS[0];
  const totalFee = activeSession.pricePerGuest * guests;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (guestName.trim().length < 2) {
      setError('Please enter your name to reserve the cupping table.');
      return;
    }
    if (guestContact.trim().length < 5) {
      setError('Please enter an email or WhatsApp number for confirmation.');
      return;
    }
    setError('');
    setTicket({
      code: `CUP-${Math.floor(1000 + Math.random() * 9000)}`,
      sessionTitle: activeSession.title,
      date: selectedDate,
      time: selectedTime,
      guests,
      name: guestName.trim(),
      total: totalFee,
    });
  };

  return (
    <section id="cupping" className="border-b border-[#1A1614]/12 py-20 md:py-28">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left editorial narrative & session picker */}
          <div className="lg:col-span-6">
            <p className="font-mono-tab text-xs font-medium text-[#B85028]">
              04 / PRIVATE CUPPING TABLE
            </p>
            <h2 className="font-display mt-3 text-[clamp(2.1rem,4.2vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.025em] text-[#1A1614]">
              Taste the harvest beside the roaster.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#5C524B] md:text-base">
              Six seats around our solid-teak sensory bar. Choose your tasting track, pick a slot,
              and receive an instant confirmation pass.
            </p>

            <div className="mt-8 space-y-3" role="radiogroup" aria-label="Cupping session types">
              {CUPPING_SESSIONS.map((session) => {
                const selected = session.id === activeSession.id;
                return (
                  <button
                    key={session.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => {
                      setSessionId(session.id);
                      setTicket(null);
                    }}
                    className={`w-full rounded-2xl border p-5 text-left transition-all duration-200 ${
                      selected
                        ? 'border-[#1A1614] bg-[#1A1614] text-[#F4F0E8]'
                        : 'border-[#1A1614]/12 bg-[#EAE3D7]/70 text-[#1A1614] hover:border-[#B85028]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="font-display text-xl font-medium">{session.title}</span>
                        <span
                          className={`font-mono-tab ml-2.5 text-xs ${
                            selected ? 'text-[#B85028]' : 'text-[#5C524B]'
                          }`}
                        >
                          {session.duration}
                        </span>
                      </div>
                      <span className="font-mono-tab text-sm font-semibold">
                        {formatIdr(session.pricePerGuest)}/pax
                      </span>
                    </div>
                    <p
                      className={`mt-2 text-xs leading-relaxed ${
                        selected ? 'text-[#F4F0E8]/75' : 'text-[#5C524B]'
                      }`}
                    >
                      {session.summary}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {session.includes.map((inc) => (
                        <span
                          key={inc}
                          className={`rounded-full px-2.5 py-0.5 text-[11px] ${
                            selected
                              ? 'bg-[#F4F0E8]/12 text-[#F4F0E8]'
                              : 'bg-[#F4F0E8] text-[#5C524B]'
                          }`}
                        >
                          {inc}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right interactive booking card / live ticket */}
          <div className="reveal-panel lg:col-span-6">
            <div className="rounded-[28px] border border-[#1A1614]/12 bg-[#EAE3D7] p-6 md:p-8">
              {ticket ? (
                <div className="rounded-2xl border border-[#2F4F3E]/30 bg-[#F4F0E8] p-6">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-mono-tab text-xs font-semibold text-[#2F4F3E]">
                      <CheckCircle2 className="h-4 w-4" />
                      SEAT CONFIRMED
                    </span>
                    <span className="font-mono-tab rounded-full bg-[#1A1614] px-3 py-1 text-xs font-semibold text-[#F4F0E8]">
                      {ticket.code}
                    </span>
                  </div>

                  <h3 className="font-display mt-4 text-2xl font-medium text-[#1A1614]">
                    {ticket.sessionTitle}
                  </h3>
                  <p className="mt-1 text-sm text-[#5C524B]">Reserved for {ticket.name}</p>

                  <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-[#1A1614]/12 py-4 text-xs">
                    <div>
                      <dt className="text-[#5C524B]">Date &amp; Time</dt>
                      <dd className="font-mono-tab mt-1 font-semibold text-[#1A1614]">
                        {ticket.date} • {ticket.time}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#5C524B]">Party Size</dt>
                      <dd className="font-mono-tab mt-1 font-semibold text-[#1A1614]">
                        {ticket.guests} Guest(s)
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#5C524B]">Location</dt>
                      <dd className="mt-1 flex items-center gap-1 font-medium text-[#1A1614]">
                        <MapPin className="h-3.5 w-3.5 text-[#B85028]" />
                        <span>Bukit Raya Lab, Pekanbaru</span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#5C524B]">Pay at Bar</dt>
                      <dd className="font-mono-tab mt-1 font-semibold text-[#B85028]">
                        {formatIdr(ticket.total)}
                      </dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    onClick={() => setTicket(null)}
                    className="mt-5 w-full rounded-full border border-[#1A1614]/20 bg-[#EAE3D7] px-5 py-3 text-xs font-semibold text-[#1A1614] hover:bg-[#1A1614] hover:text-[#F4F0E8]"
                  >
                    Modify or Book Another Seat
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#1A1614]">
                      <Calendar className="h-3.5 w-3.5 text-[#B85028]" />
                      Select Date
                    </span>
                    <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {DATES.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setSelectedDate(d)}
                          className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                            selectedDate === d
                              ? 'border-[#1A1614] bg-[#1A1614] text-[#F4F0E8]'
                              : 'border-[#1A1614]/15 bg-[#F4F0E8] text-[#1A1614] hover:border-[#B85028]'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#1A1614]">
                      <Clock className="h-3.5 w-3.5 text-[#B85028]" />
                      Select Seating Slot
                    </span>
                    <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {TIME_SLOTS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTime(t)}
                          className={`font-mono-tab rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                            selectedTime === t
                              ? 'border-[#1A1614] bg-[#1A1614] text-[#F4F0E8]'
                              : 'border-[#1A1614]/15 bg-[#F4F0E8] text-[#1A1614] hover:border-[#B85028]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-[#1A1614]/12 bg-[#F4F0E8] px-4 py-3">
                    <span className="flex items-center gap-2 text-xs font-semibold text-[#1A1614]">
                      <Users className="h-4 w-4 text-[#B85028]" />
                      Guests (Max 6)
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#1A1614]/15 bg-[#EAE3D7] text-[#1A1614] hover:bg-[#1A1614] hover:text-[#F4F0E8]"
                        aria-label="Decrease guests"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="font-mono-tab w-5 text-center text-sm font-semibold text-[#1A1614]">
                        {guests}
                      </span>
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.min(6, g + 1))}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#1A1614]/15 bg-[#EAE3D7] text-[#1A1614] hover:bg-[#1A1614] hover:text-[#F4F0E8]"
                        aria-label="Increase guests"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Full Name"
                      aria-label="Full Name"
                      className="rounded-xl border border-[#1A1614]/15 bg-[#F4F0E8] px-4 py-3 text-xs text-[#1A1614]"
                    />
                    <input
                      type="text"
                      value={guestContact}
                      onChange={(e) => setGuestContact(e.target.value)}
                      placeholder="Email or WhatsApp"
                      aria-label="Email or WhatsApp"
                      className="rounded-xl border border-[#1A1614]/15 bg-[#F4F0E8] px-4 py-3 text-xs text-[#1A1614]"
                    />
                  </div>

                  {error && <p className="text-xs font-medium text-[#B85028]">{error}</p>}

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#1A1614]/12 pt-5">
                    <div>
                      <span className="text-xs text-[#5C524B]">Estimated Total</span>
                      <p className="font-mono-tab text-xl font-semibold text-[#1A1614]">
                        {formatIdr(totalFee)}
                      </p>
                    </div>
                    <button
                      type="submit"
                      className="rounded-full bg-[#B85028] px-6 py-3.5 text-xs font-semibold text-[#F4F0E8] transition-transform duration-150 hover:bg-[#9B411E] active:scale-95"
                    >
                      Confirm Cupping Pass
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
