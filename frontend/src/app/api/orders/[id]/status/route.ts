import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export const dynamic = 'force-dynamic';

const STATUS_TEXT_MAP: Record<string, string> = {
  pending: 'Đang xử lý',
  shipping: 'Đang giao',
  completed: 'Thành công',
  cancelled: 'Đã hủy',
};

// PATCH update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ['pending', 'shipping', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Trạng thái không hợp lệ. Phải là một trong: ${validStatuses.join(', ')}`,
        },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // Get current order status
    const currentOrderRes = await client.query('SELECT status FROM orders WHERE id = $1', [id]);
    if (currentOrderRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    const previousStatus = currentOrderRes.rows[0].status;
    const statusText = STATUS_TEXT_MAP[status] || 'Đang xử lý';

    const sql = `
      UPDATE orders
      SET status = $1, status_text = $2
      WHERE id = $3
      RETURNING *
    `;

    const result = await client.query(sql, [status, statusText, id]);

    // If changing to cancelled, restore stock for all products in this order
    if (status === 'cancelled' && previousStatus !== 'cancelled') {
      const itemsRes = await client.query('SELECT product_id, quantity FROM order_items WHERE order_id = $1', [id]);
      for (const it of itemsRes.rows) {
        if (it.product_id) {
          const qty = Number(it.quantity || 1);
          await client.query(`
            UPDATE products
            SET
              stock_quantity = stock_quantity + $1,
              stock = CASE 
                WHEN stock_quantity + $1 <= 0 THEN 'Hết hàng'
                WHEN stock_quantity + $1 <= 5 THEN 'Sắp hết hàng'
                ELSE 'Còn hàng'
              END,
              updated_at = timezone('utc'::text, now())
            WHERE id = $2
          `, [qty, it.product_id]);
        }
      }
    }

    // If recovering from cancelled to active, deduct stock again
    if (previousStatus === 'cancelled' && status !== 'cancelled') {
      const itemsRes = await client.query('SELECT product_id, quantity FROM order_items WHERE order_id = $1', [id]);
      for (const it of itemsRes.rows) {
        if (it.product_id) {
          const qty = Number(it.quantity || 1);
          await client.query(`
            UPDATE products
            SET
              stock_quantity = GREATEST(0, stock_quantity - $1),
              stock = CASE 
                WHEN stock_quantity - $1 <= 0 THEN 'Hết hàng'
                WHEN stock_quantity - $1 <= 5 THEN 'Sắp hết hàng'
                ELSE 'Còn hàng'
              END,
              updated_at = timezone('utc'::text, now())
            WHERE id = $2
          `, [qty, it.product_id]);
        }
      }
    }

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật trạng thái đơn hàng: ${statusText}`,
      data: result.rows[0],
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update order status' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
