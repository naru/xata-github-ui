import clsx from "clsx";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextAuthProvider from "./context/NextAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "XataTest",
  description: "Github Issues UI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="h-full bg-gray-900">
      <body className={clsx("h-full", inter.className)}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html >
  );
}
