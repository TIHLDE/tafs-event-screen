import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "700", "900"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TIHLDE — Infoskjerm",
  description: "Kommende arrangementer og nyheter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nb"
      className={`${inter.variable} ${oswald.variable} h-[100vh] w-[100vw] overflow-hidden antialiased`}
    >
      <body className="h-[100vh] w-[100vw] overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
