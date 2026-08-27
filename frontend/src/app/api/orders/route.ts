import { NextRequest, NextResponse } from 'next/server';
import { query, pool } from '@/lib/db';

export const dynamic = 'force-dynamic';

const STATUS_TEXT_MAP: Record<string, string> = {
  pending: 'Đang xử lý',
  shipping: 'Đang giao',
  completed: 'Thành công',
  cancelled: 'Đã hủy',
};

// GET all orders
export async function GET() {
  try {
    const ordersResult = await query('SELECT * FROM orders ORDER BY created_at DESC');
    const itemsResult = await query('SELECT * FROM order_items');

    const orders = ordersResult.rows.map((order) => {
      const items = itemsResult.rows
        .filter((item) => item.order_id === order.id)
        .map((item) => ({
          id: item.product_id || item.id,
          name: item.name,
          price: item.price,
          priceValue: Number(item.price_value),
          quantity: item.quantity,
          image: item.image,
        }));

      return {
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
      };
    });

    return NextResponse.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST create new order (with automatic atomic stock deduction)
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  try {
    const body = await request.json();
    const {
      customer,
      phone,
      address,
      notes,
      items,
      subtotal,
      shippingFee,
      total,
      totalFormatted,
      paymentMethod,
    } = body;

    const orderId = `#MS-${Math.floor(10000 + Math.random() * 90000)}`;
    const formattedTotal = totalFormatted || `${(total || 0).toLocaleString('vi-VN')}đ`;

    await client.query('BEGIN');

    const orderSql = `
      INSERT INTO orders (
        id, customer, phone, address, notes, subtotal, shipping_fee, total,
        total_formatted, payment_method, status, status_text
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', 'Đang xử lý')
      RETURNING *
    `;

    const orderParams = [
      orderId,
      customer,
      phone,
      address,
      notes || '',
      subtotal || 0,
      shippingFee || 0,
      total || 0,
      formattedTotal,
      paymentMethod || 'COD',
    ];

    const orderRes = await client.query(orderSql, orderParams);

    if (Array.isArray(items)) {
      for (const item of items) {
        const itemSql = `
          INSERT INTO order_items (order_id, product_id, name, price, price_value, quantity, image)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        const qty = Number(item.quantity || 1);
        await client.query(itemSql, [
          orderId,
          item.id || null,
          item.name,
          item.price || `${(item.priceValue || 0).toLocaleString('vi-VN')}đ`,
          item.priceValue || 0,
          qty,
          item.image || '',
        ]);

        // Auto deduct inventory stock
        if (item.id) {
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
          `, [qty, item.id]);
        }
      }
    }

    await client.query('COMMIT');

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully and stock updated',
        orderId,
        data: {
          id: orderId,
          date: orderRes.rows[0].created_at,
          customer,
          phone,
          address,
          notes: notes || '',
          subtotal: Number(subtotal || 0),
          shippingFee: Number(shippingFee || 0),
          total: Number(total || 0),
          totalFormatted: formattedTotal,
          paymentMethod: paymentMethod || 'COD',
          status: 'pending',
          statusText: 'Đang xử lý',
          items: items || [],
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    await client.query('ROLLBACK');
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create order' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
