"use client";

import { useEffect, useState } from "react";
import { Check, MapPin, Music2, Pause } from "lucide-react";

type Stage = 0 | 1 | 2 | 3;

const STAGE_DURATIONS: Record<Stage, number> = { 0: 1800, 1: 1100, 2: 1300, 3: 4200 };

function useInvitationLoop(): Stage {
  const [stage, setStage] = useState<Stage>(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage(3);
      return;
    }
    const timer = window.setTimeout(
      () => setStage((s) => ((s + 1) % 4) as Stage),
      STAGE_DURATIONS[stage],
    );
    return () => window.clearTimeout(timer);
  }, [stage]);

  return stage;
}

const WAVE_BARS = [0.5, 0.9, 0.6, 1, 0.7, 0.4, 0.85, 0.55, 0.95, 0.65, 0.45, 0.8];

export function HeroInvitationMockup() {
  const stage = useInvitationLoop();
  const sealBroken = stage >= 1;
  const flapOpen = stage >= 2;
  const cardRevealed = stage >= 3;

  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      <div
        aria-hidden
        className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(184,151,90,0.28),transparent_65%)]"
      />

      <div className="animate-drift motion-reduce:animate-none">
        <div
          role="img"
          aria-label="Phone showing a digital invitation: a wax seal cracks open, the envelope reveals the event card, music plays, and an RSVP in 1 Tap button appears."
          className="relative rounded-[2.75rem] border border-charcoal/10 bg-charcoal p-2.5 shadow-[0_40px_80px_-30px_rgba(35,32,30,0.55)]"
        >
          <div className="relative flex aspect-[9/19] flex-col overflow-hidden rounded-[2.2rem] bg-[#F6EFE6]">
            <div className="absolute left-1/2 top-2.5 z-30 h-6 w-24 -translate-x-1/2 rounded-full bg-charcoal" />

            <div className="flex items-center justify-between px-6 pt-3 text-[10px] font-medium text-charcoal/70">
              <span>9:41</span>
              <span>5G</span>
            </div>

            <div className="relative flex flex-1 items-center justify-center px-5 [perspective:900px]">
              {/* Event card */}
              <div
                className={`absolute inset-x-7 z-10 rounded-xl border border-champagne/40 bg-white px-4 pb-5 pt-6 text-center shadow-lg transition-all duration-1000 ease-out ${
                  cardRevealed ? "top-8 opacity-100" : "top-[38%] opacity-0"
                }`}
              >
                <p className="text-[9px] uppercase tracking-[0.3em] text-champagne">Together with their families</p>
                <p className="mt-3 font-playfair text-2xl italic leading-tight text-wine">Sofía &amp; Alejandro</p>
                <div className="mx-auto my-3 h-px w-12 bg-champagne/60" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/70">Saturday · June 14, 2026</p>
                <p className="mt-1 text-[10px] text-charcoal/60">The Ebell of Los Angeles</p>
                <p className="mt-3 inline-flex items-center gap-1 text-[10px] text-charcoal/60">
                  <MapPin className="h-3 w-3 text-champagne" aria-hidden />
                  Directions
                </p>
              </div>

              {/* Envelope */}
              <div
                className={`relative z-20 aspect-[4/3] w-full transition-all duration-1000 ease-out ${
                  cardRevealed ? "translate-y-[58%] scale-90" : "translate-y-0"
                }`}
              >
                <div className="absolute inset-0 rounded-md bg-[#E9DCCB] shadow-md" />
                <div
                  className="absolute inset-0 rounded-md bg-[#E2D2BD]"
                  style={{ clipPath: "polygon(0 100%, 50% 48%, 100% 100%)" }}
                />
                <div
                  className="absolute inset-0 rounded-md bg-[#DCCAB2]"
                  style={{ clipPath: "polygon(0 0, 50% 52%, 0 100%)" }}
                />
                <div
                  className="absolute inset-0 rounded-md bg-[#DCCAB2]"
                  style={{ clipPath: "polygon(100% 0, 50% 52%, 100% 100%)" }}
                />
                <div
                  className={`absolute inset-x-0 top-0 h-[58%] origin-top transition-transform duration-1000 ease-in-out [transform-style:preserve-3d] ${
                    flapOpen ? "[transform:rotateX(180deg)]" : "[transform:rotateX(0deg)]"
                  }`}
                >
                  <div
                    className="h-full w-full bg-[#D5C0A4] [backface-visibility:hidden]"
                    style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                  />
                </div>

                {/* Wax seal */}
                <div
                  className={`absolute left-1/2 top-[48%] flex -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ${
                    flapOpen ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <span
                    className={`flex h-14 w-7 items-center justify-end overflow-hidden rounded-l-full bg-wine shadow-inner transition-transform duration-700 ${
                      sealBroken ? "-translate-x-1.5 -rotate-12" : ""
                    }`}
                  >
                    <span className="mr-[-6px] font-playfair text-lg italic text-champagne/90">C</span>
                  </span>
                  <span
                    className={`flex h-14 w-7 items-center justify-start overflow-hidden rounded-r-full bg-wine shadow-inner transition-transform duration-700 ${
                      sealBroken ? "translate-x-1.5 rotate-12" : ""
                    }`}
                  >
                    <span className="ml-[-2px] font-playfair text-lg italic text-champagne/90">L</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Music + RSVP */}
            <div className="space-y-2.5 px-4 pb-6">
              <div className="flex items-center gap-3 rounded-full bg-white/80 px-3 py-2 shadow-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-wine text-white">
                  {stage === 0 ? <Music2 className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}
                </span>
                <div className="flex h-5 flex-1 items-center gap-[3px]">
                  {WAVE_BARS.map((h, i) => (
                    <span
                      key={i}
                      className={`w-[3px] origin-center rounded-full bg-champagne ${
                        stage === 0 ? "" : "animate-soundwave motion-reduce:animate-none"
                      }`}
                      style={{ height: `${h * 100}%`, animationDelay: `${i * 90}ms` }}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-charcoal/60">0:42</span>
              </div>

              <div
                className={`flex items-center justify-center gap-2 rounded-full bg-wine py-3 text-xs font-semibold text-white shadow-md transition-all duration-700 ${
                  cardRevealed ? "translate-y-0 opacity-100" : "translate-y-2 opacity-40"
                }`}
              >
                <Check className="h-3.5 w-3.5" aria-hidden />
                RSVP in 1 Tap
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -left-6 bottom-24 hidden rounded-2xl border border-charcoal/5 bg-white px-4 py-3 shadow-xl sm:block">
        <p className="text-[10px] uppercase tracking-widest text-charcoal/50">New RSVP</p>
        <p className="mt-0.5 text-sm font-medium text-charcoal">Tía Rosa · 2 guests</p>
      </div>
      <div className="absolute -right-6 top-24 hidden rounded-2xl border border-charcoal/5 bg-white px-4 py-3 shadow-xl sm:block">
        <p className="text-[10px] uppercase tracking-widest text-charcoal/50">Confirmed</p>
        <p className="mt-0.5 font-playfair text-xl font-semibold text-wine">184</p>
      </div>
    </div>
  );
}
