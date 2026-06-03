import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function extractState(name: string) {
  const parts = name.split(",").map((part) => part.trim()).filter(Boolean);
  return parts.length >= 2 ? parts[parts.length - 2].toLowerCase() : "";
}

export async function POST(request: NextRequest) {
  let body: {
    from_lat?: number;
    from_lon?: number;
    to_lat?: number;
    to_lon?: number;
    from_name?: string;
    to_name?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body.from_lat !== "number" ||
    typeof body.from_lon !== "number" ||
    typeof body.to_lat !== "number" ||
    typeof body.to_lon !== "number"
  ) {
    return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
  }

  const url = new URL(
    `https://router.project-osrm.org/route/v1/driving/${body.from_lon},${body.from_lat};${body.to_lon},${body.to_lat}`
  );
  url.searchParams.set("overview", "full");
  url.searchParams.set("geometries", "geojson");

  try {
    const response = await fetch(url.toString(), { cache: "no-store" });
    if (!response.ok) {
      return NextResponse.json({ error: "OSRM error" }, { status: 502 });
    }

    const data = (await response.json()) as {
      code?: string;
      routes?: Array<{ distance: number; duration: number; geometry: { coordinates: Array<[number, number]> } }>;
    };

    if (data.code !== "Ok" || !data.routes?.[0]) {
      return NextResponse.json({ error: "No route found" }, { status: 404 });
    }

    const route = data.routes[0];
    return NextResponse.json(
      {
        distance_km: Number((route.distance / 1000).toFixed(2)),
        duration_min: Math.max(1, Math.round(route.duration / 60)),
        polyline: route.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
        is_interstate: Boolean(
          body.from_name && body.to_name && extractState(body.from_name) && extractState(body.to_name) && extractState(body.from_name) !== extractState(body.to_name)
        ),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Route lookup failed" }, { status: 502 });
  }
}
