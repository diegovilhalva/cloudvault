import type { Metadata } from "next";
import { Outfit } from "next/font/google"
import "./globals.css";
import { cn } from "@/lib/utils";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
})

export const metadata: Metadata = {
  title: "Cloud Vualt",
  description: "The only solutiuon you ever need for secure files storage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(`antialiased`, outfit.variable)}
      >
        {children}
      </body>
    </html>
  );
}
