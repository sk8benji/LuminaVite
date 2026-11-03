import { SectionHeading } from "./SectionHeading";

const STEPS = [
  {
    number: "01",
    title: "Choose Your Aesthetic",
    description: "Pick from our curated designer templates or send your custom theme.",
  },
  {
    number: "02",
    title: "We Build It For You",
    description:
      "Share your event details, schedule, and photos via WhatsApp; our team crafts your live invitation in 24–48 hours.",
  },
  {
    number: "03",
    title: "Share & Track Live",
    description:
      "Send via text or WhatsApp and watch your confirmed guest list update automatically on your phone.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          id="how-title"
          eyebrow="How It Works"
          title="A 3-Step Simple Process"
          description="No design software, no learning curve. We handle the craft; you handle the celebration."
        />

        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {STEPS.map((step) => (
            <li
              key={step.number}
              className="relative flex flex-col rounded-3xl border border-charcoal/5 bg-white p-7 shadow-sm"
            >
              <span className="font-playfair text-5xl font-semibold leading-none text-wine/90" aria-hidden>
                {step.number}
              </span>
              <span className="mt-6 h-px w-10 bg-champagne" aria-hidden />
              <h3 className="mt-6 font-playfair text-xl font-semibold text-charcoal">
                <span className="sr-only">Step {step.number}: </span>
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/65">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
