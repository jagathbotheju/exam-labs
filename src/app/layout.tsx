import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  flex flex-col min-h-screen`}
      >
        <main className="flex grow max-w-7xl p-10 mx-auto w-full">
          <Providers>{children}</Providers>
        </main>

        <footer className="max-w-7xl mx-auto p-5 flex">
          <p>ExamLabs ©️ 2024</p>
        </footer>
      </body>
    </html>
  );
}
