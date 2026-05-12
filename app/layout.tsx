import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WOW AI - Your Ultimate World of Warcraft Assistant",
  description: "WOW AI is your go-to assistant for all things World of Warcraft. Whether you need help with Lua addon development, WeakAuras, Mythic+ strategies, raid tactics, PvP tips, rotations, macros, or UI customization, WOW AI has got you covered. Powered by advanced AI technology, WOW AI provides expert advice and solutions to enhance your WoW experience.",
  icons: {
    icon: "/wowai-chat.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col"
      >
        {children}
      </body>
    </html>
  );
}
