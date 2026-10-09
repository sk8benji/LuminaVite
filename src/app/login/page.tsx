"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Por favor ingresa la contraseña.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Contraseña incorrecta.");
      }

      // Redirigir a la URL de destino o a la raíz
      window.location.href = nextUrl;
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 sm:p-10 bg-white rounded-3xl border border-pink-100 shadow-2xl relative overflow-hidden">
      {/* Detalle decorativo superior */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-400 via-pink-500 to-amber-300" />

      {/* Cabecera / Branding */}
      <div className="text-center space-y-2 mb-8">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-pink-50 text-[#7A002A] flex items-center justify-center border border-pink-200/80 shadow-sm mb-3">
          <Lock className="w-6 h-6 text-[#7A002A]" />
        </div>

        <h1 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
          Click and love
        </h1>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A002A]">
          Panel de Administración
        </p>
        <p className="text-xs text-stone-500 max-w-xs mx-auto pt-1 leading-relaxed">
          Ingresa la contraseña maestra para administrar las invitaciones y eventos.
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            Contraseña de Acceso
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoFocus
              className="w-full pl-4 pr-11 py-3 bg-stone-50 border border-stone-200 focus:border-[#7A002A] focus:bg-white rounded-xl text-sm text-stone-900 transition-all outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
              aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-shake">
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#7A002A] hover:bg-[#5e0020] text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span>Verificando...</span>
          ) : (
            <>
              <span>Acceder al Panel</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Pie de página sutil */}
      <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Acceso restringido y protegido por sesión cifrada</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FFF9FA] flex flex-col justify-center items-center p-4 selection:bg-pink-200">
      <Suspense fallback={<div className="text-sm text-stone-400">Cargando...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
