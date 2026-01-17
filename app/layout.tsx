import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SmartBilling | Modern Order Management",
  description: "Efficiently manage your apparel business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} antialiased font-sans bg-slate-50 text-slate-900 h-screen flex overflow-hidden`}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto w-full relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-slate-50"></div>
          <div className="container-fluid p-4 md:p-6 lg:p-8 min-h-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
