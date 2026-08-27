import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all products (with optional filtering by category or search term)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let sql = 'SELECT * FROM products';
    const params: any[] = [];

    if (category && category !== 'all') {
      params.push(category);
      sql += ` WHERE category_id = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += params.length === 1 ? ' WHERE' : ' AND';
      sql += ` (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }

    sql += ' ORDER BY created_at ASC';

    const result = await query(sql, params);

    const formatted = result.rows.map((row) => {
      const stockQty = row.stock_quantity !== undefined && row.stock_quantity !== null ? Number(row.stock_quantity) : 50;
      let stockStatus = row.stock;
      if (stockQty === 0) stockStatus = 'Hết hàng';
      else if (stockQty <= 5) stockStatus = 'Sắp hết hàng';
      else if (!stockStatus || stockStatus === 'Hết hàng') stockStatus = 'Còn hàng';

      return {
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
    });

    return NextResponse.json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST create product (Admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
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

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Tên sản phẩm là bắt buộc' },
        { status: 400 }
      );
    }

    const productId = id || `p_${Date.now().toString(36)}`;
    const formattedPrice = price || `${(priceValue || 0).toLocaleString('vi-VN')}đ`;
    const qty = stockQuantity !== undefined ? Math.max(0, Number(stockQuantity)) : 50;
    
    let derivedStock = stock;
    if (qty === 0) derivedStock = 'Hết hàng';
    else if (qty <= 5) derivedStock = 'Sắp hết hàng';
    else if (!derivedStock || derivedStock === 'Hết hàng') derivedStock = 'Còn hàng';

    const sql = `
      INSERT INTO products (
        id, name, price, old_price, discount, price_value, description,
        category_id, category_name, image, badge, stock, stock_quantity, specs
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const params = [
      productId,
      name,
      formattedPrice,
      oldPrice || null,
      discount || null,
      priceValue || 0,
      desc || '',
      category || null,
      categoryName || null,
      image || '/assets/images/products/bo5-1.jpg',
      badge || null,
      derivedStock,
      qty,
      JSON.stringify(specs || {}),
    ];

    const result = await query(sql, params);
    const row = result.rows[0];

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully',
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
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
