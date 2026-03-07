// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import ToastProvider from "./components/ToastProvider";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Pressly",
//   description: "Pressly is a modern digital magazine platform where users can explore, subscribe, and read premium magazines online with seamless access and secure payments.",
//   keywords: [
//     "digital magazines",
//     "online magazine subscription",
//     "read magazines online",
//     "magazine store",
//     "Pressly",
//   ]
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body className="bg-gray-50">
//         {children}
//         <ToastProvider />
//       </body>
//     </html>
//   )
// }


import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "./components/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pressly",
  description: "Pressly is a modern digital magazine platform.",
  keywords: ["digital magazines", "Pressly"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* Added fonts to className and ensured a dark base if that's your theme */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-stone-100`}>
        {children}
        {/* This renders the actual toast notifications */}
        <ToastProvider />
      </body>
    </html>
  )
}