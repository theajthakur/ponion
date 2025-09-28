import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutProvider from "@/components/providers/LayoutProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PONION - Fast & Fresh Food Delivery",
  description:
    "Order your favorite meals from local restaurants and get them delivered fast with PONION.",
  keywords: [
    "Food Delivery",
    "Online Food Order",
    "Restaurants Near Me",
    "Fast Delivery",
    "PONION App",
  ],
  authors: [{ name: "PONION Team", url: "https://yourwebsite.com" }],
  openGraph: {
    type: "website",
    url: "https://yourwebsite.com",
    title: "PONION - Fast & Fresh Food Delivery",
    description:
      "Order your favorite meals from local restaurants and get them delivered fast with PONION.",
    images: [
      {
        url: "https://yourwebsite.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "PONION App - Food Delivery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ponionapp",
    title: "PONION - Fast & Fresh Food Delivery",
    description:
      "Order your favorite meals from local restaurants and get them delivered fast with PONION.",
    images: ["https://yourwebsite.com/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  );
}
