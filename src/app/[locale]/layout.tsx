import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { NextIntlClientProvider } from "next-intl"; 
const inter = Josefin_Sans({ subsets: ["latin"] });
import { SessionProvider } from "next-auth/react";
import { auth } from "../../../auth";

export const metadata: Metadata = {
  title: "Store Dev E-Commerce Application",
  description: "A complete e-commerce application with Next.js and Wix",
  other: {
    "preload-images": "true",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <head>
        {/* Preload critical images for better performance */}
        <link rel="preload" as="image" href="/slider/1.jpg" />
        <link rel="preload" as="image" href="/slider/2.jpg" />
        <link rel="preload" as="image" href="/slider/3.jpg" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body className={inter.className}>  
        <NextIntlClientProvider>
        <SessionProvider
            session={session}
            refetchInterval={0}
            refetchOnWindowFocus={false}
          >
            
        <Navbar />
        {children}
        <Footer />
            
            </SessionProvider>
        </NextIntlClientProvider>
        </body>
    </html>
  );
}
