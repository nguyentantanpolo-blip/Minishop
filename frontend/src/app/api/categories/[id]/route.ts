import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await query('SELECT * FROM categories WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, image } = body;

    const sql = `
      UPDATE categories
      SET 
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        image = COALESCE($3, image)
      WHERE id = $4
      RETURNING *
    `;
    const queryParams = [name ?? null, description ?? null, image ?? null, id];

    const result = await query(sql, queryParams);
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    // Also update category_name in products table
    if (name) {
      await query('UPDATE products SET category_name = $1 WHERE category_id = $2', [name, id]);
    }

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if category has products
    const checkProds = await query('SELECT COUNT(*) FROM products WHERE category_id = $1', [id]);
    const prodCount = parseInt(checkProds.rows[0].count, 10);

    if (prodCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Không thể xóa danh mục vì đang có ${prodCount} sản phẩm thuộc danh mục này. Vui lòng chuyển hoặc xóa sản phẩm trước.`,
        },
        { status: 400 }
      );
    }

    const result = await query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}
