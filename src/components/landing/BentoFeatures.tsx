import { Gift, MessageSquareText, Navigation, Smartphone, Sparkles } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const RSVP_STATS = [
  { label: "Confirmed", value: "184", tone: "text-wine" },
  { label: "Declined", value: "12", tone: "text-charcoal/60" },
  { label: "Remaining", value: "4", tone: "text-champagne" },
];

const RECENT_GUESTS = [
  { name: "Familia Hernández", party: "4 guests", table: "Table 7", status: "Confirmed" },
  { name: "Daniel & Marisol K.", party: "2 guests", table: "Table 3", status: "Confirmed" },
  { name: "Abuela Carmen", party: "1 guest", table: "Table 1", status: "Confirmed" },
  { name: "Tyler Brooks", party: "1 guest", table: "—", status: "Declined" },
];

function RsvpDashboardCard() {
  return (
    <article className="flex flex-col rounded-3xl border border-charcoal/5 bg-white p-6 shadow-sm sm:p-8 lg:col-span-2 lg:row-span-2">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-champagne">
        <MessageSquareText className="h-4 w-4" aria-hidden />
        Real-Time RSVP Dashboard
      </div>
      <h3 className="mt-3 font-playfair text-2xl font-semibold text-charcoal sm:text-3xl">
        Know exactly who&apos;s coming, the moment they reply.
      </h3>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-charcoal/65">
        Every SMS confirmation lands in your private host portal instantly, with guest counts, pass limits, and
        seating updated live.
      </p>

      <div className="mt-6 flex-1 rounded-2xl border border-charcoal/5 bg-ivory p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-charcoal">Sofía &amp; Alejandro · Guest List</p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-charcoal/70">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden />
            Live
          </span>
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-3">
          {RSVP_STATS.map((s) => (
            <div key={s.label} className="rounded-xl bg-white p-3 text-center sm:p-4">
              <dd className={`font-playfair text-2xl font-semibold sm:text-3xl ${s.tone}`}>{s.value}</dd>
              <dt className="mt-0.5 text-[11px] uppercase tracking-wider text-charcoal/50">{s.label}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-wine px-4 py-2.5 text-xs font-medium text-white">
          <span>Table Assignments Live</span>
          <span className="text-white/70">22 of 24 tables seated</span>
        </div>

        <ul className="mt-3 divide-y divide-charcoal/5 rounded-xl bg-white">
          {RECENT_GUESTS.map((g) => (
            <li key={g.name} className="flex items-center justify-between gap-3 px-4 py-2.5 text-xs">
              <div className="min-w-0">
                <p className="truncate font-medium text-charcoal">{g.name}</p>
                <p className="text-charcoal/50">
                  {g.party} · {g.table}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  g.status === "Confirmed" ? "bg-wine-soft text-wine" : "bg-charcoal/5 text-charcoal/60"
                }`}
              >
                {g.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  children,
  extra,
}: {
  icon: typeof Smartphone;
  title: string;
  children: React.ReactNode;
  extra?: React.ReactNode;
}) {
  return (
    <article className="flex flex-col rounded-3xl border border-charcoal/5 bg-white p-6 shadow-sm sm:p-7">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-wine-soft text-wine">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="mt-5 font-playfair text-xl font-semibold text-charcoal">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-charcoal/65">{children}</p>
      {extra && <div className="mt-auto pt-5">{extra}</div>}
    </article>
  );
}

const MAP_APPS = ["Apple Maps", "Google Maps", "Waze"];

export function BentoFeatures() {
  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          id="features-title"
          eyebrow="Why Digital Over Paper"
          title="Why Families Choose Digital Over Paper"
          description="Everything a printed suite can't do: live guest tracking, music, maps, and updates, delivered straight to every phone."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
          <RsvpDashboardCard />

          <FeatureCard
            icon={Smartphone}
            title="Zero App Downloads"
            extra={
              <p className="inline-flex items-center gap-2 rounded-full bg-ivory px-3 py-1.5 text-xs font-medium text-charcoal/70">
                <Sparkles className="h-3.5 w-3.5 text-champagne" aria-hidden />
                Confirm in about 5 seconds
              </p>
            }
          >
            Guests confirm directly via SMS or mobile web in 5 seconds. Perfect for older relatives and busy
            guests.
          </FeatureCard>

          <FeatureCard icon={Gift} title="Interactive 3D Unboxing">
            Wax seals, custom envelope liners, background music, and photo galleries, without ads or third-party
            banners.
          </FeatureCard>

          <div className="lg:col-span-3">
            <article className="flex flex-col gap-6 rounded-3xl border border-charcoal/5 bg-white p-6 shadow-sm sm:p-7 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-wine-soft text-wine">
                  <Navigation className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-playfair text-xl font-semibold text-charcoal">Instant GPS &amp; Directions</h3>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-charcoal/65">
                    One-tap buttons routing directly to Apple Maps, Google Maps, and Waze for banquet halls and
                    churches across LA.
                  </p>
                </div>
              </div>
              <ul className="flex flex-wrap gap-2">
                {MAP_APPS.map((app) => (
                  <li
                    key={app}
                    className="rounded-full border border-charcoal/10 bg-ivory px-4 py-2 text-xs font-medium text-charcoal"
                  >
                    {app}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
