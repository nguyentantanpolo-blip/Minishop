# MiniShop - Tanpolo Leather Goods E-Commerce

Dự án website thương mại điện tử đồ da thủ công cao cấp Tanpolo, được xây dựng với kiến trúc **Next.js 16 + Supabase Trực Tiếp (Direct Backend-as-a-Service)**.

---

## 🌟 Kiến Trúc Hệ Thống (Architecture)

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS, TypeScript.
- **Backend**: **100% Supabase** (Không sử dụng Node.js backend trung gian, không cần chuỗi kết nối Database Connection String).
- **Client SDK**: `@supabase/supabase-js` kết nối trực tiếp tới Supabase Data API thông qua `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Database**: Supabase Cloud PostgreSQL (Các bảng: `categories`, `products`, `orders`, `order_items`, `customers`).
- **Row Level Security (RLS)**: Đã kích hoạt và phân quyền chi tiết cho tất cả bảng dữ liệu.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Cài đặt Dependencies
```bash
cd frontend
npm install
```

### 2. Cấu hình biến môi trường
Tạo file `frontend/.env.local` chỉ với 2 biến Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://gortqzcuntzboghdjsdf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Chạy môi trường phát triển (Development)
```bash
cd frontend
npm run dev
```
Truy cập trình duyệt: **[http://localhost:3000](http://localhost:3000)**

---

## 📦 Danh Sách Chức Năng Chính

- **Quản lý Sản phẩm (CRUD)**: Danh sách, phân loại, tìm kiếm, chi tiết sản phẩm, thư viện ảnh đa dạng.
- **Quản lý Danh mục (CRUD)**: Danh mục giày tây, giày lười, dép da, ví da, thắt lưng.
- **Quản lý Đơn hàng & Tồn kho**:
  - Đặt hàng trực tuyến tự động trừ tồn kho.
  - Hủy đơn tự động hoàn tồn kho.
  - Tab Quản lý Tồn kho chuyên sâu trong `/admin` với 4 thẻ KPI và chức năng nhập/xuất kho.
- **Quản lý Khách hàng**: Thống kê số lượng đơn hàng, tổng chi tiêu theo thời gian thực.
- **Thống kê Báo cáo**: Doanh thu, cơ cấu sản phẩm, sản phẩm bán chạy nhất.
