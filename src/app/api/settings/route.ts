import { NextRequest, NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/settings';

export async function GET() {
  const settings = getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const settings = updateSettings(body);
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
