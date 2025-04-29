import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { NextIntlClientProvider } from "next-intl"; 
const inter = Josefin_Sans({ subsets: ["latin"] });
import { getMessages } from "next-intl/server";
export const metadata: Metadata = {
  title: "Store Dev E-Commerce Application",
  description: "A complete e-commerce application with Next.js and Wix",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>  
        <NextIntlClientProvider>

        <Navbar />
        {children}
        <Footer />
        </NextIntlClientProvider>
        </body>
    </html>
  );
}
