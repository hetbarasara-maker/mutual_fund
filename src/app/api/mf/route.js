// src/app/api/mf/route.js
import { NextResponse } from "next/server";

let cache = null;
let lastFetch = 0;
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'name_asc';

    const now = Date.now();

    if (!cache || (now - lastFetch) > CACHE_TTL) {
      console.log("Fetching funds from api.mfapi.in...");
      const res = await fetch("https://api.mfapi.in/mf", {
        next: { revalidate: 86400 },
      });
      if (!res.ok) throw new Error("Failed to fetch schemes");

      const data = await res.json();
      
      // Deduplicate schemes on server
      if (Array.isArray(data)) {
        const uniqueMap = new Map();
        for (const item of data) {
          if (item && item.schemeCode) {
            const key = String(item.schemeCode).trim();
            uniqueMap.set(key, item);
          }
        }
        cache = Array.from(uniqueMap.values());
      } else {
        cache = [];
      }
      lastFetch = now;
      console.log(`Fetched and cached ${cache.length} unique funds`);
    }

    // Filter by search query
    let filtered = cache;
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = cache.filter(s => 
        s.schemeName && s.schemeName.toLowerCase().includes(searchLower)
      );
    }

    // Sort by name
    if (sort === 'name_asc') {
      filtered.sort((a, b) => a.schemeName.localeCompare(b.schemeName));
    } else if (sort === 'name_desc') {
      filtered.sort((a, b) => b.schemeName.localeCompare(a.schemeName));
    }

    // Paginate
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const paginatedData = filtered.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      data: paginatedData,
      total: totalCount,
      pages: totalPages,
      page,
      limit
    });

  } catch (error) {
    console.error("API fetch error in /api/mf:", error);
    return NextResponse.json(
      { error: "Unable to fetch schemes", details: error.message },
      { status: 500 }
    );
  }
}
