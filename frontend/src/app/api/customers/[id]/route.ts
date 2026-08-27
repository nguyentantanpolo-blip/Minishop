import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET single customer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await query('SELECT * FROM customers WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Khách hàng không tồn tại' },
        { status: 404 }
      );
    }

    const c = result.rows[0];
    const ordersRes = await query(
      'SELECT * FROM orders WHERE phone = $1 OR customer ILIKE $2 ORDER BY created_at DESC',
      [c.phone, c.name]
    );

    return NextResponse.json({
      success: true,
      data: {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        address: c.address,
        role: c.role,
        notes: c.notes,
        totalOrders: ordersRes.rows.length,
        totalSpent: ordersRes.rows
          .filter((o) => o.status !== 'cancelled')
          .reduce((sum, o) => sum + Number(o.total || 0), 0),
        orders: ordersRes.rows,
        createdAt: c.created_at,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

// PUT update customer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, phone, address, role, notes } = body;

    const sql = `
      UPDATE customers SET
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        phone = COALESCE($3, phone),
        address = COALESCE($4, address),
        role = COALESCE($5, role),
        notes = COALESCE($6, notes)
      WHERE id = $7
      RETURNING *
    `;

    const queryParams = [
      name ? name.trim() : null,
      email ? email.trim().toLowerCase() : null,
      phone ? phone.trim() : null,
      address ? address.trim() : null,
      role ?? null,
      notes ?? null,
      id,
    ];

    const result = await query(sql, queryParams);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Khách hàng không tồn tại' },
        { status: 404 }
      );
    }

    const row = result.rows[0];
    return NextResponse.json({
      success: true,
      message: 'Cập nhật thông tin khách hàng thành công',
      data: {
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        address: row.address,
        role: row.role,
        notes: row.notes,
        createdAt: row.created_at,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// DELETE customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await query('DELETE FROM customers WHERE id = $1 RETURNING name, email', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Khách hàng không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Đã xóa khách hàng ${result.rows[0].name} thành công`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
