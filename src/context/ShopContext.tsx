'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, Order, CartItem, Category, Customer, DashboardStats } from '@/types';
import { useToast } from './ToastContext';
import { api } from '@/services/api';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p_bo4',
    name: 'Giày Lười Da Bò Nam Tanpolo Classic Loafer - Đen',
    price: '680.000đ',
    oldPrice: '850.000đ',
    discount: '-20%',
    priceValue: 680000,
    desc: 'Giày lười slip-on phong cách quý ông cổ điển từ thương hiệu Tanpolo. Chất liệu da bò nguyên tấm bóng nhẹ, đế đúc cao su tự nhiên chống trượt êm ái khi di chuyển cả ngày.',
    category: 'giay-luoi',
    categoryName: 'Giày Lười Da',
    image: '/assets/images/products/bo4-1.jpg',
    badge: 'Mới',
    stock: 'Còn hàng',
    stockQuantity: 35,
    specs: {
      material: 'Da bò thật nguyên tấm 100%',
      color: 'Đen lịch lãm',
      dimensions: 'Size 38 - 43 chuẩn phom chân Việt',
      origin: 'Việt Nam - Tanpolo',
      gallery: ['/assets/images/products/bo4-1.jpg'],
    },
  },
  {
    id: 'p_bo5',
    name: 'Giày Tây Lười Da Bò Nam Tanpolo Luxury Dress Loafer - Đen Bóng',
    price: '980.000đ',
    oldPrice: '1.250.000đ',
    discount: '-22%',
    priceValue: 980000,
    desc: 'Thiết kế phom giày tây dress loafer chuẩn châu Âu với chất liệu da bò cao cấp xử lý bóng nhẹ sang trọng, kết hợp hoàn hảo cùng suit, vest và quần âu công sở.',
    category: 'giay-tay',
    categoryName: 'Giày Tây & Công Sở',
    image: '/assets/images/products/bo5-1.jpg',
    badge: 'Hot',
    stock: 'Còn hàng',
    stockQuantity: 28,
    specs: {
      material: 'Da bò cao cấp xử lý bóng, lót da êm chân',
      color: 'Đen bóng sang trọng',
      dimensions: 'Size 38 - 44',
      origin: 'Việt Nam - Tanpolo',
      gallery: [
        '/assets/images/products/bo5-1.jpg',
        '/assets/images/products/bo5-2.jpg',
        '/assets/images/products/bo5-3.jpg',
        '/assets/images/products/bo5-4.jpg',
        '/assets/images/products/bo5-5.jpg',
        '/assets/images/products/bo5-6.jpg',
      ],
    },
  },
  {
    id: 'p_bo6',
    name: 'Giày Tây Lười Da Bò Nam Tanpolo Luxury Dress Loafer - Nâu Hạt Dẻ',
    price: '980.000đ',
    oldPrice: '1.250.000đ',
    discount: '-22%',
    priceValue: 980000,
    desc: 'Sắc nâu hạt dẻ cổ điển với kỹ thuật đánh màu patina thủ công tinh xảo. Đế phíp cao cấp kết hợp mặt cao su chống trơn trượt, tôn dáng người mang.',
    category: 'giay-tay',
    categoryName: 'Giày Tây & Công Sở',
    image: '/assets/images/products/bo6-1.jpg',
    badge: 'Mới',
    stock: 'Còn hàng',
    stockQuantity: 42,
    specs: {
      material: 'Da bò tấm phủ bóng patina thủ công',
      color: 'Nâu hạt dẻ',
      dimensions: 'Size 38 - 44',
      origin: 'Việt Nam - Tanpolo',
      gallery: [
        '/assets/images/products/bo6-1.jpg',
        '/assets/images/products/bo6-2.jpg',
        '/assets/images/products/bo6-3.jpg',
        '/assets/images/products/bo6-4.jpg',
        '/assets/images/products/bo6-5.jpg',
        '/assets/images/products/bo6-6.jpg',
      ],
    },
  },
  {
    id: 'p_bo7',
    name: 'Dép Quai Chéo Da Bò Nam Tanpolo Khâu Viền Thủ Công - Đen',
    price: '420.000đ',
    oldPrice: '550.000đ',
    discount: '-24%',
    priceValue: 420000,
    desc: 'Dép quai chéo phong cách trẻ trung, chất da bò Nappa mềm mại cùng đường chỉ viền khâu tay tỉ mỉ. Lòng đế công thái học nâng đỡ bàn chân êm ái.',
    category: 'dep-da',
    categoryName: 'Dép Da & Sandal',
    image: '/assets/images/products/bo7-1.jpg',
    badge: 'Mới',
    stock: 'Còn hàng',
    stockQuantity: 15,
    specs: {
      material: 'Da bò Nappa cao cấp, đế PU siêu êm',
      color: 'Đen viền chỉ thủ công',
      dimensions: 'Size 38 - 43',
      origin: 'Việt Nam - Tanpolo',
      gallery: [
        '/assets/images/products/bo7-1.jpg',
        '/assets/images/products/bo7-2.jpg',
        '/assets/images/products/bo7-3.jpg',
        '/assets/images/products/bo7-4.jpg',
        '/assets/images/products/bo7-5.jpg',
        '/assets/images/products/bo7-6.jpg',
      ],
    },
  },
  {
    id: 'p_bo8',
    name: 'Dép Quai Chéo Da Bò Nam Tanpolo Vân Dập Sang Trọng - Đen',
    price: '450.000đ',
    oldPrice: '580.000đ',
    discount: '-22%',
    priceValue: 450000,
    desc: 'Thiết kế quai chéo hiện đại với chi tiết dập vân tinh xảo, khoen logo kim loại Tanpolo sáng bóng, chống mài mòn và chống thấm nước hiệu quả.',
    category: 'dep-da',
    categoryName: 'Dép Da & Sandal',
    image: '/assets/images/products/bo8-1.jpg',
    badge: 'Hot',
    stock: 'Sắp hết hàng',
    stockQuantity: 4,
    specs: {
      material: 'Da bò dập vân hạt cao cấp, khoen hợp kim',
      color: 'Đen tuyền',
      dimensions: 'Size 38 - 43',
      origin: 'Việt Nam - Tanpolo',
      gallery: [
        '/assets/images/products/bo8-1.jpg',
        '/assets/images/products/bo8-2.jpg',
        '/assets/images/products/bo8-3.jpg',
        '/assets/images/products/bo8-4.jpg',
        '/assets/images/products/bo8-5.jpg',
        '/assets/images/products/bo8-6.jpg',
      ],
    },
  },
  {
    id: 'p_bo9',
    name: 'Dép Quai Chéo Da Bò Nam Tanpolo Casual Comfort - Nâu Cà Phê',
    price: '420.000đ',
    oldPrice: '550.000đ',
    discount: '-24%',
    priceValue: 420000,
    desc: 'Sắc nâu cà phê ấm áp thanh lịch. Bản quai da bò tấm tự nhiên ôm khít mu bàn chân, đế rãnh chống trơn trượt an toàn trong mọi thời tiết.',
    category: 'dep-da',
    categoryName: 'Dép Da & Sandal',
    image: '/assets/images/products/bo9-1.jpg',
    badge: 'Mới',
    stock: 'Sắp hết hàng',
    stockQuantity: 2,
    specs: {
      material: 'Da bò tự nhiên 100%, lót da êm chân',
      color: 'Nâu cà phê',
      dimensions: 'Size 38 - 43',
      origin: 'Việt Nam - Tanpolo',
      gallery: [
        '/assets/images/products/bo9-1.jpg',
        '/assets/images/products/bo9-2.jpg',
        '/assets/images/products/bo9-3.jpg',
        '/assets/images/products/bo9-4.jpg',
        '/assets/images/products/bo9-5.jpg',
        '/assets/images/products/bo9-6.jpg',
      ],
    },
  },
  {
    id: 'p_bo10',
    name: 'Dép Quai Da Nam Tanpolo Đúc Vân Da Hạt - Nâu Đậm',
    price: '450.000đ',
    oldPrice: '580.000đ',
    discount: '-22%',
    priceValue: 450000,
    desc: 'Kiểu dáng quai da bản lớn tối giản, đế PU siêu nhẹ dập hoa văn chống trượt. Tông nâu đậm nam tính, bền chắc theo năm tháng.',
    category: 'dep-da',
    categoryName: 'Dép Da & Sandal',
    image: '/assets/images/products/bo10-1.jpg',
    stock: 'Hết hàng',
    stockQuantity: 0,
    specs: {
      material: 'Da bò mill hạt nhập khẩu',
      color: 'Nâu đậm sang trọng',
      dimensions: 'Size 38 - 43',
      origin: 'Việt Nam - Tanpolo',
      gallery: [
        '/assets/images/products/bo10-1.jpg',
        '/assets/images/products/bo10-2.jpg',
        '/assets/images/products/bo10-3.jpg',
        '/assets/images/products/bo10-4.jpg',
        '/assets/images/products/bo10-5.jpg',
        '/assets/images/products/bo10-6.jpg',
      ],
    },
  },
  {
    id: 'p_bo11',
    name: 'Dép Kẹp Da Bò Nam Tanpolo Quai Tròn Êm Ái - Nâu Bò',
    price: '380.000đ',
    oldPrice: '490.000đ',
    discount: '-22%',
    priceValue: 380000,
    desc: 'Dép xỏ ngón da bò thật Tanpolo thiết kế quai tròn bọc da mềm mại không gây đau kẽ chân, lòng dép dập logo vương miện Tanpolo sắc nét.',
    category: 'dep-da',
    categoryName: 'Dép Da & Sandal',
    image: '/assets/images/products/bo11-1.jpg',
    badge: 'Hot',
    stock: 'Còn hàng',
    stockQuantity: 50,
    specs: {
      material: 'Da bò mộc tự nhiên mềm êm',
      color: 'Nâu bò cổ điển',
      dimensions: 'Size 38 - 43',
      origin: 'Việt Nam - Tanpolo',
      gallery: [
        '/assets/images/products/bo11-1.jpg',
        '/assets/images/products/bo11-2.jpg',
        '/assets/images/products/bo11-3.jpg',
        '/assets/images/products/bo11-4.jpg',
        '/assets/images/products/bo11-5.jpg',
        '/assets/images/products/bo11-6.jpg',
      ],
    },
  },
  {
    id: 'p_bo12',
    name: 'Dép Kẹp Da Bò Nam Tanpolo Dynamic - Đen Cổ Điển',
    price: '380.000đ',
    oldPrice: '490.000đ',
    discount: '-22%',
    priceValue: 380000,
    desc: 'Dép kẹp da nam màu đen truyền thống năng động, quai da ép nhiệt dập hoa văn nổi tinh xảo, thích hợp dạo phố, đi biển hay sinh hoạt thường ngày.',
    category: 'dep-da',
    categoryName: 'Dép Da & Sandal',
    image: '/assets/images/products/bo12-1.jpg',
    stock: 'Còn hàng',
    stockQuantity: 60,
    specs: {
      material: 'Da bò thật 100%, đế cao su đàn hồi',
      color: 'Đen bóng',
      dimensions: 'Size 38 - 43',
      origin: 'Việt Nam - Tanpolo',
      gallery: [
        '/assets/images/products/bo12-1.jpg',
        '/assets/images/products/bo12-2.jpg',
        '/assets/images/products/bo12-3.jpg',
        '/assets/images/products/bo12-4.jpg',
        '/assets/images/products/bo12-5.jpg',
        '/assets/images/products/bo12-6.jpg',
      ],
    },
  },
  {
    id: 'p_bo13',
    name: 'Ví Da Nam Mini Tanpolo Da Bò Dáng Gập Gọn - Đen',
    price: '350.000đ',
    oldPrice: '450.000đ',
    discount: '-22%',
    priceValue: 350000,
    desc: 'Ví da mini siêu mỏng gọn gàng bỏ vừa túi áo hoặc túi quần tây mà không bị cộm. Đầy đủ ngăn đựng CCCD gắn chip, thẻ ATM và tiền mặt.',
    category: 'vi-da',
    categoryName: 'Ví Da Bò Nam',
    image: '/assets/images/products/bo13-1.jpg',
    badge: 'Mới',
    stock: 'Còn hàng',
    stockQuantity: 45,
    specs: {
      material: 'Da bò thật 100%',
      color: 'Đen trơn',
      dimensions: '11cm x 8.5cm x 1cm',
      origin: 'Việt Nam - Tanpolo',
      gallery: [
        '/assets/images/products/bo13-1.jpg',
        '/assets/images/products/bo13-2.jpg',
        '/assets/images/products/bo13-3.jpg',
        '/assets/images/products/bo13-4.jpg',
        '/assets/images/products/bo13-5.jpg',
      ],
    },
  },
  {
    id: 'p_bo14',
    name: 'Ví Da Nam Handmade Tanpolo Da Sáp Vintage - Nâu Sô-cô-la Chỉ Cam',
    price: '390.000đ',
    oldPrice: '520.000đ',
    discount: '-25%',
    priceValue: 390000,
    desc: 'Dòng ví thủ công cao cấp chế tác từ da bò sáp Crazy Horse nguyên tấm với hiệu ứng đổi màu xước bụi độc đáo, đường viền may chỉ cam nổi bật cá tính.',
    category: 'vi-da',
    categoryName: 'Ví Da Bò Nam',
    image: '/assets/images/products/bo14-1.jpg',
    badge: 'Hot',
    stock: 'Còn hàng',
    stockQuantity: 30,
    specs: {
      material: 'Da bò sáp ngựa điên (Crazy Horse Leather)',
      color: 'Nâu sô-cô-la viền cam',
      dimensions: '12cm x 9.5cm x 1.5cm',
      origin: 'Việt Nam - Tanpolo',
      gallery: [
        '/assets/images/products/bo14-1.jpg',
        '/assets/images/products/bo14-2.jpg',
        '/assets/images/products/bo14-3.jpg',
        '/assets/images/products/bo14-4.jpg',
        '/assets/images/products/bo14-5.jpg',
      ],
    },
  },
  {
    id: 'p_bo15',
    name: 'Ví Ngang Da Bò Nam Tanpolo Vân Hạt - Đen Sang Trọng',
    price: '360.000đ',
    oldPrice: '480.000đ',
    discount: '-25%',
    priceValue: 360000,
    desc: 'Kiểu dáng ví ngang tiêu chuẩn doanh nhân, bề mặt da bò dập vân hạt nhuyễn chống xước và chống thấm nước, logo Tanpolo góc phải dập chìm trang nhã.',
    category: 'vi-da',
    categoryName: 'Ví Da Bò Nam',
    image: '/assets/images/products/bo15-1.jpg',
    badge: 'Mới',
    stock: 'Còn hàng',
    stockQuantity: 25,
    specs: {
      material: 'Da bò hạt cao cấp dẻo dai',
      color: 'Đen vân hạt',
      dimensions: '12cm x 9.5cm',
      origin: 'Việt Nam - Tanpolo',
      gallery: [
        '/assets/images/products/bo15-1.jpg',
        '/assets/images/products/bo15-2.jpg',
        '/assets/images/products/bo15-3.jpg',
        '/assets/images/products/bo15-4.jpg',
        '/assets/images/products/bo15-5.jpg',
      ],
    },
  },
  {
    id: 'p_bo16',
    name: 'Ví Ngang Da Bò Nam Tanpolo Vân Hạt - Nâu Cà Phê',
    price: '360.000đ',
    oldPrice: '480.000đ',
    discount: '-25%',
    priceValue: 360000,
    desc: 'Tông màu nâu cà phê trầm tĩnh sang trọng, cấu trúc 2 ngăn lớn đựng tiền và 8 khe cắm thẻ ngân hàng tiện dụng, chất da mềm cầm êm tay.',
    category: 'vi-da',
    categoryName: 'Ví Da Bò Nam',
    image: '/assets/images/products/bo16-1.jpg',
    stock: 'Còn hàng',
    stockQuantity: 18,
    specs: {
      material: 'Da bò thật 100% vân hạt',
      color: 'Nâu cà phê',
      dimensions: '12cm x 9.5cm',
      origin: 'Việt Nam - Tanpolo',
      gallery: [
        '/assets/images/products/bo16-1.jpg',
        '/assets/images/products/bo16-2.jpg',
        '/assets/images/products/bo16-3.jpg',
        '/assets/images/products/bo16-4.jpg',
        '/assets/images/products/bo16-5.jpg',
      ],
    },
  },
  {
    id: 'p_bo17',
    name: 'Ví Đứng Da Bò Nam Tanpolo Modern Vertical - Nâu Bò Sáng',
    price: '370.000đ',
    oldPrice: '490.000đ',
    discount: '-24%',
    priceValue: 370000,
    desc: 'Thiết kế dáng ví đứng thời thượng, đường chỉ viền may thủ công màu vàng sáng. Dễ dàng rút thẻ nhanh chóng, đựng vừa các loại giấy tờ tùy thân mới.',
    category: 'vi-da',
    categoryName: 'Ví Da Bò Nam',
    image: '/assets/images/products/bo17-1.jpg',
    badge: 'Mới',
    stock: 'Sắp hết hàng',
    stockQuantity: 3,
    specs: {
      material: 'Da bò Nappa mềm mịn',
      color: 'Nâu bò sáng viền chỉ vàng',
      dimensions: '11.5cm x 9cm',
      origin: 'Việt Nam - Tanpolo',
      gallery: [
        '/assets/images/products/bo17-1.jpg',
        '/assets/images/products/bo17-2.jpg',
        '/assets/images/products/bo17-3.jpg',
        '/assets/images/products/bo17-4.jpg',
        '/assets/images/products/bo17-5.jpg',
      ],
    },
  },
  {
    id: 'p_bo18',
    name: 'Ví Đứng Da Bò Nam Tanpolo Modern Vertical - Nâu Sẫm Cà Phê',
    price: '370.000đ',
    oldPrice: '490.000đ',
    discount: '-24%',
    priceValue: 370000,
    desc: 'Thiết kế ví đứng thanh lịch phong cách châu Âu, chất da sáp mịn dẻo dai, ngăn đựng tiền sâu kín đáo, góc ví ép kim logo thương hiệu Tanpolo Since 1992s.',
    category: 'vi-da',
    categoryName: 'Ví Da Bò Nam',
    image: '/assets/images/products/bo18-1.jpg',
    stock: 'Còn hàng',
    stockQuantity: 22,
    specs: {
      material: 'Da bò cao cấp bề mặt mịn',
      color: 'Nâu sẫm cà phê',
      dimensions: '11.5cm x 9cm',
      origin: 'Việt Nam - Tanpolo',
      gallery: [
        '/assets/images/products/bo18-1.jpg',
        '/assets/images/products/bo18-2.jpg',
        '/assets/images/products/bo18-3.jpg',
        '/assets/images/products/bo18-4.jpg',
        '/assets/images/products/bo18-5.jpg',
      ],
    },
  },
  {
    id: 'p_bo19',
    name: 'Ví Ngang Da Bò Nam Tanpolo Classic Grain - Đen Nhám',
    price: '350.000đ',
    oldPrice: '460.000đ',
    discount: '-24%',
    priceValue: 350000,
    desc: 'Dòng ví da nam kinh điển của Tanpolo, chất liệu da bò nguyên cọng xử lý dập hạt chống bám vân tay và mồ hôi, độ bền trên 5 năm sử dụng.',
    category: 'vi-da',
    categoryName: 'Ví Da Bò Nam',
    image: '/assets/images/products/bo19-1.jpg',
    stock: 'Còn hàng',
    stockQuantity: 55,
    specs: {
      material: 'Da bò thật 100%',
      color: 'Đen nhám vân hạt',
      dimensions: '12cm x 9.5cm',
      origin: 'Việt Nam - Tanpolo',
      gallery: [
        '/assets/images/products/bo19-1.jpg',
        '/assets/images/products/bo19-2.jpg',
        '/assets/images/products/bo19-3.jpg',
        '/assets/images/products/bo19-4.jpg',
        '/assets/images/products/bo19-5.jpg',
      ],
    },
  },
  {
    id: 'p_bo20',
    name: 'Ví Ngang Da Bò Nam Tanpolo Classic Grain - Nâu Hạt Dẻ',
    price: '350.000đ',
    oldPrice: '460.000đ',
    discount: '-24%',
    priceValue: 350000,
    desc: 'Màu nâu hạt dẻ phong nhã, chất da bò mềm mại càng dùng càng bóng đẹp. Món quà tặng ý nghĩa và sang trọng dành cho phái mạnh.',
    category: 'vi-da',
    categoryName: 'Ví Da Bò Nam',
    image: '/assets/images/products/bo20-1.jpg',
    badge: 'Mới',
    stock: 'Còn hàng',
    stockQuantity: 40,
    specs: {
      material: 'Da bò thật dập vân hạt',
      color: 'Nâu hạt dẻ',
      dimensions: '12cm x 9.5cm',
      origin: 'Việt Nam - Tanpolo',
      gallery: [
        '/assets/images/products/bo20-1.jpg',
        '/assets/images/products/bo20-2.jpg',
        '/assets/images/products/bo20-3.jpg',
        '/assets/images/products/bo20-4.jpg',
        '/assets/images/products/bo20-5.jpg',
      ],
    },
  },
  {
    id: 'p_bo21',
    name: 'Thắt Lưng Da Bò Nam Tanpolo Khóa Tự Động Cao Cấp - Đen',
    price: '490.000đ',
    oldPrice: '650.000đ',
    discount: '-25%',
    priceValue: 490000,
    desc: 'Dây nịt da bò nam khóa ray tự động không cần đục lỗ, mặt khóa kim loại viền bạc mạ tĩnh điện chống trầy xước khắc logo Tanpolo đẳng cấp.',
    category: 'that-lung',
    categoryName: 'Thắt Lưng Da',
    image: '/assets/images/products/bo21-1.jpg',
    badge: 'Hot',
    stock: 'Còn hàng',
    stockQuantity: 38,
    specs: {
      material: 'Da bò thật 2 lớp cao cấp, khóa hợp kim không gỉ',
      color: 'Dây đen / Mặt khóa kim loại viền bạc',
      dimensions: 'Bản rộng 3.5cm, Dài 120cm - 125cm',
      origin: 'Việt Nam - Tanpolo',
      gallery: [
        '/assets/images/products/bo21-1.jpg',
        '/assets/images/products/bo21-2.jpg',
        '/assets/images/products/bo21-3.jpg',
        '/assets/images/products/bo21-4.jpg',
        '/assets/images/products/bo21-5.jpg',
      ],
    },
  },
  {
    id: 'p_bo22',
    name: 'Thắt Lưng Da Bò Nam Tanpolo Khóa Tự Động Cao Cấp - Nâu Sô-cô-la',
    price: '490.000đ',
    oldPrice: '650.000đ',
    discount: '-25%',
    priceValue: 490000,
    desc: 'Phụ kiện quý ông công sở hoàn hảo, dây da bò nguyên tấm màu nâu sô-cô-la sang trọng phối cùng quần tây, giày da nâu tạo phong thái lịch lãm.',
    category: 'that-lung',
    categoryName: 'Thắt Lưng Da',
    image: '/assets/images/products/bo22-1.jpg',
    badge: 'Mới',
    stock: 'Còn hàng',
    stockQuantity: 35,
    specs: {
      material: 'Da bò nguyên miếng 100%, khóa bấm tự động',
      color: 'Dây nâu sô-cô-la / Mặt khóa hợp kim',
      dimensions: 'Bản rộng 3.5cm, Dài 120cm - 125cm',
      origin: 'Việt Nam - Tanpolo',
      gallery: [
        '/assets/images/products/bo22-1.jpg',
        '/assets/images/products/bo22-2.jpg',
        '/assets/images/products/bo22-3.jpg',
        '/assets/images/products/bo22-4.jpg',
        '/assets/images/products/bo22-5.jpg',
      ],
    },
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: '#MS-84920',
    date: '2026-08-15 14:30',
    customer: 'Nguyễn Văn Nam',
    phone: '0912 345 678',
    address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    items: [
      {
        id: 'p_bo5',
        name: 'Giày Tây Lười Da Bò Nam Tanpolo Luxury Dress Loafer - Đen Bóng',
        price: '980.000đ',
        priceValue: 980000,
        image: '/assets/images/products/bo5-1.jpg',
        quantity: 1,
      },
    ],
    subtotal: 980000,
    shippingFee: 0,
    total: 980000,
    totalFormatted: '980.000đ',
    paymentMethod: 'COD',
    status: 'completed',
    statusText: 'Thành công',
    notes: 'Giao giờ hành chính',
  },
  {
    id: '#MS-73194',
    date: '2026-08-15 11:20',
    customer: 'Trần Đình Quân',
    phone: '0988 765 432',
    address: '45 Lê Duẩn, Hải Châu, Đà Nẵng',
    items: [
      {
        id: 'p_bo21',
        name: 'Thắt Lưng Da Bò Nam Tanpolo Khóa Tự Động Cao Cấp - Đen',
        price: '490.000đ',
        priceValue: 490000,
        image: '/assets/images/products/bo21-1.jpg',
        quantity: 1,
      },
    ],
    subtotal: 490000,
    shippingFee: 30000,
    total: 520000,
    totalFormatted: '520.000đ',
    paymentMethod: 'QR Banking',
    status: 'pending',
    statusText: 'Đang xử lý',
    notes: 'Gọi trước khi giao',
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'giay-tay', name: 'Giày Tây & Công Sở', description: 'Giày da dress loafer, oxford sang trọng', image: '/assets/images/products/bo5-1.jpg' },
  { id: 'giay-luoi', name: 'Giày Lười Da', description: 'Giày lười slip-on quý ông êm ái', image: '/assets/images/products/bo4-1.jpg' },
  { id: 'dep-da', name: 'Dép Da & Sandal', description: 'Dép quai da bò, sandal nam cao cấp', image: '/assets/images/products/bo7-1.jpg' },
  { id: 'vi-da', name: 'Ví Da Bò Nam', description: 'Ví gập, ví đứng, ví handmade da sáp', image: '/assets/images/products/bo14-1.jpg' },
  { id: 'that-lung', name: 'Thắt Lưng Da', description: 'Dây nịt da bò khóa tự động cao cấp', image: '/assets/images/products/bo21-1.jpg' },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c_admin',
    name: 'Quản trị viên Tanpolo',
    email: 'admin@minishop.vn',
    phone: '0909123456',
    address: 'Tòa nhà Sao Việt, TP. Hồ Chí Minh',
    role: 'admin',
    notes: 'Tài khoản Super Admin',
    totalOrders: 0,
    totalSpent: 0,
  },
  {
    id: 'c_001',
    name: 'Trần Văn Hùng',
    email: 'hung.tran@gmail.com',
    phone: '0912345678',
    address: '123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    role: 'customer',
    notes: 'Khách hàng thân thiết VIP',
    totalOrders: 2,
    totalSpent: 1660000,
  },
  {
    id: 'c_002',
    name: 'Nguyễn Thị Mai',
    email: 'mai.nguyen@outlook.com',
    phone: '0987654321',
    address: '456 Nguyễn Trãi, Phường 7, Quận 5, TP. Hồ Chí Minh',
    role: 'customer',
    notes: 'Thường mua quà tặng',
    totalOrders: 1,
    totalSpent: 450000,
  },
  {
    id: 'c_003',
    name: 'Lê Hoàng Long',
    email: 'long.le@yahoo.com',
    phone: '0908765432',
    address: '789 Cầu Giấy, Phường Dịch Vọng, Cầu Giấy, Hà Nội',
    role: 'customer',
    notes: 'Đã mua giày tây 2 lần',
    totalOrders: 1,
    totalSpent: 980000,
  },
  {
    id: 'c_004',
    name: 'Phạm Minh Tuấn',
    email: 'tuan.pham@gmail.com',
    phone: '0934567890',
    address: '12 Phan Chu Trinh, Phường Hải Châu 1, Hải Châu, Đà Nẵng',
    role: 'customer',
    notes: 'Đơn hàng gần nhất thanh toán QR Banking',
    totalOrders: 1,
    totalSpent: 420000,
  },
];

