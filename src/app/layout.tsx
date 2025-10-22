import type { Metadata } from 'next';
import { Poppins, Playfair_Display } from 'next/font/google';
import '@/styles/globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'StyleBook - Reserva tus Citas de Belleza',
  description:
    'Descubre y reserva los mejores servicios de belleza cerca de ti. Barbería, peluquería, manicura y más.',
  keywords: [
    'reservas',
    'belleza',
    'citas',
    'barbería',
    'peluquería',
    'manicura',
  ],
  authors: [{ name: 'StyleBook' }],
  openGraph: {
    title: 'StyleBook - Reserva tus Citas de Belleza',
    description:
      'Descubre y reserva los mejores servicios de belleza cerca de ti.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <html lang="es" className={`${poppins.variable} ${playfair.variable}`}>
      <body className="font-poppins antialiased">{children}</body>
    </html>
  );
}
