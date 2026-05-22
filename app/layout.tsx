import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitHub Roaster",
  description: "A brutal, purely algorithmic roast of your GitHub profile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <div className="bloom bloom-1" />
        <div className="bloom bloom-2" />
        {children}
      </body>
    </html>
  );
}
