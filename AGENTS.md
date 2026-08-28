<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# MiniShop — Tanpolo Leather Goods

Website thương mại điện tử đồ da thủ công cao cấp Tanpolo. Next.js 16 (App Router) + Supabase trực tiếp, không có backend Node.js trung gian.

## Stack

- **Next.js 16.3.1** (App Router), **React 19.2.8**, **TypeScript 5**, **Tailwind CSS 4**
- **Supabase** qua `@supabase/supabase-js` (client-side, không Node backend, không connection string)
- **State**: React Context (không Redux/Zustand). Xem `src/context/`

## Cấu trúc thư mục

- **Repo root = app** — KHÔNG có thư mục `frontend/`. Chạy mọi lệnh từ thư mục gốc.
- `src/app/` — App Router pages (routes)
- `src/components/` — UI (`Header`, `Footer`, `ProductCard`, `ToastContainer`, `icons.tsx`)
- `src/context/` — Context providers (`auth`, `cart`, `shop`, `toast`, `wishlist`)
- `src/services/api.ts` — toàn bộ tầng truy cập Supabase (CRUD + thống kê)
- `src/lib/supabaseClient.ts` — khởi tạo Supabase client
- `src/types/index.ts` — shared TypeScript types
- `public/assets/images/` — ảnh được serve, tham chiếu dạng `/assets/images/...`
- `assets/images/` — ảnh gốc (raw), KHÔNG được serve trực tiếp
- `supabase/migrations/` — SQL migrations
- Path alias `@/*` → `./src/*`

## Lệnh

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint     # eslint
```

## Biến môi trường

Chỉ cần 2 biến (có fallback cứng trong `src/lib/supabaseClient.ts`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Data model (Supabase)

Bảng: `categories`, `products`, `orders`, `order_items`, `vouchers`, `customers`.

RLS được bật nhưng policies hiện tại cho phép public read/insert/all trên mọi bảng (chưa phân quyền thực sự).

⚠️ **Hai file schema lệch nhau**: `supabase_schema.sql` (repo root) có cột `products.stock_quantity`, còn `supabase/migrations/20260820123100_init_minishop_schema.sql` THIẾU cột này. Code (`services/api.ts`, `ShopContext`) phụ thuộc `stock_quantity`. `supabase_schema.sql` là schema tham chiếu chuẩn — đồng bộ migration trước khi migrate.

## Data flow

`ShopContext` là trung tâm dữ liệu, theo pattern **local-first + sync Supabase**:

1. Khởi tạo từ seed `INITIAL_*` (trong `ShopContext.tsx`).
2. Đọc cache `localStorage` (key `minishop_*`) để render nhanh.
3. `refreshData()` gọi `api.*` lấy dữ liệu thật từ Supabase, ghi đè local + cache.
4. Mọi mutation (CRUD) là **optimistic**: cập nhật local state + localStorage trước, rồi gọi `api.*`; nếu lỗi chỉ log/toast, KHÔNG rollback.

Nếu Supabase không kết nối được, app vẫn chạy hoàn toàn bằng dữ liệu local.

## Auth (lưu ý: chưa dùng Supabase Auth)

`AuthContext` là auth giả lập: login/register chỉ lưu `localStorage` (`minishop_user`), không xác thực thật. Role `admin` xác định bằng cách kiểm tra chuỗi account có chứa `"admin"` hay không.

## Routes

- `/` — homepage
- `/products`, `/products/[id]` — danh sách + chi tiết sản phẩm (hỗ trợ `?q=` tìm kiếm)
- `/cart`, `/checkout`, `/wishlist`
- `/login`, `/register`
- `/admin` — dashboard quản trị, toàn bộ trong `src/app/admin/page.tsx`, 6 tab: `overview`, `products`, `categories`, `inventory`, `orders`, `customers`
- `/chinh-sach/*` — 6 trang chính sách tĩnh (bảo hành, bảo mật, chăm sóc khách hàng, đổi trả, thanh toán, vận chuyển)

## Quy ước quan trọng

- **Icon là inline SVG** (không emoji). Dùng component từ `src/components/icons.tsx` (`Icon*` đã có sẵn).
- **Ngôn ngữ UI là tiếng Việt** (`lang="vi"`); nhãn/trạng thái hiển thị tiếng Việt.
- Styling chủ yếu là **custom CSS** trong `src/app/globals.css` (design-system classes: `.site-header`, `.brand-logo`, `.admin-tab-btn`…). Tailwind 4 có sẵn nhưng phần lớn giao diện dùng class riêng. Policy pages dùng `src/app/policy-pages.css`.
- Ảnh dùng thẻ `<img>`/SVG; `next.config.ts` đặt `images.unoptimized: true`.
- Giá hiển thị dạng chuỗi `"680.000đ"` + cột số `price_value` (`680000`) để tính toán/lọc. Tồn kho có 3 trạng thái: `Còn hàng`, `Sắp hết hàng` (≤5), `Hết hàng` (=0).
