import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const startTime = Date.now();
    const [catRes, prodRes, orderRes, itemRes, customerRes] = await Promise.all([
      query('SELECT count(*) FROM categories'),
      query('SELECT count(*) FROM products'),
      query('SELECT count(*) FROM orders'),
      query('SELECT count(*) FROM order_items'),
      query('SELECT count(*) FROM customers'),
    ]);

    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      status: 'connected',
      database: 'Supabase PostgreSQL',
      latency: `${durationMs}ms`,
      stats: {
        categories: parseInt(catRes.rows[0].count, 10),
        products: parseInt(prodRes.rows[0].count, 10),
        orders: parseInt(orderRes.rows[0].count, 10),
        orderItems: parseInt(itemRes.rows[0].count, 10),
        customers: parseInt(customerRes.rows[0].count, 10),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'disconnected',
        error: error.message || 'Database check failed',
      },
      { status: 500 }
    );
  }
}
