// File: app/api/mf/active/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching active schemes...');
    const response = await fetch('https://api.mfapi.in/mf', {
      next: { revalidate: 86400 }, // cache 1 day
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from external API: ${response.statusText}`);
    }

    const allSchemes = await response.json();
    console.log(`Total schemes received: ${Array.isArray(allSchemes) ? allSchemes.length : 0}`);

    // Filter: schemes that have actual ISIN codes (active)
    const activeSchemes = Array.isArray(allSchemes) 
      ? allSchemes.filter(scheme => scheme.isinGrowth || scheme.isinDividend)
      : [];

    console.log(`Active schemes after filter: ${activeSchemes.length}`);

    // If filter works, use it; otherwise return all schemes
    const result = activeSchemes.length > 0 ? activeSchemes : allSchemes;
    console.log(`Returning ${result.length} schemes`);

    return NextResponse.json({ 
      data: result,
      count: result.length,
      isActive: activeSchemes.length > 0
    });
    
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch active mutual fund data.',
        details: error.message
      },
      { status: 500 }
    );
  }
}