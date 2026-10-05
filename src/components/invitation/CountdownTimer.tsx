"use client";

import React, { useState, useEffect } from "react";
import { TemplateConfig } from "@/lib/templates";

interface CountdownTimerProps {
  targetDate: string | Date;
  template: TemplateConfig;
  titulo?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isFinished: boolean;
}

export default function CountdownTimer({
  targetDate,
  template,
  titulo = "I CAN'T WAIT TO CELEBRATE WITH YOU!",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isFinished: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const destination = new Date(targetDate).getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const difference = destination - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isFinished: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isFinished: false });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const pad = (n: number) => String(n).padStart(2, "0");

  if (!mounted) {
    return (
      <div className="py-6 px-4 text-center">
        <div className="h-24 animate-pulse bg-pink-100/40 rounded-3xl" />
      </div>
    );
  }

  if (timeLeft.isFinished) {
    return (
      <section
        className="mx-4 my-6 p-6 rounded-3xl text-center shadow-sm border"
        style={{
          backgroundColor: template.cardBg,
          borderColor: template.borderSoft,
          color: template.textPrimary,
        }}
      >
        <span className="text-3xl">🎉</span>
        <h3
          className="text-base font-semibold uppercase tracking-wider mt-2"
          style={{ fontFamily: template.fontSubheading, color: "#9E2A4B" }}
        >
          ¡El Gran Día Ha Llegado!
        </h3>
        <p className="text-xs opacity-75 mt-1" style={{ fontFamily: template.fontBody }}>
          Estamos celebrando este momento tan especial.
        </p>
      </section>
    );
  }

  const items = [
    { label: "Days", value: pad(timeLeft.days) },
    { label: "Hours", value: pad(timeLeft.hours) },
    { label: "Minutes", value: pad(timeLeft.minutes) },
    { label: "Seconds", value: pad(timeLeft.seconds) },
  ];

  return (
    <section
      className="mx-4 my-6 p-6 rounded-3xl text-center shadow-sm border backdrop-blur-sm transition-all"
      style={{
        backgroundColor: `${template.cardBg}F5`,
        borderColor: "#FADCE0",
      }}
    >
      <h3
        className="text-xs sm:text-sm uppercase tracking-widest font-bold mb-4"
        style={{
          color: "#9E2A4B",
          fontFamily: template.fontSubheading,
        }}
      >
        {titulo}
      </h3>

      <div className="grid grid-cols-4 gap-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-3 rounded-2xl border transition-all"
            style={{
              backgroundColor: "#FFF9FA",
              borderColor: "#FCECEE",
              boxShadow: "0 2px 8px rgba(158, 42, 75, 0.04)",
            }}
          >
            <span
              className="text-2xl sm:text-3xl font-bold tracking-tight"
              style={{
                color: "#9E2A4B",
                fontFamily: template.fontSubheading,
              }}
            >
              {item.value}
            </span>
            <span
              className="text-[9px] uppercase tracking-wider font-semibold mt-1 opacity-70"
              style={{
                color: "#7A6E70",
                fontFamily: template.fontBody,
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
