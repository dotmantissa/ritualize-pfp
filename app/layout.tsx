import "./globals.css";

export const metadata = {
  title: "Ritual | Card Generator",
  description: "Card generator for the Ritual Community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Bypass the broken build pipeline and force Tailwind to run */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