interface ShopContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  stats: DashboardStats | null;
  isLoading: boolean;
  isBackendConnected: boolean;
  refreshData: () => Promise<void>;

  // Product CRUD
  addProduct: (productData: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  resetProducts: () => void;
  adjustStock: (
    productId: string,
    payload: { newQuantity?: number; changeQuantity?: number; reason?: string }
  ) => Promise<void>;

  // Category CRUD
  addCategory: (catData: Category) => Promise<void>;
  updateCategory: (id: string, catData: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Order CRUD
  placeOrder: (orderData: {
    customer: string;
    phone: string;
    address: string;
    notes?: string;
    items: CartItem[];
    paymentMethod: string;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  updateOrder: (orderId: string, orderData: Partial<Order>) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;

  // Customer CRUD
  addCustomer: (customerData: Partial<Customer>) => Promise<void>;
  updateCustomer: (id: string, customerData: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;

  formatPrice: (value: number) => string;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const { showToast } = useToast();

  const formatPrice = (val: number) => {
    return val.toLocaleString('vi-VN') + 'đ';
  };

  // Fetch initial data from Backend API -> Supabase DB
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedProducts, fetchedCategories, fetchedOrders, fetchedCustomers, fetchedStats] =
        await Promise.allSettled([
          api.getProducts(),
          api.getCategories(),
          api.getOrders(),
          api.getCustomers(),
          api.getStatsOverview(),
        ]);

      if (fetchedProducts.status === 'fulfilled' && fetchedProducts.value.length > 0) {
        setProducts(fetchedProducts.value);
        setIsBackendConnected(true);
        localStorage.setItem('minishop_products', JSON.stringify(fetchedProducts.value));
      }

      if (fetchedCategories.status === 'fulfilled' && fetchedCategories.value.length > 0) {
        setCategories(fetchedCategories.value);
        localStorage.setItem('minishop_categories', JSON.stringify(fetchedCategories.value));
      }

      if (fetchedOrders.status === 'fulfilled' && fetchedOrders.value.length > 0) {
        setOrders(fetchedOrders.value);
        localStorage.setItem('minishop_orders', JSON.stringify(fetchedOrders.value));
      }

      if (fetchedCustomers.status === 'fulfilled' && fetchedCustomers.value.length > 0) {
        setCustomers(fetchedCustomers.value);
        localStorage.setItem('minishop_customers', JSON.stringify(fetchedCustomers.value));
      }

      if (fetchedStats.status === 'fulfilled') {
        setStats(fetchedStats.value);
      }
    } catch (err) {
      console.warn('Backend API not reachable, using local fallback:', err);
      setIsBackendConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial local read for fast render
    try {
      const storedProds = localStorage.getItem('minishop_products');
      if (storedProds) {
        const parsed = JSON.parse(storedProds);
        if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
      }

      const storedCats = localStorage.getItem('minishop_categories');
      if (storedCats) {
        const parsed = JSON.parse(storedCats);
        if (Array.isArray(parsed) && parsed.length > 0) setCategories(parsed);
      }

      const storedOrders = localStorage.getItem('minishop_orders');
      if (storedOrders) {
        const parsed = JSON.parse(storedOrders);
        if (Array.isArray(parsed) && parsed.length > 0) setOrders(parsed);
      }

      const storedCustomers = localStorage.getItem('minishop_customers');
      if (storedCustomers) {
        const parsed = JSON.parse(storedCustomers);
        if (Array.isArray(parsed) && parsed.length > 0) setCustomers(parsed);
      }
    } catch (e) {}

    setMounted(true);
    // Fetch live from Backend
    refreshData();
  }, [refreshData]);

  const saveProductsToStorage = (newProducts: Product[]) => {
    setProducts(newProducts);
    try {
      localStorage.setItem('minishop_products', JSON.stringify(newProducts));
    } catch (e) {}
  };

  const saveOrdersToStorage = (newOrders: Order[]) => {
    setOrders(newOrders);
    try {
      localStorage.setItem('minishop_orders', JSON.stringify(newOrders));
    } catch (e) {}
  };

  const saveCategoriesToStorage = (newCats: Category[]) => {
    setCategories(newCats);
    try {
      localStorage.setItem('minishop_categories', JSON.stringify(newCats));
    } catch (e) {}
  };

  const saveCustomersToStorage = (newCustomers: Customer[]) => {
    setCustomers(newCustomers);
    try {
      localStorage.setItem('minishop_customers', JSON.stringify(newCustomers));
    } catch (e) {}
  };

  // =========================================================================
  // Product CRUD Handlers
  // =========================================================================
  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const newId = 'p_' + Date.now().toString(36);
    const newProduct: Product = {
      ...productData,
      id: newId,
    };

    const updated = [newProduct, ...products];
    saveProductsToStorage(updated);

    try {
      const created = await api.createProduct({ ...newProduct });
      if (created && created.id) {
        const synced = products.map((p) => (p.id === newId ? created : p));
        saveProductsToStorage(synced.length ? synced : [created, ...products]);
      }
      showToast(`Đã thêm sản phẩm "${newProduct.name}" vào Database!`, 'success');
    } catch (err: any) {
      showToast(`Đã lưu sản phẩm "${newProduct.name}"!`, 'success');
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...productData } : p));
    saveProductsToStorage(updated);

    try {
      await api.updateProduct(id, productData);
      showToast(`Đã cập nhật sản phẩm "${productData.name || id}" trên Database!`, 'success');
    } catch (err: any) {
      showToast(`Đã cập nhật sản phẩm "${productData.name || id}"!`, 'success');
    }
  };

  const deleteProduct = async (id: string) => {
    const p = products.find((prod) => prod.id === id);
    const updated = products.filter((prod) => prod.id !== id);
    saveProductsToStorage(updated);

    try {
      await api.deleteProduct(id);
      showToast(`Đã xóa sản phẩm "${p?.name || id}" khỏi Database!`, 'info');
    } catch (err: any) {
      showToast(`Đã xóa sản phẩm "${p?.name || id}"!`, 'info');
    }
  };

  const resetProducts = () => {
    saveProductsToStorage(INITIAL_PRODUCTS);
    showToast('Đã khôi phục dữ liệu sản phẩm mặc định!', 'info');
  };

  const adjustStock = async (
    productId: string,
    payload: { newQuantity?: number; changeQuantity?: number; reason?: string }
  ) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const currentQty = prod.stockQuantity !== undefined ? prod.stockQuantity : 50;
    let targetQty = currentQty;
    if (payload.newQuantity !== undefined && payload.newQuantity !== null) {
      targetQty = Math.max(0, Number(payload.newQuantity));
    } else if (payload.changeQuantity !== undefined && payload.changeQuantity !== null) {
      targetQty = Math.max(0, currentQty + Number(payload.changeQuantity));
    }

    let derivedStock = 'Còn hàng';
    if (targetQty === 0) derivedStock = 'Hết hàng';
    else if (targetQty <= 5) derivedStock = 'Sắp hết hàng';

    const updated = products.map((p) =>
      p.id === productId ? { ...p, stockQuantity: targetQty, stock: derivedStock } : p
    );
    saveProductsToStorage(updated);

    try {
      await api.adjustStock(productId, payload);
      showToast(`Đã cập nhật tồn kho "${prod.name}" (${currentQty} → ${targetQty})!`, 'success');
      refreshData();
    } catch (err: any) {
      showToast(`Đã điều chỉnh tồn kho "${prod.name}"!`, 'info');
    }
  };

  // =========================================================================
  // Category CRUD Handlers
  // =========================================================================
  const addCategory = async (catData: Category) => {
    const updated = [...categories, catData];
    saveCategoriesToStorage(updated);

    try {
      await api.createCategory(catData);
      showToast(`Đã thêm danh mục "${catData.name}" vào Database!`, 'success');
    } catch (err: any) {
      showToast(`Đã thêm danh mục "${catData.name}"!`, 'success');
    }
  };

  const updateCategory = async (id: string, catData: Partial<Category>) => {
    const updated = categories.map((c) => (c.id === id ? { ...c, ...catData } : c));
    saveCategoriesToStorage(updated);

    if (catData.name) {
      const updatedProducts = products.map((p) =>
        p.category === id ? { ...p, categoryName: catData.name! } : p
      );
      saveProductsToStorage(updatedProducts);
    }

    try {
      await api.updateCategory(id, catData);
      showToast(`Đã cập nhật danh mục "${catData.name || id}" trên Database!`, 'success');
    } catch (err: any) {
      showToast(`Đã cập nhật danh mục "${catData.name || id}"!`, 'success');
    }
  };

  const deleteCategory = async (id: string) => {
    const cat = categories.find((c) => c.id === id);
    const prodsInCat = products.filter((p) => p.category === id);

    if (prodsInCat.length > 0) {
      showToast(`Không thể xóa: Có ${prodsInCat.length} sản phẩm thuộc danh mục "${cat?.name}".`, 'warning');
      return;
    }

    const updated = categories.filter((c) => c.id !== id);
    saveCategoriesToStorage(updated);

    try {
      await api.deleteCategory(id);
      showToast(`Đã xóa danh mục "${cat?.name || id}" khỏi Database!`, 'info');
    } catch (err: any) {
      showToast(`Đã xóa danh mục "${cat?.name || id}"!`, 'info');
    }
  };

  // =========================================================================
  // Order CRUD Handlers
  // =========================================================================
  const placeOrder = async ({
    customer,
    phone,
    address,
    notes,
    items,
    paymentMethod,
  }: {
    customer: string;
    phone: string;
    address: string;
    notes?: string;
    items: CartItem[];
    paymentMethod: string;
  }): Promise<Order> => {
    const orderId = '#MS-' + Math.floor(10000 + Math.random() * 90000);
    const subtotal = items.reduce((sum, item) => sum + item.priceValue * item.quantity, 0);
    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const total = subtotal + shippingFee;

    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder: Order = {
      id: orderId,
      date,
      customer,
      phone,
      address,
      notes,
      items: [...items],
      subtotal,
      shippingFee,
      total,
      totalFormatted: formatPrice(total),
      paymentMethod,
      status: 'pending',
      statusText: 'Đang xử lý',
    };

    const updated = [newOrder, ...orders];
    saveOrdersToStorage(updated);

    try {
      const res = await api.createOrder({
        customer,
        phone,
        address,
        notes,
        items,
        subtotal,
        shippingFee,
        total,
        totalFormatted: formatPrice(total),
        paymentMethod,
      });

      if (res && res.orderId) {
        newOrder.id = res.orderId;
        const finalOrders = [newOrder, ...orders.filter((o) => o.id !== orderId)];
        saveOrdersToStorage(finalOrders);
      }
    } catch (err) {
      console.warn('Could not save order to Backend DB, saved locally:', err);
    }

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const statusTextMap: Record<Order['status'], string> = {
      pending: 'Đang xử lý',
      shipping: 'Đang giao',
      completed: 'Thành công',
      cancelled: 'Đã hủy',
    };

    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status, statusText: statusTextMap[status] } : o
    );
    saveOrdersToStorage(updated);

    try {
      await api.updateOrderStatus(orderId, status);
      showToast(`Đã cập nhật đơn ${orderId} trên Database: ${statusTextMap[status]}`, 'success');
    } catch (err) {
      showToast(`Đã cập nhật đơn ${orderId} sang: ${statusTextMap[status]}`, 'success');
    }
  };

  const updateOrder = async (orderId: string, orderData: Partial<Order>) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, ...orderData } : o));
    saveOrdersToStorage(updated);

    try {
      await api.updateOrder(orderId, orderData);
      showToast(`Đã cập nhật thông tin đơn hàng ${orderId} trên Database!`, 'success');
    } catch (err) {
      showToast(`Đã cập nhật thông tin đơn hàng ${orderId}!`, 'success');
    }
  };

  const deleteOrder = async (orderId: string) => {
    const updated = orders.filter((o) => o.id !== orderId);
    saveOrdersToStorage(updated);

    try {
      await api.deleteOrder(orderId);
      showToast(`Đã xóa đơn hàng ${orderId} khỏi Database!`, 'info');
    } catch (err) {
      showToast(`Đã xóa đơn hàng ${orderId}!`, 'info');
    }
  };

  // =========================================================================
  // Customer CRUD Handlers
  // =========================================================================
  const addCustomer = async (customerData: Partial<Customer>) => {
    const newId = customerData.id || `c_${Date.now().toString(36)}`;
    const newCustomer: Customer = {
      id: newId,
      name: customerData.name || 'Khách hàng',
      email: customerData.email || '',
      phone: customerData.phone || '',
      address: customerData.address || '',
      role: customerData.role || 'customer',
      notes: customerData.notes || '',
      totalOrders: 0,
      totalSpent: 0,
    };

    const updated = [newCustomer, ...customers];
    saveCustomersToStorage(updated);

    try {
      await api.createCustomer(newCustomer);
      showToast(`Đã thêm khách hàng "${newCustomer.name}" vào Database!`, 'success');
    } catch (err: any) {
      showToast(`Đã thêm khách hàng "${newCustomer.name}"!`, 'success');
    }
  };

  const updateCustomer = async (id: string, customerData: Partial<Customer>) => {
    const updated = customers.map((c) => (c.id === id ? { ...c, ...customerData } : c));
    saveCustomersToStorage(updated);

    try {
      await api.updateCustomer(id, customerData);
      showToast(`Đã cập nhật khách hàng "${customerData.name || id}" trên Database!`, 'success');
    } catch (err: any) {
      showToast(`Đã cập nhật thông tin khách hàng!`, 'success');
    }
  };

  const deleteCustomer = async (id: string) => {
    const c = customers.find((cust) => cust.id === id);
    const updated = customers.filter((cust) => cust.id !== id);
    saveCustomersToStorage(updated);

    try {
      await api.deleteCustomer(id);
      showToast(`Đã xóa khách hàng "${c?.name || id}" khỏi Database!`, 'info');
    } catch (err: any) {
      showToast(`Đã xóa khách hàng "${c?.name || id}"!`, 'info');
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products: mounted ? products : INITIAL_PRODUCTS,
        categories: mounted ? categories : INITIAL_CATEGORIES,
        orders: mounted ? orders : INITIAL_ORDERS,
        customers: mounted ? customers : INITIAL_CUSTOMERS,
        stats,
        isLoading,
        isBackendConnected,
        refreshData,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts,
        adjustStock,
        addCategory,
        updateCategory,
        deleteCategory,
        placeOrder,
        updateOrderStatus,
        updateOrder,
        deleteOrder,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        formatPrice,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
