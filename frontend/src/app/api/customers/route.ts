import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all customers (with order stats calculation)
export async function GET() {
  try {
    const [customersRes, ordersRes] = await Promise.all([
      query('SELECT * FROM customers ORDER BY created_at DESC'),
      query('SELECT customer, phone, total, status FROM orders'),
    ]);

    const formatted = customersRes.rows.map((c) => {
      // Find matching orders by phone or customer name
      const matchingOrders = ordersRes.rows.filter(
        (o) =>
          (c.phone && o.phone === c.phone) ||
          (o.customer && o.customer.toLowerCase() === c.name.toLowerCase())
      );

      const totalOrders = matchingOrders.length;
      const totalSpent = matchingOrders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + Number(o.total || 0), 0);

      return {
        id: c.id,
        name: c.name,
        email: c.email || '',
        phone: c.phone || '',
        address: c.address || '',
        role: c.role || 'customer',
        notes: c.notes || '',
        totalOrders,
        totalSpent,
        createdAt: c.created_at,
      };
    });

    return NextResponse.json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST create customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, email, phone, address, role, notes } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Họ và tên khách hàng là bắt buộc' },
        { status: 400 }
      );
    }

    const customerId = id || `c_${Date.now().toString(36)}`;

    // Check duplicate email if provided
    if (email) {
      const existing = await query('SELECT id FROM customers WHERE email = $1', [
        email.trim().toLowerCase(),
      ]);
      if (existing.rows.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: `Email ${email} đã được đăng ký trong hệ thống`,
          },
          { status: 400 }
        );
      }
    }

    const sql = `
      INSERT INTO customers (id, name, email, phone, address, role, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const params = [
      customerId,
      name.trim(),
      email ? email.trim().toLowerCase() : null,
      phone ? phone.trim() : null,
      address ? address.trim() : null,
      role || 'customer',
      notes || '',
    ];

    const result = await query(sql, params);
    const row = result.rows[0];

    return NextResponse.json(
      {
        success: true,
        message: 'Tạo khách hàng mới thành công',
        data: {
          id: row.id,
          name: row.name,
          email: row.email,
          phone: row.phone,
          address: row.address,
          role: row.role,
          notes: row.notes,
          totalOrders: 0,
          totalSpent: 0,
          createdAt: row.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create customer' },
      { status: 500 }
    );
  }
}
