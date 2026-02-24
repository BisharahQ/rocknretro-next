import { NextRequest, NextResponse } from 'next/server';
import { getSections, updateSections } from '@/lib/sections';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sections = await getSections();
  return NextResponse.json(sections);
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const sections = await updateSections(body);
    return NextResponse.json(sections);
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
