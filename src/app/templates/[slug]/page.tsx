import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { INITIAL_MASTER_TEMPLATES } from "@/lib/templates-data";

// Aliases del brief (nombres de plantilla) hacia el slug canónico del catálogo.
// Redirección 307 a la URL canónica: sin contenido duplicado.
const TEMPLATE_ALIASES: Record<string, string> = {
  "celestial-butterfly": "mariposas-xv",
  "vintage-quinceanera": "isabella-xv",
};

const CATEGORY_LABEL: Record<string, string> = {
  QUINCEANERA: "Quinceañera",
  BODA: "Wedding",
  CUMPLEANOS: "Birthday",
};

function styleLabel(code: string): string {
  return code
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function toAbsolute(src: string): string {
  return src.startsWith("http") ? src : `https://clickandlove.app${src}`;
}

export function generateStaticParams() {
  return INITIAL_MASTER_TEMPLATES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = INITIAL_MASTER_TEMPLATES.find((x) => x.slug === slug);
  if (!t) return { title: "Templates | Click & Love" };
  const title = `${t.nombre} Template | Click & Love`;
  const description = `${t.nombre} ${CATEGORY_LABEL[t.categoria] ?? t.categoria} template: ${t.titulo}. See the style, colors, music and live demo. Assisted $99. VIP $199.`;
  return {
    title,
    description,
    metadataBase: new URL("https://clickandlove.app"),
    alternates: {
      canonical: `https://clickandlove.app/templates/${t.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://clickandlove.app/templates/${t.slug}`,
      siteName: "Click & Love",
      locale: "en_US",
      type: "website",
      images: [{ url: toAbsolute(t.fotoPortadaUrl) }],
    },
  };
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const alias = TEMPLATE_ALIASES[slug];
  if (alias) redirect(`/templates/${alias}`);
  const t = INITIAL_MASTER_TEMPLATES.find((x) => x.slug === slug);
  if (!t) notFound();

  const category = CATEGORY_LABEL[t.categoria] ?? t.categoria;
  const photos = [
    t.fotoPortadaUrl,
    t.fotoInfanciaUrl,
    t.fotoActualUrl,
    t.fotoCierreUrl,
  ].filter((u, i, arr): u is string => !!u && arr.indexOf(u) === i);
  const passes =
    t.maxPasesPorInvitado === undefined
      ? null
      : t.maxPasesPorInvitado === 0
        ? "No limit (the host chooses)"
        : `Up to ${t.maxPasesPorInvitado} passes per guest`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${t.nombre} — ${category} Template`,
    image: toAbsolute(t.fotoPortadaUrl),
    description: `${t.nombre} ${category} template (${t.titulo} — ${t.subtitulo}). Digital invitation with music, RSVP and host panel.`,
    brand: { "@type": "Brand", name: "Click & Love" },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "99",
      highPrice: "199",
      priceCurrency: "USD",
      offerCount: "2",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="bg-[#7A002A] text-white">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <p className="text-sm tracking-widest uppercase text-[#FFD166] font-bold">
            Click &amp; Love · {category} Template
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold leading-tight">
            {t.nombre} Template
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-white/90">
            {t.titulo} — {t.subtitulo}
          </p>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-[#7A002A]">Style &amp; design</h2>
          <dl className="mt-4 space-y-2 leading-relaxed">
            <div className="flex gap-2">
              <dt className="font-bold min-w-28">Design:</dt>
              <dd>{t.nombre}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-bold min-w-28">Style:</dt>
              <dd>{styleLabel(t.estiloPlantilla)}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-bold min-w-28">Typography:</dt>
              <dd>{t.tipoLetra}</dd>
            </div>
            <div className="flex gap-2 items-center">
              <dt className="font-bold min-w-28">Colors:</dt>
              <dd className="flex items-center gap-3">
                <span
                  className="inline-block w-6 h-6 rounded-full border"
                  style={{ backgroundColor: t.colorSobre }}
                  title={t.colorSobre}
                />
                <span>{t.colorSobre} (envelope)</span>
                <span
                  className="inline-block w-6 h-6 rounded-full border"
                  style={{ backgroundColor: t.colorSello }}
                  title={t.colorSello}
                />
                <span>{t.colorSello} (seal)</span>
              </dd>
            </div>
            {t.musicaTitulo && (
              <div className="flex gap-2">
                <dt className="font-bold min-w-28">Music:</dt>
                <dd>{t.musicaTitulo}</dd>
              </div>
            )}
            {passes && (
              <div className="flex gap-2">
                <dt className="font-bold min-w-28">RSVP passes:</dt>
                <dd>{passes}</dd>
              </div>
            )}
          </dl>
          {t.frasePersonalizada && (
            <blockquote className="mt-6 border-l-4 border-[#7A002A] pl-4 italic leading-relaxed">
              {t.frasePersonalizada}
            </blockquote>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#7A002A]">Gallery</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {photos.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={`${t.nombre} photo ${i + 1}`}
                width={900}
                height={1200}
                className="w-full h-auto rounded-2xl"
                sizes="(max-width: 768px) 50vw, 400px"
              />
            ))}
          </div>
        </section>

        {(t.recepcionNombre || t.dressCodeTitulo) && (
          <section>
            <h2 className="text-2xl font-bold text-[#7A002A]">
              Venue &amp; dress code
            </h2>
            {t.recepcionNombre && (
              <p className="mt-3 leading-relaxed">
                <span className="font-bold">Reception: </span>
                {t.recepcionNombre}
                {t.recepcionDireccion ? `, ${t.recepcionDireccion}` : ""}
                {t.recepcionMapUrl && (
                  <>
                    {" "}
                    <a
                      href={t.recepcionMapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#7A002A] font-bold underline"
                    >
                      See map
                    </a>
                  </>
                )}
              </p>
            )}
            {t.dressCodeTitulo && (
              <p className="mt-3 leading-relaxed">
                <span className="font-bold">Dress code: </span>
                {t.dressCodeTitulo}
                {t.dressCodeNota ? ` — ${t.dressCodeNota}` : ""}
                {t.dressCodeColoresReservados
                  ? ` Reserved colors: ${t.dressCodeColoresReservados}.`
                  : ""}
              </p>
            )}
          </section>
        )}

        <section className="rounded-2xl bg-[#7A002A] text-white p-6 text-center">
          <h2 className="text-2xl font-bold">See it live, then make it yours</h2>
          <p className="mt-3 text-white/90">
            Open the live demo, then pick a package. Assisted $99. VIP $199.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href={`/demo/${t.slug}`}
              className="px-6 py-3 rounded-xl bg-white text-[#7A002A] font-extrabold"
            >
              See live demo →
            </Link>
            <Link
              href="/#precios"
              className="px-6 py-3 rounded-xl border-2 border-white text-white font-extrabold"
            >
              See packages
            </Link>
          </div>
        </section>
        <p className="text-center">
          <Link href="/" className="text-[#7A002A] font-bold underline">
            digital invitations in Los Angeles
          </Link>
        </p>
      </main>
    </>
  );
}
