import type { Metadata } from "next";

import "./globals.css";



export const metadata: Metadata = {
  title: "Spliddy",
  description: "The ultimate expense sharing app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-wave w-screen ">

        {children}

      </body>
    </html>
  );
}
