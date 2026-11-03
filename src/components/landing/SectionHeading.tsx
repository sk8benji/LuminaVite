type SectionHeadingProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  tone?: "light" | "dark";
};

export function SectionHeading({ id, eyebrow, title, description, tone = "light" }: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-champagne">{eyebrow}</p>
      <h2
        id={id}
        className={`mt-3 text-balance font-playfair text-3xl font-semibold tracking-tight sm:text-4xl ${
          dark ? "text-white" : "text-charcoal"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-pretty text-base leading-relaxed ${dark ? "text-white/70" : "text-charcoal/65"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
