import type { Metadata } from "next";
import { Forum, Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["cyrillic", "latin"],
});

const forum = Forum({
  variable: "--font-forum",
  subsets: ["cyrillic", "latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Екатерина Дроздова — авторская интерьерная керамика",
  description:
    "Авторская интерьерная керамика, вазы, светильники, ароматы и декоративные объекты ручной работы от Екатерины Дроздовой.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${forum.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
