"use client";

import React, { useState, useEffect } from "react";
import { TemplateConfig } from "@/lib/templates";

interface CountdownTimerProps {
  targetDate: string | Date;
  template: TemplateConfig;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isFinished: boolean;
}

export default function CountdownTimer({ targetDate, template }: CountdownTimerProps) {
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
        <div className="h-20 animate-pulse bg-stone-200/50 rounded-2xl" />
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
          style={{ fontFamily: template.fontSubheading }}
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
    { label: "Días", value: pad(timeLeft.days) },
    { label: "Horas", value: pad(timeLeft.hours) },
    { label: "Min", value: pad(timeLeft.minutes) },
    { label: "Seg", value: pad(timeLeft.seconds) },
  ];

  return (
    <section
      className="mx-4 my-6 p-6 rounded-3xl text-center shadow-sm border backdrop-blur-sm transition-all"
      style={{
        backgroundColor: `${template.cardBg}F2`,
        borderColor: template.borderSoft,
      }}
    >
      <p
        className="text-xs uppercase tracking-widest font-semibold mb-4"
        style={{
          color: template.textPrimary,
          fontFamily: template.fontSubheading,
        }}
      >
        Faltan muy pocos días
      </p>

      <div className="grid grid-cols-4 gap-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-3 rounded-2xl border transition-all"
            style={{
              backgroundColor: template.cardBg,
              borderColor: template.borderSoft,
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            }}
          >
            <span
              className="text-2xl sm:text-3xl font-bold tracking-tight"
              style={{
                color: template.textPrimary,
                fontFamily: template.fontSubheading,
              }}
            >
              {item.value}
            </span>
            <span
              className="text-[9px] uppercase tracking-wider font-medium mt-1 opacity-70"
              style={{
                color: template.textSecondary,
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
