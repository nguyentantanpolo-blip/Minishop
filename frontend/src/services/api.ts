import { supabase } from '@/lib/supabaseClient';
import { Product, Order, CartItem, Category, Customer, DashboardStats } from '@/types';

// Helper to format product data from Supabase DB to Frontend Product interface
function formatProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    oldPrice: row.old_price || undefined,
    discount: row.discount || undefined,
    priceValue: row.price_value,
    desc: row.description || '',
    category: row.category_id,
    categoryName: row.category_name,
    image: row.image,
    badge: row.badge || undefined,
    stock: row.stock || 'Còn hàng',
    stockQuantity: row.stock_quantity !== undefined ? row.stock_quantity : 50,
    specs: typeof row.specs === 'string' ? JSON.parse(row.specs) : (row.specs || undefined),
    createdAt: row.created_at,
  };
}

// Helper to format order data from Supabase DB to Frontend Order interface
function formatOrder(row: any, items: any[] = []): Order {
  return {
    id: row.id,
    date: row.date || row.created_at,
    customer: row.customer,
    phone: row.phone,
    address: row.address,
    notes: row.notes || undefined,
    subtotal: Number(row.subtotal),
    shippingFee: Number(row.shipping_fee || 0),
    total: Number(row.total),
    totalFormatted: row.total_formatted,
    paymentMethod: row.payment_method,
    status: row.status,
    statusText: row.status_text,
    items: (items || []).map((item) => ({
      id: item.product_id,
      name: item.product_name,
      price: item.price,
      priceValue: item.price_value,
      quantity: item.quantity,
      image: item.image,
    })),
  };
}

export interface DbCheckResponse {
  status: string;
  database: string;
  latency?: string;
  stats?: {
    categories: number;
    products: number;
    orders: number;
    orderItems: number;
    customers?: number;
  };
  error?: string;
}

