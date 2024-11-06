import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/utils/Providers";

export const metadata: Metadata = {
  title: "Ed-Soc",
  description: "Educational Social Media",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-poppins antialiased `}
      >
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}
