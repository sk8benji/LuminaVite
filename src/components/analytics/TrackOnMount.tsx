"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

// Dispara un evento GA4 una sola vez al montar (ej. view_demo al abrir
// una demo). Sin UI.
export default function TrackOnMount({
  event,
  eventParams,
}: {
  event: string;
  eventParams?: Record<string, string | number>;
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track(event, eventParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
