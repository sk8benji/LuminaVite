import { NextResponse } from "next/server";
import { listPlantillasPortal } from "@/lib/datos-plantillas";

// GET público: plantillas del catálogo para el selector del portal de datos.
// Solo expone nombre, estilo, demo e imagen — nada de datos del admin.
export async function GET() {
  const plantillas = await listPlantillasPortal();
  return NextResponse.json({ plantillas });
}
