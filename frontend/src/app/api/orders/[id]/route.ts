import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

const STATUS_TEXT_MAP: Record<string, string> = {
  pending: 'Đang xử lý',
  shipping: 'Đang giao',
  completed: 'Thành công',
  cancelled: 'Đã hủy',
};

// GET single order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderResult = await query('SELECT * FROM orders WHERE id = $1', [id]);

    if (orderResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    const order = orderResult.rows[0];
    const itemsResult = await query('SELECT * FROM order_items WHERE order_id = $1', [id]);

    const items = itemsResult.rows.map((item) => ({
      id: item.product_id || item.id,
      name: item.name,
      price: item.price,
      priceValue: Number(item.price_value),
      quantity: item.quantity,
      image: item.image,
    }));

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        date: order.created_at,
        customer: order.customer,
        phone: order.phone,
        address: order.address,
        notes: order.notes,
        subtotal: Number(order.subtotal),
        shippingFee: Number(order.shipping_fee),
        total: Number(order.total),
        totalFormatted: order.total_formatted,
        paymentMethod: order.payment_method,
        status: order.status,
        statusText: order.status_text || STATUS_TEXT_MAP[order.status] || 'Đang xử lý',
        createdAt: order.created_at,
        items,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT update full order (Admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      customer,
      phone,
      address,
      notes,
      status,
      paymentMethod,
      shippingFee,
      total,
      totalFormatted,
    } = body;

    const statusText = status ? (STATUS_TEXT_MAP[status] || 'Đang xử lý') : null;

    const sql = `
      UPDATE orders SET
        customer = COALESCE($1, customer),
        phone = COALESCE($2, phone),
        address = COALESCE($3, address),
        notes = COALESCE($4, notes),
        status = COALESCE($5, status),
        status_text = COALESCE($6, status_text),
        payment_method = COALESCE($7, payment_method),
        shipping_fee = COALESCE($8, shipping_fee),
        total = COALESCE($9, total),
        total_formatted = COALESCE($10, total_formatted)
      WHERE id = $11
      RETURNING *
    `;

    const queryParams = [
      customer ?? null,
      phone ?? null,
      address ?? null,
      notes ?? null,
      status ?? null,
      statusText,
      paymentMethod ?? null,
      shippingFee !== undefined ? Number(shippingFee) : null,
      total !== undefined ? Number(total) : null,
      totalFormatted ?? null,
      id,
    ];

    const result = await query(sql, queryParams);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cập nhật đơn hàng thành công',
      data: result.rows[0],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE order (Admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete order_items first
    await query('DELETE FROM order_items WHERE order_id = $1', [id]);
    const result = await query('DELETE FROM orders WHERE id = $1 RETURNING id, customer', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Đã xóa đơn hàng ${id} (${result.rows[0].customer}) thành công`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete order' },
      { status: 500 }
    );
  }
}
