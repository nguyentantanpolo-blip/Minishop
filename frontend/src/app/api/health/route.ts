import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: 'Next.js + Supabase API server is running smoothly',
    timestamp: new Date().toISOString(),
  });
}
