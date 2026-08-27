import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST /api/inventory/adjust
// Adjust stock quantity for a product with reasons
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, newQuantity, changeQuantity, reason } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Mã sản phẩm (productId) là bắt buộc' },
        { status: 400 }
      );
    }

    // Check if product exists
    const prodRes = await query('SELECT * FROM products WHERE id = $1', [productId]);
    if (prodRes.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Sản phẩm không tồn tại' },
        { status: 404 }
      );
    }

    const currentProduct = prodRes.rows[0];
    const currentQty = Number(currentProduct.stock_quantity || 0);

    let targetQty = currentQty;
    if (newQuantity !== undefined && newQuantity !== null) {
      targetQty = Math.max(0, Number(newQuantity));
    } else if (changeQuantity !== undefined && changeQuantity !== null) {
      targetQty = Math.max(0, currentQty + Number(changeQuantity));
    } else {
      return NextResponse.json(
        { success: false, message: 'Vui lòng cung cấp newQuantity hoặc changeQuantity' },
        { status: 400 }
      );
    }

    let derivedStock = 'Còn hàng';
    if (targetQty === 0) derivedStock = 'Hết hàng';
    else if (targetQty <= 5) derivedStock = 'Sắp hết hàng';

    const updateSql = `
      UPDATE products 
      SET 
        stock_quantity = $1,
        stock = $2,
        updated_at = timezone('utc'::text, now())
      WHERE id = $3
      RETURNING *
    `;

    const updateRes = await query(updateSql, [targetQty, derivedStock, productId]);
    const updatedRow = updateRes.rows[0];

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật tồn kho sản phẩm "${updatedRow.name}" thành công (${currentQty} -> ${targetQty})`,
      data: {
        id: updatedRow.id,
        name: updatedRow.name,
        previousQuantity: currentQty,
        stockQuantity: Number(updatedRow.stock_quantity),
        stock: updatedRow.stock,
        reason: reason || 'Điều chỉnh tồn kho thủ công',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to adjust inventory' },
      { status: 500 }
    );
  }
}
