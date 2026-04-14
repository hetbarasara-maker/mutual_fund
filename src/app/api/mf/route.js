// src/app/api/mf/route.js
import { NextResponse } from "next/server";

let cache = null;
let lastFetch = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function GET() {
  const now = Date.now();

  if (cache && now - lastFetch < CACHE_TTL) {
    console.log("Returning cached funds data");
    return NextResponse.json(cache);
  }

  try {
    console.log("Fetching funds from api.mfapi.in...");
    const res = await fetch("https://api.mfapi.in/mf");
    if (!res.ok) throw new Error("Failed to fetch schemes");

    const data = await res.json();
    console.log(`Fetched ${Array.isArray(data) ? data.length : 0} funds`);
    cache = data;
    lastFetch = now;

    return NextResponse.json(data);
  } catch (error) {
    console.error("API fetch error:", error);
    return NextResponse.json(
      { error: "Unable to fetch schemes", details: error.message },
      { status: 500 }
    );
  }
}
