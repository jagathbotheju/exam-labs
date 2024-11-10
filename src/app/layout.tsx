import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/nav/Navbar";
import { Mynerve, Noto_Sans_Sinhala } from "next/font/google";

const sinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala"],
  display: "swap",
  weight: ["100", "400", "600", "800", "900"],
  variable: "--font-sinhala",
});

const marks = Mynerve({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-marks",
});

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
  title: "ExamLabs",
  description: "practise your school exams ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sinhala.variable} ${marks.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  flex flex-col min-h-screen dark:bg-slate-900 bg-slate-50`}
      >
        <Providers>
          <Navbar />
          <main className="flex grow max-w-7xl p-10 mx-auto w-full">
            {children}
          </main>

          <footer className="max-w-7xl mx-auto p-5 flex">
            <p>ExamLabs ©️ 2024</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
