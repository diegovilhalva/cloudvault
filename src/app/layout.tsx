import type { Metadata } from "next";
import { Outfit } from "next/font/google"
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProvider from "@/context/query-provider";
import { Toaster as Toast } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
})

export const metadata: Metadata = {
  title: "Cloud Vault",
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
        <QueryProvider>
          {children}
          <Toast />
          <Sonner />
        </QueryProvider>
      </body>
    </html>
  );
}
