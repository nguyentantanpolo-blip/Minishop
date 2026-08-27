# MiniShop - Tanpolo Leather Goods E-Commerce

Dự án website thương mại điện tử đồ da thủ công cao cấp Tanpolo, được xây dựng với kiến trúc **Full-stack Next.js 16 + Supabase PostgreSQL**.

---

## 🌟 Kiến Trúc Hệ Thống (Architecture)

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS, TypeScript.
- **Backend**: Next.js App Router Route Handlers (`src/app/api/...`) kết nối trực tiếp với **Supabase PostgreSQL** thông qua connection pooling (`pg.Pool`).
- **Database**: Supabase Cloud PostgreSQL (Hỗ trợ các bảng dữ liệu: `categories`, `products`, `orders`, `order_items`, `customers`).
- **Row Level Security (RLS)**: Đã kích hoạt và phân quyền chi tiết cho người dùng và quản trị viên.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Cài đặt Dependencies
```bash
cd frontend
npm install
```

### 2. Cấu hình biến môi trường
File `frontend/.env.local` đã được cấu hình sẵn kết nối tới Supabase:
```env
DATABASE_URL=postgresql://postgres.gortqzcuntzboghdjsdf:Anh%40081970123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
DIRECT_URL=postgresql://postgres:Anh%40081970123@db.gortqzcuntzboghdjsdf.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://gortqzcuntzboghdjsdf.supabase.co
NEXT_PUBLIC_API_URL=/api
```

### 3. Chạy môi trường phát triển (Development)
```bash
cd frontend
npm run dev
```
Truy cập trình duyệt: **[http://localhost:3000](http://localhost:3000)**

---

## 📦 Danh Sách API Endpoints (Next.js App Router)

| Endpoint Route | HTTP Method | Chức Năng |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Trạng thái API server |
| `/api/db-check` | `GET` | Kiểm tra kết nối Supabase & đếm số lượng bản ghi |
| `/api/products` | `GET`, `POST` | Danh sách sản phẩm (hỗ trợ lọc danh mục, tìm kiếm) / Thêm mới sản phẩm |
| `/api/products/[id]` | `GET`, `PUT`, `DELETE` | Chi tiết sản phẩm / Cập nhật / Xóa sản phẩm |
| `/api/categories` | `GET`, `POST` | Danh sách danh mục / Thêm danh mục |
| `/api/categories/[id]` | `GET`, `PUT`, `DELETE` | Chi tiết danh mục / Cập nhật / Xóa danh mục |
| `/api/orders` | `GET`, `POST` | Danh sách đơn hàng / Đặt hàng mới (Database Transaction) |
| `/api/orders/[id]` | `GET`, `PUT`, `DELETE` | Chi tiết đơn hàng / Sửa thông tin / Xóa đơn hàng |
| `/api/orders/[id]/status` | `PATCH` | Cập nhật nhanh trạng thái đơn hàng (`pending`, `shipping`, `completed`, `cancelled`) |
| `/api/customers` | `GET`, `POST` | Danh sách khách hàng kèm thống kê chi tiêu / Tạo khách hàng |
| `/api/customers/[id]` | `GET`, `PUT`, `DELETE` | Chi tiết khách hàng kèm lịch sử đơn hàng / Sửa / Xóa |
| `/api/inventory/adjust` | `POST` | Điều chỉnh nhanh số lượng tồn kho (nhập hàng, xuất bớt, đặt lại tồn) |
| `/api/stats/overview` | `GET` | Thống kê Dashboard: Doanh thu, Đơn hàng, Tồn kho & Định giá, Top bán chạy |
