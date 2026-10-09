import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Healthcheck endpoint for Railway / Cloud monitoring.
 * Executes a fast `SELECT 1` against PostgreSQL.
 * Returns 200 OK if the database is reachable, or 503 Service Unavailable on connection failure.
 */
export async function GET() {
  const startTime = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const responseTimeMs = Date.now() - startTime;

    return NextResponse.json(
      {
        status: "healthy",
        database: "connected",
        responseTime: `${responseTimeMs}ms`,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ [HEALTHCHECK] Database connection failed:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error: error?.message || "Cannot connect to database",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
