import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://cvefeed.io/rssfeed/latest.xml', {
      headers: {
        'Origin': 'https://cvefeed.io',
        'User-Agent': 'Mozilla/5.0',
      },
    });
    
    const data = await response.text();
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching security news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}