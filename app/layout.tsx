import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meme Generator",
  description: "Custom Web3 Character Meme Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
