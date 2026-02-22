import type { Metadata } from 'next';
import { Space_Grotesk, Bebas_Neue } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/components/Toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Rock N Retro | Authentic Rock & Metal Merchandise | Amman, Jordan',
  description: 'Authentic second-hand rock & metal band merchandise. Vintage tees, boots, vinyl & more. Based in Amman, Jordan.',
  icons: {
    icon: '/images/profile_hd.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${bebasNeue.variable} font-display bg-background-dark text-bone antialiased`}>
        <CartProvider>
          <ToastProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
