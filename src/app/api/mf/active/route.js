// File: app/api/mf/active/route.js
import { NextResponse } from 'next/server';

let cachedSchemes = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '24', 10);
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'name_asc';

    const now = Date.now();

    // 1. Fetch & parse all schemes if cache expired or null
    if (!cachedSchemes || (now - lastFetchTime) > CACHE_DURATION) {
      console.log('Fetching active schemes from external API...');
      const response = await fetch('https://api.mfapi.in/mf', {
        next: { revalidate: 86400 }, // 1 day CDN cache
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch from external API: ${response.statusText}`);
      }

      const allSchemes = await response.json();
      
      // Deduplicate schemes immediately by schemeCode on server
      if (Array.isArray(allSchemes)) {
        const uniqueMap = new Map();
        for (const item of allSchemes) {
          if (item && item.schemeCode) {
            const key = String(item.schemeCode).trim();
            uniqueMap.set(key, item);
          }
        }
        cachedSchemes = Array.from(uniqueMap.values());
      } else {
        cachedSchemes = [];
      }
      lastFetchTime = now;
      console.log(`Cached ${cachedSchemes.length} unique schemes in memory`);
    }

    // 2. Filter schemes by search parameter
    let filtered = cachedSchemes;
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = cachedSchemes.filter(s => 
        s.schemeName && s.schemeName.toLowerCase().includes(searchLower)
      );
    }

    // 3. Sort schemes
    if (sort === 'name_asc') {
      filtered.sort((a, b) => a.schemeName.localeCompare(b.schemeName));
    } else if (sort === 'name_desc') {
      filtered.sort((a, b) => b.schemeName.localeCompare(a.schemeName));
    }

    // 4. Paginate
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
    console.error('API Route Error in /api/mf/active:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch active mutual fund data.',
        details: error.message
      },
      { status: 500 }
    );
  }
}