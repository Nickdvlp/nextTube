import type { Metadata } from "next";
import "./globals.css";
// import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Next Tube",
  description: "Enjoy Videos",
};

// const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="stylesheet" href="https://uploadthing.com/styles.css" />
        </head>
        <body>
          <TRPCProvider>
            <Toaster />
            {children}
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
