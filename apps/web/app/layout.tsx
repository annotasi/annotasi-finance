import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import "./styles.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  description: "Status fondasi teknis Annotasi Finance.",
  title: "Annotasi Finance",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="id" className={cn("font-sans", geist.variable)}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
