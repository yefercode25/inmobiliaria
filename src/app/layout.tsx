import type { Metadata } from "next";
import { Libre_Baskerville, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Libre_Baskerville({ subsets: ["latin"], weight: ['400', '700'] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: "Generar Publicación | Inmobiliaria",
  description: "Genera publicaciones de inmuebles de forma rápida y sencilla para compartir en redes sociales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${montserrat.className}`}>
        {children}
      </body>
    </html>
  );
}
