import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { ShopProvider } from '@/context/ShopContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToastContainer from '@/components/ToastContainer';

export const metadata: Metadata = {
  title: 'Mini Shop - Đồ Dùng & Trang Trí Thủ Công',
  description: 'Shop bán đồ thủ công, trang trí nội thất tinh tế, tối giản cho ngôi nhà của bạn.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ToastProvider>
          <AuthProvider>
            <ShopProvider>
              <CartProvider>
                <WishlistProvider>
                  <Header />
                  <ToastContainer />
                  {children}
                  <Footer />
                </WishlistProvider>
              </CartProvider>
            </ShopProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
