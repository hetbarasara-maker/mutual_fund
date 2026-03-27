// File: app/api/mf/active/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.mfapi.in/mf', {
      next: { revalidate: 86400 }, // cache 1 day
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from external API: ${response.statusText}`);
    }

    const allSchemes = await response.json();

    // Filter: only schemes with isinGrowth (active)
    const activeSchemes = allSchemes.filter(scheme => scheme.isinGrowth !== null);

    return NextResponse.json({ data: activeSchemes });
    
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active mutual fund data.' },
      { status: 500 }
    );
  }
}