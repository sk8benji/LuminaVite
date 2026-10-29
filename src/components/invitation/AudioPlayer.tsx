"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { TemplateConfig } from "@/lib/templates";

interface AudioPlayerProps {
  audioUrl?: string | null;
  template: TemplateConfig;
}

export default function AudioPlayer({ audioUrl, template }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // La decisión play/pause se toma con audio.paused, no con el estado,
  // para que los listeners no queden con un cierre obsoleto.
  const playAudio = () => {
    if (!audioRef.current) return;
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn("Autoplay bloqueado:", err);
        setIsPlaying(false);
      });
  };
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      playAudio();
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Escuchar eventos: play-audio inicia (apertura del sobre), toggle-audio
  // alterna (disco del hero y botón flotante comparten este estado).
  useEffect(() => {
    const handleStartAudio = () => {
      if (audioRef.current && audioRef.current.paused) playAudio();
    };
    const handleToggleAudio = () => toggleAudio();

    window.addEventListener("luminavite:play-audio", handleStartAudio);
    window.addEventListener("luminavite:toggle-audio", handleToggleAudio);
    return () => {
      window.removeEventListener("luminavite:play-audio", handleStartAudio);
      window.removeEventListener("luminavite:toggle-audio", handleToggleAudio);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Publicar el estado para que el disco del hero (y cualquier otro
  // botón) muestre el mismo icono y texto que el botón flotante.
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("luminavite:audio-state", { detail: { isPlaying } })
    );
  }, [isPlaying]);

  if (!audioUrl) return null;

  const togglePlay = () => toggleAudio();

  return (
    <div className="fixed top-4 right-4 z-40">
      <audio ref={audioRef} src={audioUrl} loop preload="none" />
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        className={`relative flex items-center justify-center w-11 h-11 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 transform active:scale-90 ${
          isPlaying
            ? "border-2"
            : "border opacity-85 hover:opacity-100"
        }`}
        style={{
          backgroundColor: `${template.cardBg}E6`,
          borderColor: template.accentColor,
          color: template.textPrimary,
        }}
      >
        {isPlaying && (
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-30"
            style={{ backgroundColor: template.accentColor }}
          />
        )}
        {isPlaying ? (
          <Volume2 className="w-5 h-5 animate-pulse" />
        ) : (
          <div className="relative">
            <Music className="w-5 h-5" />
            <span
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
              style={{ backgroundColor: template.accentColor }}
            />
          </div>
        )}
      </button>
    </div>
  );
}
