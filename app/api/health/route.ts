/**
 * Follicia — DB Health Check Route
 * GET /api/health
 *
 * Verifies the NeonDB connection is alive.
 * Can be hit from the browser or curl to confirm connectivity.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // A lightweight raw query — cheaper than a full model query
        await prisma.$queryRaw`SELECT 1`;
        return NextResponse.json({
            status: "ok",
            database: "connected",
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("❌ Health check failed:", message);
        return NextResponse.json(
            { status: "error", database: "unreachable", message },
            { status: 503 }
        );
    }
}