export const api = {
  // =========================================================================
  // Health & DB status (Direct Supabase Connection)
  // =========================================================================
  async checkHealth(): Promise<{ status: string; message: string }> {
    try {
      const { count, error } = await supabase.from('categories').select('*', { count: 'exact', head: true });
      if (error) throw error;
      return { status: 'ok', message: `Supabase connected successfully (${count} categories)` };
    } catch (err: any) {
      return { status: 'error', message: err.message || 'Supabase connection error' };
    }
  },

  async checkDb(): Promise<DbCheckResponse> {
    const startTime = Date.now();
    try {
      const [
        { count: catCount, error: catErr },
        { count: prodCount, error: prodErr },
        { count: orderCount, error: orderErr },
        { count: itemCount, error: itemErr },
        { count: custCount, error: custErr },
      ] = await Promise.all([
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('order_items').select('*', { count: 'exact', head: true }),
        supabase.from('customers').select('*', { count: 'exact', head: true }),
      ]);

      if (catErr || prodErr || orderErr || itemErr || custErr) {
        throw catErr || prodErr || orderErr || itemErr || custErr;
      }

      const latency = `${Date.now() - startTime}ms`;
      return {
        status: 'connected',
        database: 'Supabase PostgreSQL (Direct API)',
        latency,
        stats: {
          categories: catCount || 0,
          products: prodCount || 0,
          orders: orderCount || 0,
          orderItems: itemCount || 0,
          customers: custCount || 0,
        },
      };
    } catch (err: any) {
      return {
        status: 'error',
        database: 'Supabase PostgreSQL',
        error: err.message || 'Supabase check failed',
      };
    }
  },

  // =========================================================================
  // Categories (Direct Supabase CRUD)
  // =========================================================================
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories from Supabase:', error);
      throw new Error(error.message);
    }

    return (data || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      description: c.description || undefined,
      image: c.image || undefined,
    }));
  },

  async createCategory(cat: Category): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        id: cat.id,
        name: cat.name,
        description: cat.description || null,
        image: cat.image || null,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      image: data.image || undefined,
    };
  },

  async updateCategory(id: string, catData: Partial<Category>): Promise<Category> {
    const updatePayload: any = {};
    if (catData.name !== undefined) updatePayload.name = catData.name;
    if (catData.description !== undefined) updatePayload.description = catData.description;
    if (catData.image !== undefined) updatePayload.image = catData.image;

    const { data, error } = await supabase
      .from('categories')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      image: data.image || undefined,
    };
  },

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  // =========================================================================
  // Products (Direct Supabase CRUD)
  // =========================================================================
  async getProducts(category?: string, search?: string): Promise<Product[]> {
    let query = supabase.from('products').select('*');

    if (category && category !== 'all') {
      query = query.eq('category_id', category);
    }

    if (search && search.trim()) {
      const s = search.trim();
      query = query.or(`name.ilike.%${s}%,description.ilike.%${s}%,category_name.ilike.%${s}%`);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching products from Supabase:', error);
      throw new Error(error.message);
    }

    return (data || []).map(formatProduct);
  },

  async getProductById(id: string): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new Error(error?.message || 'Không tìm thấy sản phẩm');
    return formatProduct(data);
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const id = product.id || `p_${Date.now().toString(36)}`;
    const stockQty = product.stockQuantity !== undefined ? product.stockQuantity : 50;
    const stockText = stockQty === 0 ? 'Hết hàng' : stockQty <= 5 ? 'Sắp hết hàng' : (product.stock || 'Còn hàng');

    const payload = {
      id,
      name: product.name,
      price: product.price,
      old_price: product.oldPrice || null,
      discount: product.discount || null,
      price_value: product.priceValue || 0,
      description: product.desc || '',
      category_id: product.category,
      category_name: product.categoryName || '',
      image: product.image || '/assets/images/products/bo5-1.jpg',
      badge: product.badge || null,
      stock: stockText,
      stock_quantity: stockQty,
      specs: product.specs || {},
    };

    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return formatProduct(data);
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };

    if (product.name !== undefined) updatePayload.name = product.name;
    if (product.price !== undefined) updatePayload.price = product.price;
    if (product.oldPrice !== undefined) updatePayload.old_price = product.oldPrice;
    if (product.discount !== undefined) updatePayload.discount = product.discount;
    if (product.priceValue !== undefined) updatePayload.price_value = product.priceValue;
    if (product.desc !== undefined) updatePayload.description = product.desc;
    if (product.category !== undefined) updatePayload.category_id = product.category;
    if (product.categoryName !== undefined) updatePayload.category_name = product.categoryName;
    if (product.image !== undefined) updatePayload.image = product.image;
    if (product.badge !== undefined) updatePayload.badge = product.badge;
    if (product.specs !== undefined) updatePayload.specs = product.specs;

    if (product.stockQuantity !== undefined) {
      updatePayload.stock_quantity = Math.max(0, product.stockQuantity);
      if (product.stockQuantity === 0) updatePayload.stock = 'Hết hàng';
      else if (product.stockQuantity <= 5) updatePayload.stock = 'Sắp hết hàng';
      else if (!product.stock || product.stock === 'Hết hàng') updatePayload.stock = 'Còn hàng';
    } else if (product.stock !== undefined) {
      updatePayload.stock = product.stock;
    }

    const { data, error } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return formatProduct(data);
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  // =========================================================================
  // Inventory (Direct Supabase Stock Adjustment)
  // =========================================================================
  async adjustStock(
    productId: string,
    payload: { newQuantity?: number; changeQuantity?: number; reason?: string }
  ): Promise<{ id: string; name: string; previousQuantity: number; stockQuantity: number; stock: string; reason: string }> {
    const { data: current, error: fetchErr } = await supabase
      .from('products')
      .select('id, name, stock_quantity')
      .eq('id', productId)
      .single();

    if (fetchErr || !current) throw new Error(fetchErr?.message || 'Không tìm thấy sản phẩm');

    const previousQuantity = current.stock_quantity !== undefined ? current.stock_quantity : 50;
    let newQuantity = previousQuantity;

    if (typeof payload.newQuantity === 'number') {
      newQuantity = Math.max(0, payload.newQuantity);
    } else if (typeof payload.changeQuantity === 'number') {
      newQuantity = Math.max(0, previousQuantity + payload.changeQuantity);
    }

    const stockText = newQuantity === 0 ? 'Hết hàng' : newQuantity <= 5 ? 'Sắp hết hàng' : 'Còn hàng';

    const { data: updated, error: updateErr } = await supabase
      .from('products')
      .update({
        stock_quantity: newQuantity,
        stock: stockText,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId)
      .select('id, name, stock_quantity, stock')
      .single();

    if (updateErr) throw new Error(updateErr.message);

    return {
      id: updated.id,
      name: updated.name,
      previousQuantity,
      stockQuantity: updated.stock_quantity,
      stock: updated.stock,
      reason: payload.reason || 'Điều chỉnh tồn kho',
    };
  },

  // =========================================================================
  // Orders (Direct Supabase CRUD & Automatic Stock Management)
  // =========================================================================
  async getOrders(): Promise<Order[]> {
    const { data: ordersData, error: ordersErr } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (ordersErr) {
      console.error('Error fetching orders from Supabase:', ordersErr);
      throw new Error(ordersErr.message);
    }

    return (ordersData || []).map((o: any) => formatOrder(o, o.order_items));
  },

  async createOrder(orderData: {
    customer: string;
    phone: string;
    address: string;
    notes?: string;
    items: CartItem[];
    subtotal: number;
    shippingFee: number;
    total: number;
    totalFormatted: string;
    paymentMethod: string;
  }): Promise<{ success: boolean; orderId: string }> {
    const orderId = `#MS-${Math.floor(10000 + Math.random() * 90000)}`;

    const { error: orderInsertErr } = await supabase.from('orders').insert({
      id: orderId,
      customer: orderData.customer,
      phone: orderData.phone,
      address: orderData.address,
      notes: orderData.notes || null,
      subtotal: orderData.subtotal,
      shipping_fee: orderData.shippingFee || 0,
      total: orderData.total,
      total_formatted: orderData.totalFormatted,
      payment_method: orderData.paymentMethod || 'COD',
      status: 'pending',
      status_text: 'Đang xử lý',
    });

    if (orderInsertErr) throw new Error(orderInsertErr.message);

    // Insert Order Items & Deduct Stock
    if (orderData.items && orderData.items.length > 0) {
      const itemsPayload = orderData.items.map((item) => ({
        order_id: orderId,
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        price_value: item.priceValue || 0,
        quantity: item.quantity,
        image: item.image || null,
      }));

      await supabase.from('order_items').insert(itemsPayload);

      // Decrement stock for each item in Supabase
      for (const item of orderData.items) {
        const { data: prod } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', item.id)
          .single();

        if (prod) {
          const currentQty = prod.stock_quantity !== undefined ? prod.stock_quantity : 50;
          const nextQty = Math.max(0, currentQty - item.quantity);
          const nextStock = nextQty === 0 ? 'Hết hàng' : nextQty <= 5 ? 'Sắp hết hàng' : 'Còn hàng';
          await supabase
            .from('products')
            .update({ stock_quantity: nextQty, stock: nextStock, updated_at: new Date().toISOString() })
            .eq('id', item.id);
        }
      }
    }

    return { success: true, orderId };
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    const statusMap: Record<Order['status'], string> = {
      pending: 'Đang xử lý',
      shipping: 'Đang giao hàng',
      completed: 'Thành công',
      cancelled: 'Đã hủy',
    };

    // Check previous status and items to handle inventory restore/deduct
    const { data: currentOrder } = await supabase
      .from('orders')
      .select('status, order_items(*)')
      .eq('id', id)
      .single();

    const previousStatus = currentOrder?.status;
    const items = currentOrder?.order_items || [];

    // If order is cancelled, restore stock
    if (status === 'cancelled' && previousStatus !== 'cancelled' && items.length > 0) {
      for (const item of items) {
        const { data: prod } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', item.product_id)
          .single();

        if (prod) {
          const currentQty = prod.stock_quantity !== undefined ? prod.stock_quantity : 50;
          const nextQty = currentQty + item.quantity;
          const nextStock = nextQty === 0 ? 'Hết hàng' : nextQty <= 5 ? 'Sắp hết hàng' : 'Còn hàng';
          await supabase
            .from('products')
            .update({ stock_quantity: nextQty, stock: nextStock, updated_at: new Date().toISOString() })
            .eq('id', item.product_id);
        }
      }
    } else if (previousStatus === 'cancelled' && status !== 'cancelled' && items.length > 0) {
      // Re-deduct stock if recovered from cancelled
      for (const item of items) {
        const { data: prod } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', item.product_id)
          .single();

        if (prod) {
          const currentQty = prod.stock_quantity !== undefined ? prod.stock_quantity : 50;
          const nextQty = Math.max(0, currentQty - item.quantity);
          const nextStock = nextQty === 0 ? 'Hết hàng' : nextQty <= 5 ? 'Sắp hết hàng' : 'Còn hàng';
          await supabase
            .from('products')
            .update({ stock_quantity: nextQty, stock: nextStock, updated_at: new Date().toISOString() })
            .eq('id', item.product_id);
        }
      }
    }

    const { error } = await supabase
      .from('orders')
      .update({
        status,
        status_text: statusMap[status] || status,
      })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async updateOrder(id: string, orderData: Partial<Order>): Promise<Order> {
    const updatePayload: any = {};
    if (orderData.customer !== undefined) updatePayload.customer = orderData.customer;
    if (orderData.phone !== undefined) updatePayload.phone = orderData.phone;
    if (orderData.address !== undefined) updatePayload.address = orderData.address;
    if (orderData.notes !== undefined) updatePayload.notes = orderData.notes;
    if (orderData.status !== undefined) {
      updatePayload.status = orderData.status;
      const statusMap: Record<Order['status'], string> = {
        pending: 'Đang xử lý',
        shipping: 'Đang giao hàng',
        completed: 'Thành công',
        cancelled: 'Đã hủy',
      };
      updatePayload.status_text = statusMap[orderData.status] || orderData.status;
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', id)
      .select('*, order_items(*)')
      .single();

    if (error) throw new Error(error.message);
    return formatOrder(data, data.order_items);
  },

  async deleteOrder(id: string): Promise<void> {
    await supabase.from('order_items').delete().eq('order_id', id);
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  // =========================================================================
  // Customers (Direct Supabase CRUD)
  // =========================================================================
  async getCustomers(): Promise<Customer[]> {
    const [{ data: customersData, error: custErr }, { data: ordersData, error: orderErr }] =
      await Promise.all([
        supabase.from('customers').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('customer, phone, total, status'),
      ]);

    if (custErr) throw new Error(custErr.message);

    const orders = ordersData || [];

    return (customersData || []).map((c: any) => {
      const matchingOrders = orders.filter(
        (o: any) =>
          o.status !== 'cancelled' &&
          ((c.phone && o.phone === c.phone) ||
            (c.name && o.customer.toLowerCase().trim() === c.name.toLowerCase().trim()))
      );

      const totalSpent = matchingOrders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);
      const totalOrders = matchingOrders.length;

      return {
        id: c.id,
        name: c.name,
        email: c.email || undefined,
        phone: c.phone || undefined,
        address: c.address || undefined,
        role: c.role || 'customer',
        notes: c.notes || undefined,
        totalOrders,
        totalSpent,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      };
    });
  },

  async createCustomer(customer: Partial<Customer>): Promise<Customer> {
    const payload = {
      name: customer.name,
      email: customer.email || null,
      phone: customer.phone || null,
      address: customer.address || null,
      role: customer.role || 'customer',
      notes: customer.notes || null,
    };

    const { data, error } = await supabase
      .from('customers')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return {
      id: data.id,
      name: data.name,
      email: data.email || undefined,
      phone: data.phone || undefined,
      address: data.address || undefined,
      role: data.role,
      notes: data.notes || undefined,
      totalOrders: 0,
      totalSpent: 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };
    if (customer.name !== undefined) updatePayload.name = customer.name;
    if (customer.email !== undefined) updatePayload.email = customer.email;
    if (customer.phone !== undefined) updatePayload.phone = customer.phone;
    if (customer.address !== undefined) updatePayload.address = customer.address;
    if (customer.role !== undefined) updatePayload.role = customer.role;
    if (customer.notes !== undefined) updatePayload.notes = customer.notes;

    const { data, error } = await supabase
      .from('customers')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return {
      id: data.id,
      name: data.name,
      email: data.email || undefined,
      phone: data.phone || undefined,
      address: data.address || undefined,
      role: data.role,
      notes: data.notes || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async deleteCustomer(id: string): Promise<void> {
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  // =========================================================================
  // Stats Overview (Direct Supabase Aggregation)
  // =========================================================================
  async getStatsOverview(): Promise<DashboardStats> {
    const [
      { data: ordersData },
      { data: productsData },
      { data: categoriesData },
      { data: customersData },
      { data: orderItemsData },
    ] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('*'),
      supabase.from('categories').select('*'),
      supabase.from('customers').select('*'),
      supabase.from('order_items').select('*'),
    ]);

    const orders = ordersData || [];
    const products = productsData || [];
    const categories = categoriesData || [];
    const customers = customersData || [];
    const orderItems = orderItemsData || [];

    const nonCancelledOrders = orders.filter((o) => o.status !== 'cancelled');
    const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const completedRevenue = orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + Number(o.total || 0), 0);

    const totalOrders = orders.length;
    const completedOrdersCount = orders.filter((o) => o.status === 'completed').length;
    const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
    const shippingOrdersCount = orders.filter((o) => o.status === 'shipping').length;
    const cancelledOrdersCount = orders.filter((o) => o.status === 'cancelled').length;

    const totalProducts = products.length;
    const inStockCount = products.filter((p) => {
      const q = p.stock_quantity !== undefined ? p.stock_quantity : 50;
      return q > 5;
    }).length;
    const lowStockCount = products.filter((p) => {
      const q = p.stock_quantity !== undefined ? p.stock_quantity : 50;
      return q > 0 && q <= 5;
    }).length;
    const outOfStockCount = products.filter((p) => {
      const q = p.stock_quantity !== undefined ? p.stock_quantity : 50;
      return q === 0 || p.stock === 'Hết hàng';
    }).length;

    const totalInventoryUnits = products.reduce(
      (sum, p) => sum + (p.stock_quantity !== undefined ? p.stock_quantity : 50),
      0
    );
    const totalInventoryValue = products.reduce(
      (sum, p) => sum + p.price_value * (p.stock_quantity !== undefined ? p.stock_quantity : 50),
      0
    );

    const categoryStats = categories.map((c) => ({
      id: c.id,
      name: c.name,
      productCount: products.filter((p) => p.category_id === c.id).length,
    }));

    // Top Selling aggregation
    const itemMap = new Map<string, { name: string; quantity: number; revenue: number; image?: string }>();
    for (const item of orderItems) {
      const name = item.product_name || 'Sản phẩm';
      const existing = itemMap.get(name) || { name, quantity: 0, revenue: 0, image: item.image };
      existing.quantity += Number(item.quantity || 1);
      existing.revenue += Number(item.price_value || 0) * Number(item.quantity || 1);
      itemMap.set(name, existing);
    }
    const topSelling = Array.from(itemMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const recentOrders = orders.slice(0, 5).map((o) => formatOrder(o, []));

    return {
      totalRevenue,
      completedRevenue,
      totalOrders,
      completedOrdersCount,
      pendingOrdersCount,
      shippingOrdersCount,
      cancelledOrdersCount,
      totalProducts,
      inStockCount,
      lowStockCount,
      outOfStockCount,
      totalInventoryUnits,
      totalInventoryValue,
      totalCategories: categories.length,
      totalCustomers: customers.length,
      categoryStats,
      topSelling,
      recentOrders,
    };
  },
};
