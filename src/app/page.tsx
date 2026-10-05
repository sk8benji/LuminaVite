import Link from "next/link";
import { Sparkles, Smartphone, Zap, Music, Share2, Check, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FFF9FA] text-stone-800 flex flex-col justify-between selection:bg-pink-200">
      {/* Barra de Navegación */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🎀</span>
          <span className="text-xl font-bold tracking-tight text-[#5A3E44] font-serif">
            LuminaVite
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#5A3E44] hover:bg-pink-100/60 rounded-xl transition"
          >
            Dashboard
          </Link>
          <Link
            href="/eventos/nuevo"
            className="px-5 py-2.5 bg-[#5A3E44] hover:bg-[#432d32] text-white rounded-xl text-xs font-semibold uppercase tracking-widest shadow-md transition"
          >
            Crear Invitación
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-12 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 text-[#5A3E44] text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generador SaaS de Invitaciones Digitales 9:16</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-serif text-[#5A3E44] max-w-3xl leading-tight font-normal">
          Invitaciones multimedia interactivas para Bodas y Quinceañeras
        </h1>

        <p className="text-stone-600 text-sm sm:text-base max-w-2xl mt-4 leading-relaxed font-light">
          Diseños móviles verticales ultraligeros con música de fondo, itinerario, contador en vivo y confirmación RSVP directa a WhatsApp sin fricción.
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 w-full sm:w-auto">
          <Link
            href="/elsy-xv"
            className="w-full sm:w-auto px-7 py-3.5 bg-[#5A3E44] hover:bg-[#432d32] text-white rounded-2xl text-xs font-semibold uppercase tracking-widest shadow-lg transition flex items-center justify-center gap-2"
          >
            Ver Demo XV Años (Elsy)
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/sofia-y-alejandro"
            className="w-full sm:w-auto px-7 py-3.5 bg-white border border-pink-200 hover:border-pink-300 text-stone-800 rounded-2xl text-xs font-semibold uppercase tracking-widest shadow-sm transition flex items-center justify-center gap-2"
          >
            Ver Demo Boda (Sofía & Alejandro)
          </Link>
        </div>

        {/* Características Técnicas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 text-left max-w-4xl w-full">
          <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#5A3E44] flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 font-serif">Carga en &lt;1 segundo</h3>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              Páginas optimizadas para redes 4G móviles. Máxima velocidad de apertura cuando envías el link.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 font-serif">RSVP Directo a WhatsApp</h3>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              El invitado confirma sus pases y el mensaje se envía formateado al WhatsApp del organizador o salón.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <Music className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 font-serif">Multimedia con AWS S3</h3>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              Subida directa de fotos verticales y archivos MP3 con Presigned URLs sin sobrecargar tu servidor.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-stone-400 border-t border-pink-100/60">
        © {new Date().getFullYear()} LuminaVite SaaS • Diseñado para Railway, AWS S3 y PostgreSQL
      </footer>
    </div>
  );
}
