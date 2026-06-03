import { rest, supabaseHeaders } from "@/lib/server/supabase";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const rideCatalog = [
  { id: "1", service: "Uber", type: "UberX", base: 30, perKm: 12, speed: 35, eco: false, public: false },
  { id: "2", service: "Uber", type: "UberXL", base: 50, perKm: 16, speed: 32, eco: false, public: false },
  { id: "3", service: "Ola", type: "Mini", base: 25, perKm: 10, speed: 35, eco: false, public: false },
  { id: "4", service: "Ola", type: "Sedan", base: 40, perKm: 14, speed: 33, eco: false, public: false },
  { id: "5", service: "Rapido", type: "Bike", base: 15, perKm: 7, speed: 40, eco: true, public: false },
  { id: "6", service: "Metro", type: "Public", base: 5, perKm: 2, speed: 45, eco: true, public: true },
  { id: "7", service: "Bus", type: "Public", base: 3, perKm: 1.5, speed: 25, eco: true, public: true },
];

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const radius = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function POST(request: NextRequest) {
  let body: {
    from_location?: string;
    to_location?: string;
    from_lat?: number | null;
    from_lon?: number | null;
    to_lat?: number | null;
    to_lon?: number | null;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const fromLocation = body.from_location?.trim() ?? "";
  const toLocation = body.to_location?.trim() ?? "";
  if (!fromLocation || !toLocation) {
    return NextResponse.json({ error: "Both locations required" }, { status: 400 });
  }

  const hasCoords =
    typeof body.from_lat === "number" &&
    typeof body.from_lon === "number" &&
    typeof body.to_lat === "number" &&
    typeof body.to_lon === "number";

  const distance = hasCoords
    ? Number(haversine(body.from_lat as number, body.from_lon as number, body.to_lat as number, body.to_lon as number).toFixed(2))
    : 10;

  const results = rideCatalog.map((ride) => ({
    id: ride.id,
    service: ride.service,
    type: ride.type,
    estimated_time: Math.max(1, Math.round((distance / ride.speed) * 60)),
    estimated_price: Number((ride.base + ride.perKm * distance).toFixed(2)),
    distance,
    eco_friendly: ride.eco,
    is_public: ride.public,
  }));

  try {
    await fetch(rest("searches"), {
      method: "POST",
      headers: supabaseHeaders(),
      body: JSON.stringify({ from_location: fromLocation, to_location: toLocation }),
      cache: "no-store",
    });
  } catch {
    // best effort only
  }

  return NextResponse.json(results, { status: 200 });
}
