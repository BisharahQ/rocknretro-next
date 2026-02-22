import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, getAuthCookieConfig } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    if (verifyPassword(password)) {
      const config = getAuthCookieConfig();
      const response = NextResponse.json({ success: true });
      response.cookies.set(config);
      return response;
    }
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('rnr_admin');
  return response;
}
