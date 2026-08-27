-- ==============================================================================
-- SUPABASE DATABASE SETUP SCRIPT FOR MINISHOP - TANPOLO LEATHER GOODS
-- Website: www.tinhocsaoviet.com - Đào Tạo AI Sao Việt
-- ==============================================================================

-- 1. XÓA CÁC BẢNG NẾU ĐÃ TỒN TẠI (ĐỂ CÓ THỂ CHẠY LẠI TỪ ĐẦU KHI CẦN)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS vouchers CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- ==============================================================================
-- 2. TẠO CÁC BẢNG DỮ LIỆU
-- ==============================================================================

-- 2.1. BẢNG DANH MỤC (categories)
CREATE TABLE categories (
    id TEXT PRIMARY KEY,                       -- giay-tay, giay-luoi, dep-da, vi-da, that-lung
    name TEXT NOT NULL,                        -- Tên danh mục
    description TEXT,                          -- Mô tả danh mục
    image TEXT,                                -- Ảnh đại diện danh mục
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.2. BẢNG SẢN PHẨM (products)
CREATE TABLE products (
    id TEXT PRIMARY KEY,                       -- p_bo4, p_bo5...
    name TEXT NOT NULL,                        -- Tên sản phẩm
    price TEXT NOT NULL,                       -- Giá hiển thị ('680.000đ')
    old_price TEXT,                            -- Giá gốc ('850.000đ')
    discount TEXT,                             -- Phần trăm giảm ('-20%')
    price_value NUMERIC NOT NULL,              -- Giá trị số (680000) phục vụ tính toán & lọc
    description TEXT,                          -- Mô tả chi tiết
    category_id TEXT REFERENCES categories(id) ON DELETE SET NULL, -- Khóa ngoại danh mục
    category_name TEXT,                        -- Tên danh mục hiển thị nhanh
    image TEXT NOT NULL,                       -- Đường dẫn hình ảnh chính
    badge TEXT,                                -- Nhãn ('Mới', 'Hot', '-20%')
    stock TEXT DEFAULT 'Còn hàng',             -- Tình trạng hàng
    specs JSONB,                               -- Thông số kỹ thuật (Chất liệu, màu sắc, kích thước, gallery...)
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2.3. BẢNG ĐƠN HÀNG (orders)
CREATE TABLE orders (
    id TEXT PRIMARY KEY,                       -- #MS-84920, #MS-73194...
    customer TEXT NOT NULL,                    -- Họ tên khách hàng
    phone TEXT NOT NULL,                       -- Số điện thoại
    address TEXT NOT NULL,                     -- Địa chỉ giao hàng
    notes TEXT,                                -- Ghi chú đơn hàng
    subtotal NUMERIC NOT NULL DEFAULT 0,       -- Tạm tính
    shipping_fee NUMERIC NOT NULL DEFAULT 0,   -- Phí vận chuyển
    total NUMERIC NOT NULL DEFAULT 0,          -- Tổng tiền
    total_formatted TEXT NOT NULL,             -- Tổng tiền định dạng chuỗi
    payment_method TEXT NOT NULL DEFAULT 'COD',-- COD, QR Banking...
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'shipping', 'completed', 'cancelled')),
    status_text TEXT DEFAULT 'Đang xử lý',     -- Đang xử lý, Đang giao, Thành công, Đã hủy
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2.4. BẢNG CHI TIẾT ĐƠN HÀNG (order_items)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
    name TEXT NOT NULL,                        -- Tên sản phẩm tại thời điểm mua
    price TEXT NOT NULL,                       -- Đơn giá chuỗi
    price_value NUMERIC NOT NULL,              -- Đơn giá số
    quantity INTEGER NOT NULL DEFAULT 1,       -- Số lượng
    image TEXT,                                -- Ảnh sản phẩm
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.5. BẢNG MÃ GIẢM GIÁ (vouchers)
CREATE TABLE vouchers (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    discount_type TEXT NOT NULL DEFAULT 'percentage',
    discount_value NUMERIC NOT NULL DEFAULT 0,
    min_order NUMERIC DEFAULT 0,
    max_discount NUMERIC,
    usage_limit INTEGER DEFAULT 100,
    used_count INTEGER DEFAULT 0,
    expiry_date TEXT DEFAULT '2026-12-31',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2.6. BẢNG KHÁCH HÀNG (customers)
CREATE TABLE customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    role TEXT DEFAULT 'customer',
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 3. BẢO MẬT & PHÂN QUYỀN (ROW LEVEL SECURITY - RLS)
-- ==============================================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Cho phép đọc dữ liệu công khai (Anonymous Read)
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Read Orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public Read Order Items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Public Read Vouchers" ON vouchers FOR SELECT USING (true);
CREATE POLICY "Public Read Customers" ON customers FOR SELECT USING (true);

-- Cho phép khách hàng thêm đơn hàng mới (Anonymous Insert)
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Order Items" ON order_items FOR INSERT WITH CHECK (true);

-- Cho phép cập nhật/quản trị toàn quyền
CREATE POLICY "Public All Categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All Products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All Orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All Order Items" ON order_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All Vouchers" ON vouchers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All Customers" ON customers FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 4. ĐỔ DỮ LIỆU DANH MỤC & SẢN PHẨM & ĐƠN HÀNG & VOUCHERS & CUSTOMERS
-- ==============================================================================

-- 4.1. ĐỔ DỮ LIỆU DANH MỤC
INSERT INTO categories (id, name, description, image) VALUES
('giay-tay', 'Giày Tây & Công Sở', 'Giày tây da bò cao cấp phom dáng quý ông lịch lãm chuẩn công sở', '/assets/images/products/bo5-1.jpg'),
('giay-luoi', 'Giày Lười Da', 'Giày lười Loafer da bò êm ái, tiện dụng, khẳng định đẳng cấp phái mạnh', '/assets/images/products/bo4-1.jpg'),
('dep-da', 'Dép Da & Sandal', 'Dép da quai chéo, dép xỏ ngón da bò thật mềm mại, thoáng mát', '/assets/images/products/bo7-1.jpg'),
('vi-da', 'Ví Da Bò Nam', 'Ví da nam cao cấp dáng ngang, dáng đứng và da sáp handmade tinh tế', '/assets/images/products/bo13-1.jpg'),
('that-lung', 'Thắt Lưng Da', 'Dây nịt da bò thật 2 lớp khóa trượt tự động hợp kim chống gỉ sang trọng', '/assets/images/products/bo21-1.jpg');

-- 4.2. ĐỔ DỮ LIỆU 19 SẢN PHẨM TANPOLO
INSERT INTO products (id, name, price, old_price, discount, price_value, description, category_id, category_name, image, badge, stock, specs) VALUES
(
    'p_bo4',
    'Giày Lười Da Bò Nam Tanpolo Classic Loafer - Đen',
    '680.000đ',
    '850.000đ',
    '-20%',
    680000,
    'Giày lười slip-on phong cách quý ông cổ điển từ thương hiệu Tanpolo. Chất liệu da bò nguyên tấm bóng nhẹ, đế đúc cao su tự nhiên chống trượt êm ái khi di chuyển cả ngày.',
    'giay-luoi',
    'Giày Lười Da',
    '/assets/images/products/bo4-1.jpg',
    'Mới',
    'Còn hàng',
    '{"material": "Da bò thật nguyên tấm 100%", "color": "Đen lịch lãm", "dimensions": "Size 38 - 43 chuẩn phom chân Việt", "origin": "Việt Nam - Tanpolo", "gallery": ["/assets/images/products/bo4-1.jpg"]}'::jsonb
),
(
    'p_bo5',
    'Giày Tây Lười Da Bò Nam Tanpolo Luxury Dress Loafer - Đen Bóng',
    '980.000đ',
    '1.250.000đ',
    '-22%',
    980000,
    'Thiết kế phom giày tây dress loafer chuẩn châu Âu với chất liệu da bò cao cấp xử lý bóng nhẹ sang trọng, kết hợp hoàn hảo cùng suit, vest và quần âu công sở.',
    'giay-tay',
    'Giày Tây & Công Sở',
    '/assets/images/products/bo5-1.jpg',
    'Hot',
    'Còn hàng',
    '{"material": "Da bò cao cấp xử lý bóng, lót da êm chân", "color": "Đen bóng sang trọng", "dimensions": "Size 38 - 44", "origin": "Việt Nam - Tanpolo", "gallery": ["/assets/images/products/bo5-1.jpg", "/assets/images/products/bo5-2.jpg", "/assets/images/products/bo5-3.jpg", "/assets/images/products/bo5-4.jpg", "/assets/images/products/bo5-5.jpg", "/assets/images/products/bo5-6.jpg"]}'::jsonb
),
(
    'p_bo6',
    'Giày Tây Lười Da Bò Nam Tanpolo Luxury Dress Loafer - Nâu Hạt Dẻ',
    '980.000đ',
    '1.250.000đ',
    '-22%',
    980000,
    'Sắc nâu hạt dẻ cổ điển với kỹ thuật đánh màu patina thủ công tinh xảo. Đế phíp cao cấp kết hợp mặt cao su chống trơn trượt, tôn dáng người mang.',
    'giay-tay',
    'Giày Tây & Công Sở',
    '/assets/images/products/bo6-1.jpg',
    'Mới',
    'Còn hàng',
    '{"material": "Da bò tấm phủ bóng patina thủ công", "color": "Nâu hạt dẻ", "dimensions": "Size 38 - 44", "origin": "Việt Nam - Tanpolo", "gallery": ["/assets/images/products/bo6-1.jpg", "/assets/images/products/bo6-2.jpg", "/assets/images/products/bo6-3.jpg", "/assets/images/products/bo6-4.jpg", "/assets/images/products/bo6-5.jpg", "/assets/images/products/bo6-6.jpg"]}'::jsonb
),
(
    'p_bo7',
    'Dép Quai Chéo Da Bò Nam Tanpolo Khâu Viền Thủ Công - Đen',
    '420.000đ',
    '550.000đ',
    '-24%',
    420000,
    'Dép quai chéo phong cách trẻ trung, chất da bò Nappa mềm mại cùng đường chỉ viền khâu tay tỉ mỉ. Lòng đế công thái học nâng đỡ bàn chân êm ái.',
    'dep-da',
    'Dép Da & Sandal',
    '/assets/images/products/bo7-1.jpg',
    'Mới',
    'Còn hàng',
    '{"material": "Da bò Nappa cao cấp, đế PU siêu êm", "color": "Đen viền chỉ thủ công", "dimensions": "Size 38 - 43", "origin": "Việt Nam - Tanpolo", "gallery": ["/assets/images/products/bo7-1.jpg", "/assets/images/products/bo7-2.jpg", "/assets/images/products/bo7-3.jpg", "/assets/images/products/bo7-4.jpg", "/assets/images/products/bo7-5.jpg", "/assets/images/products/bo7-6.jpg"]}'::jsonb
),
(
    'p_bo8',
    'Dép Quai Chéo Da Bò Nam Tanpolo Vân Dập Sang Trọng - Đen',
    '450.000đ',
    '580.000đ',
    '-22%',
    450000,
    'Thiết kế quai chéo hiện đại với chi tiết dập vân tinh xảo, khoen logo kim loại Tanpolo sáng bóng, chống mài mòn và chống thấm nước hiệu quả.',
    'dep-da',
    'Dép Da & Sandal',
    '/assets/images/products/bo8-1.jpg',
    'Hot',
    'Còn hàng',
    '{"material": "Da bò dập vân hạt cao cấp, khoen hợp kim", "color": "Đen tuyền", "dimensions": "Size 38 - 43", "origin": "Việt Nam - Tanpolo", "gallery": ["/assets/images/products/bo8-1.jpg", "/assets/images/products/bo8-2.jpg", "/assets/images/products/bo8-3.jpg", "/assets/images/products/bo8-4.jpg", "/assets/images/products/bo8-5.jpg", "/assets/images/products/bo8-6.jpg"]}'::jsonb
),
(
    'p_bo9',
    'Dép Quai Chéo Da Bò Nam Tanpolo Casual Comfort - Nâu Cà Phê',
    '420.000đ',
    '550.000đ',
    '-24%',
    420000,
    'Sắc nâu cà phê ấm áp thanh lịch. Bản quai da bò tấm tự nhiên ôm khít mu bàn chân, đế rãnh chống trơn trượt an toàn trong mọi thời tiết.',
    'dep-da',
    'Dép Da & Sandal',
    '/assets/images/products/bo9-1.jpg',
    'Mới',
    'Còn hàng',
    '{"material": "Da bò tự nhiên 100%, lót da êm chân", "color": "Nâu cà phê", "dimensions": "Size 38 - 43", "origin": "Việt Nam - Tanpolo", "gallery": ["/assets/images/products/bo9-1.jpg", "/assets/images/products/bo9-2.jpg", "/assets/images/products/bo9-3.jpg", "/assets/images/products/bo9-4.jpg", "/assets/images/products/bo9-5.jpg", "/assets/images/products/bo9-6.jpg"]}'::jsonb
),
(
    'p_bo10',
    'Dép Quai Da Nam Tanpolo Đúc Vân Da Hạt - Nâu Đậm',
    '450.000đ',
    '580.000đ',
    '-22%',
    450000,
    'Kiểu dáng quai da bản lớn tối giản, đế PU siêu nhẹ dập hoa văn chống trượt. Tông nâu đậm nam tính, bền chắc theo năm tháng.',
    'dep-da',
    'Dép Da & Sandal',
    '/assets/images/products/bo10-1.jpg',
    NULL,
    'Còn hàng',
    '{"material": "Da bò mill hạt nhập khẩu", "color": "Nâu đậm sang trọng", "dimensions": "Size 38 - 43", "origin": "Việt Nam - Tanpolo", "gallery": ["/assets/images/products/bo10-1.jpg", "/assets/images/products/bo10-2.jpg", "/assets/images/products/bo10-3.jpg", "/assets/images/products/bo10-4.jpg", "/assets/images/products/bo10-5.jpg", "/assets/images/products/bo10-6.jpg"]}'::jsonb
),
(
    'p_bo11',
    'Dép Kẹp Da Bò Nam Tanpolo Quai Tròn Êm Ái - Nâu Bò',
    '380.000đ',
    '490.000đ',
    '-22%',
    380000,
    'Dép xỏ ngón da bò thật Tanpolo thiết kế quai tròn bọc da mềm mại không gây đau kẽ chân, lòng dép dập logo vương miện Tanpolo sắc nét.',
    'dep-da',
    'Dép Da & Sandal',
    '/assets/images/products/bo11-1.jpg',
    'Hot',
    'Còn hàng',
    '{"material": "Da bò mộc tự nhiên mềm êm", "color": "Nâu bò cổ điển", "dimensions": "Size 38 - 43", "origin": "Việt Nam - Tanpolo", "gallery": ["/assets/images/products/bo11-1.jpg", "/assets/images/products/bo11-2.jpg", "/assets/images/products/bo11-3.jpg", "/assets/images/products/bo11-4.jpg", "/assets/images/products/bo11-5.jpg", "/assets/images/products/bo11-6.jpg"]}'::jsonb
),
(
    'p_bo12',
    'Dép Kẹp Da Bò Nam Tanpolo Dynamic - Đen Cổ Điển',
    '380.000đ',
    '490.000đ',
    '-22%',
    380000,
    'Dép kẹp da nam màu đen truyền thống năng động, quai da ép nhiệt dập hoa văn nổi tinh xảo, thích hợp dạo phố, đi biển hay sinh hoạt thường ngày.',
    'dep-da',
    'Dép Da & Sandal',
    '/assets/images/products/bo12-1.jpg',
    NULL,
    'Còn hàng',
    '{"material": "Da bò thật 100%, đế cao su đàn hồi", "color": "Đen bóng", "dimensions": "Size 38 - 43", "origin": "Việt Nam - Tanpolo", "gallery": ["/assets/images/products/bo12-1.jpg", "/assets/images/products/bo12-2.jpg", "/assets/images/products/bo12-3.jpg", "/assets/images/products/bo12-4.jpg", "/assets/images/products/bo12-5.jpg", "/assets/images/products/bo12-6.jpg"]}'::jsonb
),
(
    'p_bo13',
    'Ví Da Nam Mini Tanpolo Da Bò Dáng Gập Gọn - Đen',
    '350.000đ',
    '450.000đ',
    '-22%',
    350000,
    'Ví da mini siêu mỏng gọn gàng bỏ vừa túi áo hoặc túi quần tây mà không bị cộm. Đầy đủ ngăn đựng CCCD gắn chip, thẻ ATM và tiền mặt.',
    'vi-da',
    'Ví Da Bò Nam',
    '/assets/images/products/bo13-1.jpg',
    'Mới',
    'Còn hàng',
    '{"material": "Da bò thật 100%", "color": "Đen trơn", "dimensions": "11cm x 8.5cm x 1cm", "origin": "Việt Nam - Tanpolo", "gallery": ["/assets/images/products/bo13-1.jpg", "/assets/images/products/bo13-2.jpg", "/assets/images/products/bo13-3.jpg", "/assets/images/products/bo13-4.jpg", "/assets/images/products/bo13-5.jpg"]}'::jsonb
),
(
    'p_bo14',
    'Ví Da Nam Handmade Tanpolo Da Sáp Vintage - Nâu Sô-cô-la Chỉ Cam',
    '390.000đ',
    '520.000đ',
    '-25%',
    390000,
    'Dòng ví thủ công cao cấp chế tác từ da bò sáp Crazy Horse nguyên tấm với hiệu ứng đổi màu xước bụi độc đáo, đường viền may chỉ cam nổi bật cá tính.',
    'vi-da',
    'Ví Da Bò Nam',
    '/assets/images/products/bo14-1.jpg',
    'Hot',
    'Còn hàng',
    '{"material": "Da bò sáp ngựa điên (Crazy Horse Leather)", "color": "Nâu sô-cô-la viền cam", "dimensions": "12cm x 9.5cm x 1.5cm", "origin": "Việt Nam - Tanpolo", "gallery": ["/assets/images/products/bo14-1.jpg", "/assets/images/products/bo14-2.jpg", "/assets/images/products/bo14-3.jpg", "/assets/images/products/bo14-4.jpg", "/assets/images/products/bo14-5.jpg"]}'::jsonb
),
(
    'p_bo15',
    'Ví Ngang Da Bò Nam Tanpolo Vân Hạt - Đen Sang Trọng',
    '360.000đ',
    '480.000đ',
    '-25%',
    360000,
    'Kiểu dáng ví ngang tiêu chuẩn doanh nhân, bề mặt da bò dập vân hạt nhuyễn chống xước và chống thấm nước, logo Tanpolo góc phải dập chìm trang nhã.',
    'vi-da',
    'Ví Da Bò Nam',
    '/assets/images/products/bo15-1.jpg',
    'Mới',
    'Còn hàng',
    '{"material": "Da bò hạt cao cấp dẻo dai", "color": "Đen vân hạt", "dimensions": "12cm x 9.5cm", "origin": "Việt Nam - Tanpolo", "gallery": ["/assets/images/products/bo15-1.jpg", "/assets/images/products/bo15-2.jpg", "/assets/images/products/bo15-3.jpg", "/assets/images/products/bo15-4.jpg", "/assets/images/products/bo15-5.jpg"]}'::jsonb
),
(
    'p_bo16',
    'Ví Ngang Da Bò Nam Tanpolo Vân Hạt - Nâu Cà Phê',
    '360.000đ',
    '480.000đ',
    '-25%',
    360000,
    'Tông màu nâu cà phê trầm tĩnh sang trọng, cấu trúc 2 ngăn lớn đựng tiền và 8 khe cắm thẻ ngân hàng tiện dụng, chất da mềm cầm êm tay.',
    'vi-da',
    'Ví Da Bò Nam',
    '/assets/images/products/bo16-1.jpg',
    NULL,
    'Còn hàng',
    '{"material": "Da bò thật 100% vân hạt", "color": "Nâu cà phê", "dimensions": "12cm x 9.5cm", "origin": "Việt Nam - Tanpolo", "gallery": ["/assets/images/products/bo16-1.jpg", "/assets/images/products/bo16-2.jpg", "/assets/images/products/bo16-3.jpg", "/assets/images/products/bo16-4.jpg", "/assets/images/products/bo16-5.jpg"]}'::jsonb
),
(
    'p_bo17',
    'Ví Đứng Da Bò Nam Tanpolo Modern Vertical - Nâu Bò Sáng',
    '370.000đ',
    '490.000đ',
    '-24%',
    370000,
    'Thiết kế dáng ví đứng thời thượng, đường chỉ viền may thủ công màu vàng sáng. Dễ dàng rút thẻ nhanh chóng, đựng vừa các loại giấy tờ tùy thân mới.',
    'vi-da',
    'Ví Da Bò Nam',
    '/assets/images/products/bo17-1.jpg',
    'Mới',
    'Còn hàng',
    '{"material": "Da bò Nappa mềm mịn", "color": "Nâu bò sáng viền chỉ vàng", "dimensions": "11.5cm x 9cm", "origin": "Việt Nam - Tanpolo", "gallery": ["/assets/images/products/bo17-1.jpg", "/assets/images/products/bo17-2.jpg", "/assets/images/products/bo17-3.jpg", "/assets/images/products/bo17-4.jpg", "/assets/images/products/bo17-5.jpg"]}'::jsonb
),
(
    'p_bo18',
    'Ví Đứng Da Bò Nam Tanpolo Modern Vertical - Nâu Sẫm Cà Phê',
    '370.000đ',
    '490.000đ',
    '-24%',
    370000,
    'Thiết kế ví đứng thanh lịch phong cách châu Âu, chất da sáp mịn dẻo dai, ngăn đựng tiền sâu kín đáo, góc ví ép kim logo thương hiệu Tanpolo Since 1992s.',
    'vi-da',
    'Ví Da Bò Nam',
    '/assets/images/products/bo18-1.jpg',
    NULL,
    'Còn hàng',
    '{"material": "Da bò cao cấp bề mặt mịn", "color": "Nâu sẫm cà phê", "dimensions": "11.5cm x 9cm", "origin": "Việt Nam - Tanpolo", "gallery": ["/assets/images/products/bo18-1.jpg", "/assets/images/products/bo18-2.jpg", "/assets/images/products/bo18-3.jpg", "/assets/images/products/bo18-4.jpg", "/assets/images/products/bo18-5.jpg"]}'::jsonb
),
(
    'p_bo19',
    'Ví Ngang Da Bò Nam Tanpolo Classic Grain - Đen Nhám',
    '350.000đ',
    '460.000đ',
    '-24%',
    350000,
    'Dòng ví da nam kinh điển của Tanpolo, chất liệu da bò nguyên cọng xử lý dập hạt chống bám vân tay và mồ hôi, độ bền trên 5 năm sử dụng.',
    'vi-da',
    'Ví Da Bò Nam',
    '/assets/images/products/bo19-1.jpg',
    NULL,
    'Còn hàng',
    '{"material": "Da bò thật 100%", "color": "Đen nhám vân hạt", "dimensions": "12cm x 9.5cm", "origin": "Việt Nam - Tanpolo", "gallery": ["/assets/images/products/bo19-1.jpg", "/assets/images/products/bo19-2.jpg", "/assets/images/products/bo19-3.jpg", "/assets/images/products/bo19-4.jpg", "/assets/images/products/bo19-5.jpg"]}'::jsonb
),
(
    'p_bo20',
    'Ví Ngang Da Bò Nam Tanpolo Classic Grain - Nâu Hạt Dẻ',
    '350.000đ',
    '460.000đ',
    '-24%',
    350000,
    'Màu nâu hạt dẻ phong nhã, chất da bò mềm mại càng dùng càng bóng đẹp. Món quà tặng ý nghĩa và sang trọng dành cho phái mạnh.',
    'vi-da',
    'Ví Da Bò Nam',
    '/assets/images/products/bo20-1.jpg',
    'Mới',
    'Còn hàng',
    '{"material": "Da bò thật dập vân hạt", "color": "Nâu hạt dẻ", "dimensions": "12cm x 9.5cm", "origin": "Việt Nam - Tanpolo", "gallery": ["/assets/images/products/bo20-1.jpg", "/assets/images/products/bo20-2.jpg", "/assets/images/products/bo20-3.jpg", "/assets/images/products/bo20-4.jpg", "/assets/images/products/bo20-5.jpg"]}'::jsonb
),
(
    'p_bo21',
    'Thắt Lưng Da Bò Nam Tanpolo Khóa Tự Động Cao Cấp - Đen',
    '490.000đ',
    '650.000đ',
    '-25%',
    490000,
    'Dây nịt da bò nam khóa ray tự động không cần đục lỗ, mặt khóa kim loại viền bạc mạ tĩnh điện chống trầy xước khắc logo Tanpolo đẳng cấp.',
    'that-lung',
    'Thắt Lưng Da',
    '/assets/images/products/bo21-1.jpg',
    'Hot',
    'Còn hàng',
    '{"material": "Da bò thật 2 lớp cao cấp, khóa hợp kim không gỉ", "color": "Dây đen / Mặt khóa kim loại viền bạc", "dimensions": "Bản rộng 3.5cm, Dài 120cm - 125cm", "origin": "Việt Nam - Tanpolo", "gallery": ["/assets/images/products/bo21-1.jpg", "/assets/images/products/bo21-2.jpg", "/assets/images/products/bo21-3.jpg", "/assets/images/products/bo21-4.jpg", "/assets/images/products/bo21-5.jpg"]}'::jsonb
),
(
    'p_bo22',
    'Thắt Lưng Da Bò Nam Tanpolo Khóa Tự Động Cao Cấp - Nâu Sô-cô-la',
    '490.000đ',
    '650.000đ',
    '-25%',
    490000,
    'Phụ kiện quý ông công sở hoàn hảo, dây da bò nguyên tấm màu nâu sô-cô-la sang trọng phối cùng quần tây, giày da nâu tạo phong thái lịch lãm.',
    'that-lung',
    'Thắt Lưng Da',
    '/assets/images/products/bo22-1.jpg',
    'Mới',
    'Còn hàng',
    '{"material": "Da bò nguyên miếng 100%, khóa bấm tự động", "color": "Dây nâu sô-cô-la / Mặt khóa hợp kim", "dimensions": "Bản rộng 3.5cm, Dài 120cm - 125cm", "origin": "Việt Nam - Tanpolo", "gallery": ["/assets/images/products/bo22-1.jpg", "/assets/images/products/bo22-2.jpg", "/assets/images/products/bo22-3.jpg", "/assets/images/products/bo22-4.jpg", "/assets/images/products/bo22-5.jpg"]}'::jsonb
);

-- 4.3. ĐỔ DỮ LIỆU ĐƠN HÀNG MẪU PHÙ HỢP VỚI ĐỒ DA
INSERT INTO orders (id, customer, phone, address, notes, subtotal, shipping_fee, total, total_formatted, payment_method, status, status_text, created_at) VALUES
('#MS-84920', 'Nguyễn Văn Nam', '0912 345 678', '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh', 'Giao giờ hành chính', 980000, 0, 980000, '980.000đ', 'COD', 'completed', 'Thành công', '2026-08-15 14:30:00+07'),
('#MS-73194', 'Trần Đình Quân', '0988 765 432', '45 Lê Duẩn, Hải Châu, Đà Nẵng', 'Gọi trước khi giao', 490000, 30000, 520000, '520.000đ', 'QR Banking', 'pending', 'Đang xử lý', '2026-08-15 11:20:00+07'),
('#MS-65821', 'Lê Hoàng Phong', '0903 111 222', '78 Cầu Giấy, Hà Nội', '', 1030000, 0, 1030000, '1.030.000đ', 'COD', 'completed', 'Thành công', '2026-08-14 16:45:00+07'),
('#MS-51204', 'Phạm Minh Đức', '0977 444 555', '12 Trần Phú, Nha Trang, Khánh Hòa', '', 390000, 30000, 420000, '420.000đ', 'QR Banking', 'completed', 'Thành công', '2026-08-14 09:15:00+07');

-- 4.4. ĐỔ DỮ LIỆU CHI TIẾT ĐƠN HÀNG
INSERT INTO order_items (order_id, product_id, name, price, price_value, quantity, image) VALUES
('#MS-84920', 'p_bo5', 'Giày Tây Lười Da Bò Nam Tanpolo Luxury Dress Loafer - Đen Bóng', '980.000đ', 980000, 1, '/assets/images/products/bo5-1.jpg'),
('#MS-73194', 'p_bo21', 'Thắt Lưng Da Bò Nam Tanpolo Khóa Tự Động Cao Cấp - Đen', '490.000đ', 490000, 1, '/assets/images/products/bo21-1.jpg'),
('#MS-65821', 'p_bo4', 'Giày Lười Da Bò Nam Tanpolo Classic Loafer - Đen', '680.000đ', 680000, 1, '/assets/images/products/bo4-1.jpg'),
('#MS-65821', 'p_bo13', 'Ví Da Nam Mini Tanpolo Da Bò Dáng Gập Gọn - Đen', '350.000đ', 350000, 1, '/assets/images/products/bo13-1.jpg'),
('#MS-51204', 'p_bo14', 'Ví Da Nam Handmade Tanpolo Da Sáp Vintage - Nâu Sô-cô-la Chỉ Cam', '390.000đ', 390000, 1, '/assets/images/products/bo14-1.jpg');

-- 4.5. ĐỔ DỮ LIỆU VOUCHERS MẪU
INSERT INTO vouchers (id, code, name, discount_type, discount_value, min_order, max_discount, usage_limit, used_count, expiry_date, is_active) VALUES
('v_mini10', 'MINI10', 'Giảm 10% cho đơn từ 500K', 'percentage', 10, 500000, 100000, 200, 15, '2026-12-31', true),
('v_tanpolo50', 'TANPOLO50', 'Giảm 50.000đ mừng thành viên mới', 'fixed', 50000, 300000, NULL, 500, 42, '2026-12-31', true),
('v_freeship', 'FREESHIP', 'Miễn phí vận chuyển toàn quốc', 'fixed', 30000, 400000, 30000, 300, 28, '2026-12-31', true),
('v_vip20', 'VIP20', 'Giảm 20% đơn hàng từ 1.5 Triệu', 'percentage', 20, 1500000, 300000, 50, 4, '2026-12-31', true)
ON CONFLICT (code) DO NOTHING;

-- 4.6. ĐỔ DỮ LIỆU KHÁCH HÀNG MẪU
INSERT INTO customers (id, name, email, phone, address, role, notes) VALUES
('c_admin', 'Quản trị viên Tanpolo', 'admin@minishop.vn', '0909123456', 'Tòa nhà Sao Việt, TP. Hồ Chí Minh', 'admin', 'Tài khoản Super Admin'),
('c_001', 'Trần Văn Hùng', 'hung.tran@gmail.com', '0912345678', '123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', 'customer', 'Khách hàng thân thiết VIP'),
('c_002', 'Nguyễn Thị Mai', 'mai.nguyen@outlook.com', '0987654321', '456 Nguyễn Trãi, Phường 7, Quận 5, TP. Hồ Chí Minh', 'customer', 'Thường mua quà tặng'),
('c_003', 'Lê Hoàng Long', 'long.le@yahoo.com', '0908765432', '789 Cầu Giấy, Phường Dịch Vọng, Cầu Giấy, Hà Nội', 'customer', 'Đã mua giày tây 2 lần'),
('c_004', 'Phạm Minh Tuấn', 'tuan.pham@gmail.com', '0934567890', '12 Phan Chu Trinh, Phường Hải Châu 1, Hải Châu, Đà Nẵng', 'customer', 'Đơn hàng gần nhất thanh toán QR Banking')
ON CONFLICT (id) DO NOTHING;
