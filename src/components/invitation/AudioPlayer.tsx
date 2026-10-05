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
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Si no hay música configurada, no mostramos el botón
  if (!audioUrl) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        })
        .catch((err) => {
          console.warn("Autoplay bloqueado por el navegador:", err);
          setIsPlaying(false);
        });
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <audio ref={audioRef} src={audioUrl} loop preload="auto" />
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
