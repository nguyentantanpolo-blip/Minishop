import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET overview statistics for Admin Dashboard
export async function GET() {
  try {
    const [ordersRes, prodsRes, catsRes, itemsRes, customersRes] =
      await Promise.all([
        query('SELECT * FROM orders ORDER BY created_at DESC'),
        query('SELECT * FROM products'),
        query('SELECT * FROM categories'),
        query('SELECT * FROM order_items'),
        query('SELECT * FROM customers'),
      ]);

    const orders = ordersRes.rows;
    const products = prodsRes.rows;
    const items = itemsRes.rows;

    const completedOrders = orders.filter((o) => o.status === 'completed');
    const pendingOrders = orders.filter((o) => o.status === 'pending');
    const shippingOrders = orders.filter((o) => o.status === 'shipping');
    const cancelledOrders = orders.filter((o) => o.status === 'cancelled');
    const validOrders = orders.filter((o) => o.status !== 'cancelled');

    const totalRevenue = validOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const completedRevenue = completedOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);

    // Inventory metrics
    let totalInventoryUnits = 0;
    let totalInventoryValue = 0;
    let outOfStockCount = 0;
    let lowStockCount = 0;
    let inStockCount = 0;

    products.forEach((p) => {
      const qty = Number(p.stock_quantity !== undefined && p.stock_quantity !== null ? p.stock_quantity : 50);
      const priceVal = Number(p.price_value || 0);

      totalInventoryUnits += qty;
      totalInventoryValue += qty * priceVal;

      if (qty === 0) {
        outOfStockCount++;
      } else if (qty <= 5) {
        lowStockCount++;
      } else {
        inStockCount++;
      }
    });

    // Category breakdown
    const categoryStats = catsRes.rows.map((c) => {
      const prodsInCat = products.filter((p) => p.category_id === c.id);
      return {
        id: c.id,
        name: c.name,
        productCount: prodsInCat.length,
      };
    });

    // Top selling items from order_items
    const productSalesMap: Record<
      string,
      { name: string; quantity: number; revenue: number; image?: string }
    > = {};

    items.forEach((item) => {
      const key = item.name;
      if (!productSalesMap[key]) {
        productSalesMap[key] = {
          name: item.name,
          quantity: 0,
          revenue: 0,
          image: item.image,
        };
      }
      productSalesMap[key].quantity += Number(item.quantity || 1);
      productSalesMap[key].revenue += Number(item.price_value || 0) * Number(item.quantity || 1);
    });

    const topSelling = Object.values(productSalesMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const recentOrders = orders.slice(0, 5).map((order) => ({
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
      statusText: order.status_text,
      items: items
        .filter((item) => item.order_id === order.id)
        .map((item) => ({
          id: item.product_id || item.id,
          name: item.name,
          price: item.price,
          priceValue: Number(item.price_value),
          quantity: item.quantity,
          image: item.image,
        })),
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        completedRevenue,
        totalOrders: orders.length,
        completedOrdersCount: completedOrders.length,
        pendingOrdersCount: pendingOrders.length,
        shippingOrdersCount: shippingOrders.length,
        cancelledOrdersCount: cancelledOrders.length,
        totalProducts: products.length,
        inStockCount,
        lowStockCount,
        outOfStockCount,
        totalInventoryUnits,
        totalInventoryValue,
        totalCategories: catsRes.rows.length,
        totalCustomers: customersRes.rows.length,
        categoryStats,
        topSelling,
        recentOrders,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch stats overview' },
      { status: 500 }
    );
  }
}
