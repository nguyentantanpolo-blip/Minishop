import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all categories
export async function GET() {
  try {
    const result = await query('SELECT * FROM categories ORDER BY id ASC');
    return NextResponse.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST create category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, image } = body;

    if (!id || !name) {
      return NextResponse.json(
        { success: false, message: 'ID và tên danh mục là bắt buộc' },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO categories (id, name, description, image)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const params = [
      id.trim().toLowerCase().replace(/\s+/g, '-'),
      name.trim(),
      description || '',
      image || '/assets/images/products/bo5-1.jpg',
    ];

    const result = await query(sql, params);
    return NextResponse.json(
      {
        success: true,
        message: 'Category created successfully',
        data: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}
