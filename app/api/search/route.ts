import { searchCatalogue } from '@/lib/catalogues';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') ?? '';
  const results = await searchCatalogue(q);
  return NextResponse.json(results);
}
