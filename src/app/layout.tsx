import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "S3 Video Manager",
  description: "Upload videos to Amazon S3 and manage metadata via Google Sheets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#f8f9ff] text-[#0b1c30] font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
