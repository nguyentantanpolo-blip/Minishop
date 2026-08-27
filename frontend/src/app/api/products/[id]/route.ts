import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    const row = result.rows[0];
    const stockQty = row.stock_quantity !== undefined && row.stock_quantity !== null ? Number(row.stock_quantity) : 50;
    let stockStatus = row.stock;
    if (stockQty === 0) stockStatus = 'Hết hàng';
    else if (stockQty <= 5) stockStatus = 'Sắp hết hàng';
    else if (!stockStatus || stockStatus === 'Hết hàng') stockStatus = 'Còn hàng';

    const formatted = {
      id: row.id,
      name: row.name,
      price: row.price,
      oldPrice: row.old_price,
      discount: row.discount,
      priceValue: Number(row.price_value),
      desc: row.description,
      category: row.category_id,
      categoryName: row.category_name,
      image: row.image,
      badge: row.badge,
      stock: stockStatus,
      stockQuantity: stockQty,
      specs: typeof row.specs === 'string' ? JSON.parse(row.specs) : row.specs || {},
      createdAt: row.created_at,
    };

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT update product (Admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      price,
      oldPrice,
      discount,
      priceValue,
      desc,
      category,
      categoryName,
      image,
      badge,
      stock,
      stockQuantity,
      specs,
    } = body;

    let derivedStock = stock;
    let qty = stockQuantity !== undefined && stockQuantity !== null ? Math.max(0, Number(stockQuantity)) : null;

    if (qty !== null) {
      if (qty === 0) derivedStock = 'Hết hàng';
      else if (qty <= 5) derivedStock = 'Sắp hết hàng';
      else if (!derivedStock || derivedStock === 'Hết hàng') derivedStock = 'Còn hàng';
    }

    const sql = `
      UPDATE products SET
        name = COALESCE($1, name),
        price = COALESCE($2, price),
        old_price = COALESCE($3, old_price),
        discount = COALESCE($4, discount),
        price_value = COALESCE($5, price_value),
        description = COALESCE($6, description),
        category_id = COALESCE($7, category_id),
        category_name = COALESCE($8, category_name),
        image = COALESCE($9, image),
        badge = COALESCE($10, badge),
        stock = COALESCE($11, stock),
        stock_quantity = COALESCE($12, stock_quantity),
        specs = COALESCE($13, specs)
      WHERE id = $14
      RETURNING *
    `;

    const queryParams = [
      name ?? null,
      price ?? null,
      oldPrice ?? null,
      discount ?? null,
      priceValue !== undefined ? Number(priceValue) : null,
      desc ?? null,
      category ?? null,
      categoryName ?? null,
      image ?? null,
      badge ?? null,
      derivedStock ?? null,
      qty,
      specs ? (typeof specs === 'string' ? specs : JSON.stringify(specs)) : null,
      id,
    ];

    const result = await query(sql, queryParams);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    const row = result.rows[0];
    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        id: row.id,
        name: row.name,
        price: row.price,
        oldPrice: row.old_price,
        discount: row.discount,
        priceValue: Number(row.price_value),
        desc: row.description,
        category: row.category_id,
        categoryName: row.category_name,
        image: row.image,
        badge: row.badge,
        stock: row.stock,
        stockQuantity: Number(row.stock_quantity),
        specs: typeof row.specs === 'string' ? JSON.parse(row.specs) : row.specs || {},
        createdAt: row.created_at,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE product (Admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING id, name', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Product ${result.rows[0].name} (${id}) deleted successfully`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
