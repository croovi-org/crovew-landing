import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "CroVew",
  description: "CroVew landing page",
  icons: {
    icon: [
      { url: "/crovew-favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
